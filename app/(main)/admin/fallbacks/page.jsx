import React from 'react';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function Page() {
  // Require authentication for admin page
  const { userId } = await auth();
  if (!userId) return redirect('/sign-in');

  const adminIds = (process.env.ADMIN_CLERK_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);

  // Quick allow if userId is in admin list from env
  const isAdminFromEnv = adminIds.length > 0 && adminIds.includes(userId);

  let events = [];
  let error = null;

  try {
    // If not explicitly allowed via env, try to resolve user email and check ADMIN_EMAILS
    if (!isAdminFromEnv) {
      const user = await db.user.findUnique({ where: { clerkUserId: userId } });
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      const isAdminByEmail = user && user.email && adminEmails.includes(user.email.toLowerCase());
      if (!isAdminByEmail) {
        return (
          <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-xl font-semibold">Access denied</h1>
            <p className="text-sm text-muted-foreground mt-2">You are not authorized to view this page.</p>
          </div>
        );
      }
    }

    // attempt to read last 20 fallback events; if the table doesn't exist
    // this will throw — we catch and show a helpful message instead of crashing
    events = await db.fallbackEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  } catch (err) {
    error = err;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Fallback events</h1>
      {error ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">Could not load fallback events.</p>
          <p className="text-xs text-muted-foreground mt-2">Reason: {String(error?.message || error)}</p>
          <p className="text-xs mt-2">If you want to persist fallback events, run the Prisma migration to add the <code>FallbackEvent</code> table.</p>
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No fallback events recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="p-3 border rounded bg-card">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>{new Date(e.createdAt).toLocaleString()}</div>
                <div className="font-medium">{e.event}</div>
              </div>
              <pre className="mt-2 text-sm overflow-auto bg-transparent">{JSON.stringify(e.details, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
