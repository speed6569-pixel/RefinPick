import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "RefinPick",
  description: "대출 비교, 갈아타기, 상환 시뮬레이션을 위한 금융 포트폴리오 프로젝트",
};

const navigationItems = [
  { href: "/overview", label: "개요" },
  { href: "/features", label: "기능" },
  { href: "/scenario", label: "시나리오" },
  { href: "/differentiators", label: "차별점" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight text-slate-950">
              RefinPick
            </Link>
            <nav className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-slate-950">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-500 md:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700">REFINPICK</p>
              <p className="mt-3 max-w-2xl leading-6 text-slate-600">
                대출 비교, 갈아타기, 상환 구조를 직관적으로 보여주는 경제금융학부 포트폴리오용 서비스입니다.
              </p>
            </div>
            <p>Built with Next.js, TypeScript, Tailwind CSS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
