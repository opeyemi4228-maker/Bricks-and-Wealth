// app/api/admin/registrations/[id]/approve/route.js
//
// POST /api/admin/registrations/:id/approve
// Admin approves a pending registration → sends the verification email.

import {
  successResponse,
  errorResponse,
  generateToken,
  hashToken,
  TOKEN_TTL_MS,
} from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import {
  findUserById,
  approveRegistration,
  createAuthToken,
  invalidateUserTokens,
} from "@/lib/db";
import { sendRegistrationApprovedEmail } from "@/lib/email";
import { logAdminAction, AUDIT_ACTIONS } from "@/lib/audit";
import { log } from "@/lib/logger";

export async function POST(request, { params }) {
  return adminRoute(async () => {
    const admin = await requireAdmin();
    const { id } = params;

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

    // Mark as approved
    await approveRegistration(id);

    // Generate verification token and send email
    await invalidateUserTokens(id, "register");
    const rawToken = generateToken();
    await createAuthToken({
      userId: id,
      tokenHash: hashToken(rawToken),
      type: "register",
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    try {
      await sendRegistrationApprovedEmail({
        to: user.email,
        fullName: user.fullName,
        token: rawToken,
      });
    } catch (emailErr) {
      log.error("admin.registrations.approve_email_failed", {
        userId: id,
        error: emailErr?.message,
      });
      return errorResponse("Approved but failed to send email. Try again.", 500);
    }

    await logAdminAction({
      adminId: admin.id,
      action: AUDIT_ACTIONS.APPROVE_REGISTRATION ?? "approve_registration",
      entityType: "user",
      entityId: id,
      metadata: { email: user.email },
      request,
    });

    log.audit("user.registration_approved", { adminId: admin.id, userId: id });

    return successResponse({ message: "Registration approved and email sent." });
  });
}
