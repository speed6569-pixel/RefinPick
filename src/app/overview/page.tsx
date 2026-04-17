const overviewCards = [
  {
    title: "프로젝트 목적",
    description: "대출 상환 구조를 직관적으로 이해하고, 갈아타기 여부를 수치 기반으로 판단할 수 있게 돕습니다.",
  },
  {
    title: "핵심 문제",
    description: "금리, 기간, 상환방식 변화가 월 부담과 총 이자에 어떤 영향을 주는지 일반 사용자가 한눈에 파악하기 어렵습니다.",
  },
  {
    title: "서비스 방향",
    description: "단순 계산기를 넘어서, 금융 의사결정 지원과 교육형 UX를 함께 제공하는 서비스로 설계했습니다.",
  },
];

export default function OverviewPage() {
  return (
    <section className="section-shell">
      <span className="kicker">PROJECT OVERVIEW</span>
      <h1 className="mt-6 section-title">프로젝트 개요</h1>
      <p className="section-copy">
        RefinPick은 사용자가 현재 대출 조건을 입력하면 월 상환액, 총 이자, 총 상환액을 계산하고,
        다른 금리와 기간 상품으로 갈아탔을 때의 절감 효과를 비교해주는 금융 의사결정 지원 서비스입니다.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {overviewCards.map((card) => (
          <article key={card.title} className="surface-card">
            <p className="text-sm font-semibold text-emerald-700">OVERVIEW</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
