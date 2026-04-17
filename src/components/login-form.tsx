"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/data/auth";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { isAuthenticated, isReady, login } = useAuth();

  const [email, setEmail] = useState(DEMO_USER_EMAIL);
  const [password, setPassword] = useState(DEMO_USER_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isReady, redirectTo, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await login(email.trim(), password);

    if (!result.ok) {
      setError(result.message ?? "로그인에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <form className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft" onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-semibold text-primary">개인뱅킹 로그인</p>
          <p className="mt-1 text-sm text-slate-500">안전한 접속 환경을 가정한 시연 화면</p>
        </div>
        <span className="status-pill">Cognito Ready</span>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-600">
          이메일
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
          />
        </label>
        <label className="block text-sm font-medium text-slate-600">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
          />
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "접속 정보를 확인하는 중..." : "로그인 후 대시보드 이동"}
        </button>
        <Link href="/ai-chat" className="secondary-button">
          AI 상담 보기
        </Link>
      </div>

      <p className="mt-6 text-xs leading-6 text-slate-500">
        본 화면은 발표용 데모입니다. 실제 서비스에서는 다중 인증, 기기 등록, 이상 거래 탐지 흐름이
        추가됩니다.
      </p>
    </form>
  );
}
