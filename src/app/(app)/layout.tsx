import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/app/(bare)/login/actions";
import { AppNav } from "@/components/app/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink text-cream">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <Logo tone="light" href="/dashboard" />
          <AppNav isAdmin={session.role === "admin"} />
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[200px] truncate text-sm text-mist md:inline" title={session.email}>
              {session.email}
            </span>
            <form action={signOut}>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl border border-cream/20 px-3 text-sm text-cream hover:bg-cream/10">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-cream/10 md:hidden">
          <AppNav isAdmin={session.role === "admin"} mobile />
        </div>
      </header>
      <main id="main" className="flex-1 bg-cream">
        {children}
      </main>
      <footer className="border-t border-cream/10 bg-ink px-4 py-5 text-center text-xs text-mist">
        <Link href="/" className="hover:text-cream">
          maprizz.com
        </Link>{" "}
        · Review-link taps are taps, not reviews.
      </footer>
    </>
  );
}
