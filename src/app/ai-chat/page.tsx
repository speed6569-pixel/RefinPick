const scenarioCards = [
  {
    title: "금리 상승 시나리오",
    description: "변동금리 상품에서 금리가 1%p 상승하면 월 상환액과 총 이자가 얼마나 늘어나는지 보여줍니다.",
  },
  {
    title: "금리 하락 시나리오",
    description: "시장 금리 하락 시 갈아타기 없이 유지하는 편이 유리한지 비교할 수 있습니다.",
  },
  {
    title: "고정 vs 변동 비교",
    description: "안정성과 잠재 절감 효과 사이의 차이를 교육형 UX로 설명합니다.",
  },
];

export default function AiChatPage() {
  return (
    <section className="section-shell">
      <span className="kicker">RATE SCENARIO LAB</span>
      <h1 className="mt-6 section-title">고정금리와 변동금리 이해 화면</h1>
      <p className="section-copy">
        단순 계산을 넘어, 금리 변화가 실제 부담에 어떤 영향을 주는지 사용자 스스로 체감할 수 있게 만드는 교육형 화면입니다.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {scenarioCards.map((card) => (
          <article key={card.title} className="surface-card">
            <p className="text-sm font-semibold text-emerald-700">SCENARIO</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
