"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady) {
    return (
      <section className="section-shell">
        <div className="surface-panel max-w-2xl">
          <p className="text-sm font-semibold text-primary">세션 확인 중</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            안전한 접속 상태를 확인하고 있습니다. 잠시만 기다려 주세요.
          </p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="section-shell">
        <div className="surface-panel max-w-2xl">
          <p className="text-sm font-semibold text-primary">로그인이 필요합니다</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            이 화면은 로그인 후 접근할 수 있습니다. 데모 계정으로 로그인하면 대시보드와 상담, 이체
            흐름을 모두 확인할 수 있습니다.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="primary-button mt-6">
            로그인 페이지로 이동
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
