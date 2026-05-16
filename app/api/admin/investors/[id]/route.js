// app/api/admin/investors/[id]/route.js
//
// GET    /api/admin/investors/[id] — Full investor profile
// PATCH  /api/admin/investors/[id] — Update limited fields (suspend/unsuspend)

import { z } from "zod";
import { successResponse, errorResponse, verifyCsrf } from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import {
  getInvestorById,
  suspendInvestor,
  unsuspendInvestor,
  getNotesForInvestor,
} from "@/lib/db";
import { logAdminAction, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET(request, { params }) {
  return adminRoute(async () => {
    await requireAdmin();
    const { id } = params;

    const [investor, notes] = await Promise.all([
      getInvestorById(id),
      getNotesForInvestor(id),
    ]);

    if (!investor) {
      return errorResponse("Investor not found", 404);
    }

    return successResponse({
      investor: {
        ...investor,
        passwordHash: undefined, // never leak the hash
      },
      notes,
    });
  });
}

const PatchSchema = z.object({
  action: z.enum(["suspend", "unsuspend"]),
  reason: z.string().max(500).optional(),
}).strict();

export async function PATCH(request, { params }) {
  return adminRoute(async () => {
    if (!verifyCsrf(request)) {
      return errorResponse("Invalid request", 403);
    }

    const admin = await requireAdmin();
    const { id } = params;

    let raw;
    try {
      raw = await request.json();
    } catch {
      return errorResponse("Invalid body", 400);
    }

    const parsed = PatchSchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse("Invalid action", 400);
    }
    const { action, reason } = parsed.data;

    const before = await getInvestorById(id);
    if (!before) return errorResponse("Investor not found", 404);

    let after;
    let auditAction;

    if (action === "suspend") {
      if (!reason) return errorResponse("Reason is required to suspend", 400);
      after = await suspendInvestor(id, reason);
      auditAction = AUDIT_ACTIONS.INVESTOR_SUSPENDED;
    } else {
      after = await unsuspendInvestor(id);
      auditAction = AUDIT_ACTIONS.INVESTOR_UNSUSPENDED;
    }

    await logAdminAction({
      adminId: admin.id,
      action: auditAction,
      entityType: "user",
      entityId: id,
      before: { suspendedAt: before.suspendedAt, suspensionReason: before.suspensionReason },
      after: { suspendedAt: after.suspendedAt, suspensionReason: after.suspensionReason },
      metadata: { reason },
      request,
    });

    return successResponse({
      message: action === "suspend" ? "Investor suspended" : "Suspension lifted",
      investor: { ...after, passwordHash: undefined },
    });
  });
}