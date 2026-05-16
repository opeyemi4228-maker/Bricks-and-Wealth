// app/api/admin/kyc/[docId]/approve/route.js
//
// POST /api/admin/kyc/[docId]/approve
// Approves a single KYC document and recomputes the user's overall status.

import { successResponse, errorResponse, verifyCsrf } from "@/lib/auth";
import { requireAdmin, adminRoute } from "@/lib/admin-auth";
import {
  getKycDocument,
  approveKycDocument,
  recomputeUserKycStatus,
} from "@/lib/db";
import { logAdminAction, AUDIT_ACTIONS } from "@/lib/audit";

export async function POST(request, { params }) {
  return adminRoute(async () => {
    if (!verifyCsrf(request)) {
      return errorResponse("Invalid request", 403);
    }

    const admin = await requireAdmin();
    const { docId } = params;

    const doc = await getKycDocument(docId);
    if (!doc) {
      return errorResponse("Document not found", 404);
    }

    if (doc.reviewStatus === "approved") {
      return successResponse({
        message: "Already approved",
        doc,
      });
    }

    const before = {
      reviewStatus: doc.reviewStatus,
      rejectionReason: doc.rejectionReason,
    };

    const updated = await approveKycDocument({
      docId,
      reviewerAdminId: admin.id,
    });

    // Recompute the user's overall KYC status
    const kycResult = await recomputeUserKycStatus(doc.userId);

    await logAdminAction({
      adminId: admin.id,
      action: AUDIT_ACTIONS.KYC_APPROVED,
      entityType: "kyc_document",
      entityId: docId,
      before,
      after: {
        reviewStatus: updated.reviewStatus,
      },
      metadata: {
        userId: doc.userId,
        documentType: doc.documentType,
        newUserKycStatus: kycResult.newStatus,
      },
      request,
    });

    return successResponse({
      message: "Document approved",
      doc: updated,
      userKycStatus: kycResult,
    });
  });
}