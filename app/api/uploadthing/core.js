// app/api/uploadthing/core.js
//
// UploadThing file route definitions.
// Defines what files can be uploaded, by whom, with what constraints.
// File data is stored at UploadThing's CDN; we save the URL to our DB.

import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "@/lib/session";
import { saveKycDocument } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  // ─── ID front/back, proof of address, source of funds ──────────
  kycDocument: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .input((input) => {
      // Caller passes: { documentType: "id_front" | "id_back" | "proof_of_address" | "source_of_funds" }
      const validTypes = ["id_front", "id_back", "proof_of_address", "source_of_funds"];
      if (!input?.documentType || !validTypes.includes(input.documentType)) {
        throw new UploadThingError("Invalid document type");
      }
      return { documentType: input.documentType };
    })
    .middleware(async ({ input }) => {
      const user = await getCurrentUser();
      if (!user) throw new UploadThingError("Authentication required");
      return { userId: user.id, documentType: input.documentType };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await saveKycDocument({
        userId: metadata.userId,
        documentType: metadata.documentType,
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
      return { uploadedBy: metadata.userId, documentType: metadata.documentType };
    }),

  // ─── Selfie (smaller limit, image only) ──────────────────────────
  kycSelfie: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new UploadThingError("Authentication required");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await saveKycDocument({
        userId: metadata.userId,
        documentType: "selfie",
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
      return { uploadedBy: metadata.userId };
    }),
};

export const config = {
  api: { bodyParser: false },
};