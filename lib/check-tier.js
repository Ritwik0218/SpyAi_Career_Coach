"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const ADMIN_EMAIL = "007harshit.mathur.24@gmail.com";

/**
 * Returns the current user's DB record with their tier.
 * Throws if not authenticated.
 */
export async function getCurrentUserWithTier() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  // Admin bypasses everything
  const isAdmin = clerkUser.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!user) throw new Error("User not found. Please complete onboarding.");

  return { user, isAdmin, isPro: isAdmin || user.tier === "PRO" };
}

/**
 * Throws an error if the user is not PRO or Admin.
 * Use this at the top of any PRO-gated server action.
 */
export async function requireProAccess() {
  const { isPro } = await getCurrentUserWithTier();
  if (!isPro) {
    throw new Error("PRO_REQUIRED");
  }
}
