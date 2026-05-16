// app/api/admin/stats/route.js
//
// GET /api/admin/stats
// Returns dashboard statistics for the admin home page.

import { successResponse, errorResponse } from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import { getAdminDashboardStats } from "@/lib/db";
import { log } from "@/lib/logger";

export async function GET() {
  return adminRoute(async () => {
    await requireAdmin();

    try {
      const stats = await getAdminDashboardStats();
      return successResponse({ stats });
    } catch (err) {
      log.error("admin.stats.error", { error: err?.message });
      return errorResponse("Failed to load stats", 500);
    }
  });
}