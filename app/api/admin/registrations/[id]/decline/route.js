// app/api/admin/registrations/[id]/decline/route.js
//
// POST /api/admin/registrations/:id/decline
// Body: { reason? }
// Admin declines a pending registration → sends a decline email.

import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import { findUserById, declineRegistration } from "@/lib/db";
import { sendRegistrationDeclinedEmail } from "@/lib/email";
import { logAdminAction, AUDIT_ACTIONS } from "@/lib/audit";
import { log } from "@/lib/logger";

const DeclineSchema = z.object({
  reason: z.string().max(500).optional(),
}).strict();

export async function POST(request, { params }) {
  return adminRoute(async () => {
    const admin = await requireAdmin();
    const { id } = params;

    let reason;
    try {
      const body = await request.json().catch(() => ({}));
      const parsed = DeclineSchema.safeParse(body);
      reason = parsed.success ? parsed.data.reason : undefined;
    } catch {}

    const user = await findUserById(id);
    if (!user || user.role !== "investor") {
      return errorResponse("User not found", 404);
    }

    if (user.registrationStatus !== "pending") {
      return errorResponse(
        `Registration is already ${user.registrationStatus}`,
        409
      );
    }

    await declineRegistration(id);

    try {
      await sendRegistrationDeclinedEmail({
        to: user.email,
        fullName: user.fullName,
        reason,
      });
    } catch (emailErr) {
      log.error("admin.registrations.decline_email_failed", {
        userId: id,
        error: emailErr?.message,
      });
    }

    await logAdminAction({
      adminId: admin.id,
      action: AUDIT_ACTIONS.DECLINE_REGISTRATION ?? "decline_registration",
      entityType: "user",
      entityId: id,
      metadata: { email: user.email, reason },
      request,
    });

    log.audit("user.registration_declined", { adminId: admin.id, userId: id, reason });

    return successResponse({ message: "Registration declined." });
  });
}
