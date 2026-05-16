// lib/db.js
//
// Complete database layer for Brick & Wealth.
// All API routes import from here.
//
// Covers:
//   - Users, auth tokens, login attempts, sessions  (auth flow)
//   - Onboarding progress, profile updates           (onboarding flow)
//   - KYC documents                                  (verification flow)
//   - Consents                                       (compliance flow)
//   - Account activation gate                        (final unlock)
//   - Admin: dashboard stats, investor list, KYC queue, notes, audit
//
// If you change ORMs later, only this file changes.

import { prisma } from "@/lib/prisma";

// ════════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════════

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createPendingUser({ email, fullName, username, residency, country }) {
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      fullName,
      username: username.toLowerCase(),
      residency,
      country,
      emailVerified: false,
      passwordHash: null,
      registrationStatus: "pending",
    },
  });
}

export async function deleteUser(userId) {
  return prisma.user.delete({ where: { id: userId } });
}

export async function activateUser(userId, passwordHash) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true, passwordHash },
  });
}

export async function updateUserPassword(userId, passwordHash) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

// ════════════════════════════════════════════════════════════════════
// AUTH TOKENS (register / reset / session — single table)
// ════════════════════════════════════════════════════════════════════

export async function createAuthToken({ userId, tokenHash, type, expiresAt }) {
  return prisma.authToken.create({
    data: { userId, tokenHash, type, expiresAt },
  });
}

export async function findValidToken(tokenHash, type) {
  return prisma.authToken.findFirst({
    where: {
      tokenHash,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function consumeToken(tokenId) {
  return prisma.authToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}

export async function invalidateUserTokens(userId, type) {
  return prisma.authToken.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  });
}

// ════════════════════════════════════════════════════════════════════
// LOGIN ATTEMPTS (audit + lockout)
// ════════════════════════════════════════════════════════════════════

export async function recordLoginAttempt({ email, ip, userAgent, success }) {
  return prisma.loginAttempt.create({
    data: { email, ip, userAgent, success },
  });
}

export async function countRecentFailedLogins(email, windowMs) {
  const since = new Date(Date.now() - windowMs);
  return prisma.loginAttempt.count({
    where: { email, success: false, createdAt: { gte: since } },
  });
}

// ════════════════════════════════════════════════════════════════════
// SESSIONS (stored as AuthToken with type="session")
// ════════════════════════════════════════════════════════════════════

export async function createSession({ userId, tokenHash, expiresAt }) {
  return prisma.authToken.create({
    data: { userId, tokenHash, type: "session", expiresAt },
  });
}

export async function findSessionByTokenHash(tokenHash) {
  return prisma.authToken.findFirst({
    where: {
      tokenHash,
      type: "session",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
}

export async function revokeSession(tokenHash) {
  return prisma.authToken.updateMany({
    where: { tokenHash, type: "session" },
    data: { usedAt: new Date() },
  });
}

// ════════════════════════════════════════════════════════════════════
// ONBOARDING PROGRESS
// ════════════════════════════════════════════════════════════════════

export async function getOrCreateOnboardingProgress(userId) {
  return prisma.onboardingProgress.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function updateOnboardingStep(userId, step, extra = {}) {
  return prisma.onboardingProgress.upsert({
    where: { userId },
    update: { currentStep: step, ...extra },
    create: { userId, currentStep: step, ...extra },
  });
}

// ════════════════════════════════════════════════════════════════════
// USER PROFILE (onboarding step 2)
// ════════════════════════════════════════════════════════════════════

export async function updateUserProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      ageConfirmed: data.ageConfirmed,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      region: data.region,
      postcode: data.postcode,
      postcodeFormat: data.postcodeFormat,
      phoneNumber: data.phoneNumber,
      occupation: data.occupation,
      sourceOfFunds: data.sourceOfFunds,
      sourceOfFundsDetail: data.sourceOfFundsDetail,
      estimatedNetWorth: data.estimatedNetWorth,
      investorType: data.investorType,
      onboardingComplete: true,
    },
  });
}

// ════════════════════════════════════════════════════════════════════
// KYC DOCUMENTS
// ════════════════════════════════════════════════════════════════════

export async function saveKycDocument({
  userId, documentType, fileUrl, fileName, fileSize, mimeType,
}) {
  // Upsert pattern — if user re-uploads same type, replace the URL
  const existing = await prisma.kycDocument.findFirst({
    where: { userId, documentType },
  });

  if (existing) {
    return prisma.kycDocument.update({
      where: { id: existing.id },
      data: {
        fileUrl, fileName, fileSize, mimeType,
        uploadedAt: new Date(),
        reviewStatus: "pending",
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: null,
      },
    });
  }
  return prisma.kycDocument.create({
    data: { userId, documentType, fileUrl, fileName, fileSize, mimeType },
  });
}

export async function getUserKycDocuments(userId) {
  return prisma.kycDocument.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function markKycSubmitted(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { kycComplete: true, kycStatus: "pending_review" },
  });
}

// ════════════════════════════════════════════════════════════════════
// CONSENTS
// ════════════════════════════════════════════════════════════════════

export async function recordConsent({
  userId, consentType, documentVersion, granted, ip, userAgent,
}) {
  return prisma.consent.upsert({
    where: {
      userId_consentType_documentVersion: {
        userId,
        consentType,
        documentVersion,
      },
    },
    update: { granted, grantedAt: new Date(), ip, userAgent },
    create: {
      userId, consentType, documentVersion, granted, ip, userAgent,
    },
  });
}

export async function getUserConsents(userId) {
  return prisma.consent.findMany({
    where: { userId },
    orderBy: { grantedAt: "desc" },
  });
}

export async function markConsentsComplete(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { consentsComplete: true },
  });
}

