import Link from "next/link";

import { LoanSimulator } from "@/components/loan-simulator";

const featureCards = [
  {
    title: "현재 대출 상환 계산",
    description: "대출 원금, 금리, 기간, 상환방식을 입력하면 월 상환액과 총 이자를 즉시 계산합니다.",
  },
  {
    title: "갈아타기 비교",
    description: "신규 대출 조건을 입력하면 기존 대출 대비 월 부담 감소액과 총 절감액을 비교합니다.",
  },
  {
    title: "상환방식별 분석",
    description: "원리금균등, 원금균등, 만기일시상환의 차이를 사용자 관점에서 쉽게 이해할 수 있도록 구성합니다.",
  },
  {
    title: "금리 시나리오 분석",
    description: "고정금리와 변동금리의 차이, 금리 상승과 하락 시 부담 변화를 시뮬레이션합니다.",
  },
];

const experienceCards = [
  {
    title: "실시간 계산 엔진",
    description: "사용자가 대출 조건을 입력하면 월 상환액, 총 이자, 총 상환액, 순절감액이 즉시 계산됩니다.",
  },
  {
    title: "비교 카드와 결과 대시보드",
    description: "현재 대출과 갈아타기 상품의 핵심 수치를 카드와 표, 추천 해석 영역으로 함께 확인할 수 있습니다.",
  },
  {
    title: "차트 기반 이해",
    description: "막대그래프, 월별 상환 흐름 그래프, 금리 시나리오 차트로 결과를 직관적으로 전달합니다.",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="section-shell">
        <span className="kicker">CORE FEATURES</span>
        <h1 className="mt-6 section-title">핵심 기능</h1>
        <p className="section-copy">
          RefinPick은 대출 비교, 갈아타기 판단, 상환 구조 이해를 하나의 흐름으로 제공하도록 설계된 금융 시뮬레이터입니다.
        </p>
      </section>

      <section className="section-shell pt-0">
        <div className="surface-card">
          <h2 className="text-2xl font-semibold text-slate-950">기능 설명 카드</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            기능 페이지에서는 먼저 서비스가 제공하는 핵심 기능을 이해하고, 아래에서 바로 실제 계산과 비교 결과를 확인할 수 있습니다.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-emerald-700">FEATURE</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="surface-card">
          <h2 className="text-2xl font-semibold text-slate-950">기능 페이지 안에서 제공하는 구현 요소</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {experienceCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-emerald-700">IMPLEMENTED</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/scenario" className="primary-button">
              사용자 시나리오 보기
            </Link>
            <Link href="/differentiators" className="secondary-button">
              포트폴리오 차별점 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="mb-8">
          <span className="kicker">LIVE CALCULATOR</span>
          <h2 className="mt-6 section-title">실제 계산기 인터랙션 및 결과 대시보드</h2>
          <p className="section-copy">
            이 페이지 안에서 현재 대출 정보 입력, 갈아타기 상품 정보 입력, 월 상환액 계산, 총 이자 계산,
            월 절감액, 순절감액, 손익분기 시점, 비교 카드, 그래프, 상환 스케줄, 추천 해석, 금리 시나리오까지 모두 확인할 수 있습니다.
          </p>
        </div>

        <LoanSimulator />
      </section>
    </div>
  );
}
