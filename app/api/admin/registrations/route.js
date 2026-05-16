// app/api/admin/registrations/route.js
//
// GET /api/admin/registrations
// Returns all users with registrationStatus = "pending"

import { successResponse, errorResponse } from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import { getPendingRegistrations } from "@/lib/db";
import { log } from "@/lib/logger";

export async function GET() {
  return adminRoute(async () => {
    await requireAdmin();

    try {
      const registrations = await getPendingRegistrations({ limit: 200 });
      return successResponse({ registrations, total: registrations.length });
    } catch (err) {
      log.error("admin.registrations.list_error", { error: err?.message });
      return errorResponse("Failed to load registrations", 500);
    }
  });
}
