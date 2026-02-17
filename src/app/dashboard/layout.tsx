import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const initials = user.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="glass sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/25">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              Smart Bookmarks
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                {initials}
              </div>
              <span className="hidden text-sm text-slate-600 sm:block dark:text-slate-400">
                {user.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
