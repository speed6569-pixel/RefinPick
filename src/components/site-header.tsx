"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { navItems } from "@/data/demo";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isReady, logout, userEmail } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary font-bold text-white shadow-soft">
            B
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-primary">BANKFLOW</p>
            <p className="text-xs text-slate-500">Digital Banking Experience Demo</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="status-pill">Demo Environment</span>
          {isReady && isAuthenticated ? (
            <>
              <span className="status-pill">{userEmail}</span>
              <button type="button" onClick={logout} className="secondary-button px-4 py-2 text-xs">
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="secondary-button px-4 py-2 text-xs">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