// ════════════════════════════════════════════════════════════════════
// ACCOUNT ACTIVATION (the final gate)
// ════════════════════════════════════════════════════════════════════

export async function activateAccountIfReady(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const ready =
    user.emailVerified &&
    user.onboardingComplete &&
    user.kycComplete &&
    user.consentsComplete;

  if (ready && !user.accountActivated) {
    return prisma.user.update({
      where: { id: userId },
      data: { accountActivated: true },
    });
  }
  return user;
}

// ════════════════════════════════════════════════════════════════════
// REGISTRATION APPROVAL (admin-controlled)
// ════════════════════════════════════════════════════════════════════

export async function getPendingRegistrations({ limit = 100 } = {}) {
  return prisma.user.findMany({
    where: { role: "investor", registrationStatus: "pending" },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      residency: true,
      country: true,
      createdAt: true,
      registrationStatus: true,
    },
  });
}

export async function approveRegistration(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { registrationStatus: "approved" },
  });
}

export async function declineRegistration(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { registrationStatus: "declined" },
  });
}

// ════════════════════════════════════════════════════════════════════
// MAINTENANCE (optional cron)
// ════════════════════════════════════════════════════════════════════

export async function purgeExpiredTokens() {
  return prisma.authToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null, lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      ],
    },
  });
}

// ════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════
//
//                  ADMIN FUNCTIONS (Phase 2)
//
// ════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════
// ADMIN: DASHBOARD STATS
// ════════════════════════════════════════════════════════════════════

