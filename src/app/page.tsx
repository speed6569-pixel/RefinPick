import Link from "next/link";

const serviceHighlights = [
  "현재 대출의 월 상환액, 총 이자, 총 상환액 계산",
  "다른 금리와 기간의 상품으로 갈아탔을 때 절감 효과 비교",
  "고정금리와 변동금리의 차이를 시나리오로 설명",
  "상환 구조를 시각화해 금융 의사결정을 돕는 서비스",
];

export default function HomePage() {
  return (
    <div>
      <section className="section-shell">
        <div className="hero-card grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="kicker">LOAN REFINANCING SIMULATOR</span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950">
              RefinPick, 대출 비교와 갈아타기 판단을 돕는 금융 시뮬레이터
            </h1>
            <p className="section-copy">
              RefinPick은 사용자가 현재 대출 조건을 입력하면 핵심 상환 지표를 계산하고,
              다른 조건의 상품으로 갈아탔을 때 절감 효과와 리스크를 함께 비교할 수 있게 만든
              경제금융학부 포트폴리오 프로젝트입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features" className="primary-button">기능 페이지 바로가기</Link>
              <Link href="/overview" className="secondary-button">프로젝트 개요 보기</Link>
            </div>
          </div>

          <div className="surface-card bg-slate-950 text-white">
            <p className="text-sm font-semibold tracking-[0.18em] text-emerald-200">SERVICE INTRO</p>
            <div className="mt-6 space-y-4">
              {serviceHighlights.map((item) => (
                <div key={item} className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