export async function getAdminDashboardStats() {
  const [
    totalInvestors,
    activatedInvestors,
    pendingKyc,
    pendingKycDocs,
    flaggedInvestors,
    newSignups7d,
    rejectedKyc,
    pendingRegistrations,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "investor" } }),
    prisma.user.count({
      where: { role: "investor", accountActivated: true },
    }),
    prisma.user.count({
      where: { role: "investor", kycStatus: "pending_review" },
    }),
    prisma.kycDocument.count({ where: { reviewStatus: "pending" } }),
    prisma.user.count({
      where: { role: "investor", flaggedForReview: true },
    }),
    prisma.user.count({
      where: {
        role: "investor",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.user.count({
      where: { role: "investor", kycStatus: "rejected" },
    }),
    // Guard: registrationStatus may not be in the Prisma client if generate
    // hasn't run yet after the migration. Use $queryRaw to be safe.
    prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "User" WHERE role = 'investor' AND "registrationStatus" = 'pending'`
      .then((rows) => Number(rows[0]?.count ?? 0))
      .catch(() => 0),
  ]);

  return {
    totalInvestors,
    activatedInvestors,
    pendingKyc,
    pendingKycDocs,
    flaggedInvestors,
    newSignups7d,
    rejectedKyc,
    pendingRegistrations,
    notVerified: totalInvestors - activatedInvestors,
  };
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: INVESTOR LIST (with search, filter, pagination)
// ════════════════════════════════════════════════════════════════════

/**
 * List investors with filtering and pagination.
 *
 * @param {Object} opts
 * @param {string} [opts.search]      Search by name, email, username
 * @param {string} [opts.kycStatus]   Filter by KYC status
 * @param {string} [opts.country]     Filter by country code
 * @param {string} [opts.tag]         Filter by single tag
 * @param {boolean} [opts.flagged]    Show only flagged
 * @param {string} [opts.role]        Filter by role (default: investor)
 * @param {string} [opts.sortBy]      "newest"|"oldest"|"name"|"last_seen"
 * @param {number} [opts.page]        Page number (1-indexed)
 * @param {number} [opts.pageSize]    Results per page (default: 25)
 */
export async function listInvestors({
  search,
  kycStatus,
  country,
  tag,
  flagged,
  role,
  sortBy = "newest",
  page = 1,
  pageSize = 25,
} = {}) {
  const where = {};

  if (role) {
    where.role = role;
  } else {
    where.role = "investor";
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];
  }

  if (kycStatus) where.kycStatus = kycStatus;
  if (country) where.country = country.toUpperCase();
  if (tag) where.tags = { has: tag };
  if (flagged !== undefined) where.flaggedForReview = flagged;

  const orderBy = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    name: { fullName: "asc" },
    last_seen: { lastSeenAt: "desc" },
  }[sortBy] || { createdAt: "desc" };

  const skip = Math.max(0, (page - 1) * pageSize);

  const [investors, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        residency: true,
        country: true,
        emailVerified: true,
        kycStatus: true,
        accountActivated: true,
        flaggedForReview: true,
        flagReason: true,
        tags: true,
        suspendedAt: true,
        lastSeenAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    investors,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: SINGLE INVESTOR (with full details)
// ════════════════════════════════════════════════════════════════════

export async function getInvestorById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      kycDocuments: {
        orderBy: { uploadedAt: "desc" },
      },
      consents: {
        orderBy: { grantedAt: "desc" },
      },
      onboardingProgress: true,
    },
  });
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: INVESTOR MODIFICATIONS
// ════════════════════════════════════════════════════════════════════

export async function updateInvestorTags(userId, tags) {
  return prisma.user.update({
    where: { id: userId },
    data: { tags },
    select: { id: true, tags: true },
  });
}

export async function flagInvestor(userId, reason) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      flaggedForReview: true,
      flagReason: reason,
    },
  });
}

export async function unflagInvestor(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      flaggedForReview: false,
      flagReason: null,
    },
  });
}

export async function suspendInvestor(userId, reason) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: new Date(),
      suspensionReason: reason,
    },
  });
}

export async function unsuspendInvestor(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: null,
      suspensionReason: null,
    },
  });
}

export async function updateUserRole(userId, role) {
  if (!["investor", "admin", "super_admin"].includes(role)) {
    throw new Error("Invalid role");
  }
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, role: true, email: true, fullName: true },
  });
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: NOTES
// ════════════════════════════════════════════════════════════════════

export async function addAdminNote({ targetUserId, authorAdminId, content }) {
  return prisma.adminNote.create({
    data: {
      targetUserId,
      authorAdminId,
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function getNotesForInvestor(userId) {
  return prisma.adminNote.findMany({
    where: { targetUserId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteAdminNote(noteId, requestingAdminId) {
  // Only the author or a super_admin can delete
  const note = await prisma.adminNote.findUnique({ where: { id: noteId } });
  if (!note) throw new Error("Note not found");
  if (note.authorAdminId !== requestingAdminId) {
    const admin = await prisma.user.findUnique({
      where: { id: requestingAdminId },
      select: { role: true },
    });
    if (admin?.role !== "super_admin") {
      throw new Error("Only the author or super_admin can delete this note");
    }
  }
  return prisma.adminNote.delete({ where: { id: noteId } });
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: KYC QUEUE
// ════════════════════════════════════════════════════════════════════

export async function getKycQueue({ limit = 50 } = {}) {
  return prisma.user.findMany({
    where: {
      role: "investor",
      kycStatus: "pending_review",
    },
    include: {
      kycDocuments: {
        orderBy: { uploadedAt: "desc" },
      },
      onboardingProgress: {
        select: {
          kycSubmittedAt: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: KYC DOCUMENT ACTIONS
// ════════════════════════════════════════════════════════════════════

export async function getKycDocument(docId) {
  return prisma.kycDocument.findUnique({
    where: { id: docId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          kycStatus: true,
        },
      },
    },
  });
}

export async function approveKycDocument({ docId, reviewerAdminId }) {
  return prisma.kycDocument.update({
    where: { id: docId },
    data: {
      reviewStatus: "approved",
      reviewedAt: new Date(),
      reviewedBy: reviewerAdminId,
      rejectionReason: null,
    },
  });
}

export async function rejectKycDocument({ docId, reviewerAdminId, reason }) {
  return prisma.kycDocument.update({
    where: { id: docId },
    data: {
      reviewStatus: "rejected",
      reviewedAt: new Date(),
      reviewedBy: reviewerAdminId,
      rejectionReason: reason,
    },
  });
}

/**
 * After approving/rejecting any KYC document, recompute the user's
 * overall kycStatus. Call this from the approve/reject API routes.
 *
 * Returns { newStatus, allApproved, anyRejected }
 */
export async function recomputeUserKycStatus(userId) {
  const docs = await prisma.kycDocument.findMany({
    where: { userId },
    select: { documentType: true, reviewStatus: true },
  });

  const REQUIRED = ["id_front", "id_back", "proof_of_address", "selfie", "source_of_funds"];

  const statusByType = {};
  for (const doc of docs) {
    statusByType[doc.documentType] = doc.reviewStatus;
  }

  const allApproved = REQUIRED.every((t) => statusByType[t] === "approved");
  const anyRejected = REQUIRED.some((t) => statusByType[t] === "rejected");

  let newStatus;
  if (anyRejected) {
    newStatus = "rejected";
  } else if (allApproved) {
    newStatus = "approved";
  } else {
    newStatus = "pending_review";
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: newStatus },
  });

  // If newly approved AND all other conditions met, activate account
  if (newStatus === "approved" && updated.consentsComplete && updated.onboardingComplete) {
    await prisma.user.update({
      where: { id: userId },
      data: { accountActivated: true },
    });
  }

  return { newStatus, allApproved, anyRejected };
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: ADMIN USER LIST (for super_admin team management)
// ════════════════════════════════════════════════════════════════════

export async function listAdmins() {
  return prisma.user.findMany({
    where: {
      OR: [{ role: "admin" }, { role: "super_admin" }],
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      lastSeenAt: true,
      createdAt: true,
      suspendedAt: true,
    },
  });
}

// ════════════════════════════════════════════════════════════════════
// ADMIN: LAST-SEEN TRACKING
// ════════════════════════════════════════════════════════════════════

/**
 * Update the user's lastSeenAt timestamp. Call from admin login + heartbeat.
 * Best-effort — doesn't throw if update fails.
 */
export async function bumpLastSeen(userId) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() },
    });
  } catch (err) {
    console.error("[bumpLastSeen] Failed:", err);
  }
}