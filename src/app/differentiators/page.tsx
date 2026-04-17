const differentiatorCards = [
  {
    title: "의사결정 지원 서비스",
    description: "단순 계산기가 아니라 갈아타기가 실제로 유리한지 판단할 수 있도록 돕는 서비스 구조를 갖습니다.",
  },
  {
    title: "금융이론과 실사용성 결합",
    description: "경제금융학부 전공 역량과 실제 서비스 기획 감각을 함께 보여줄 수 있습니다.",
  },
  {
    title: "교육형 UX",
    description: "고정금리와 변동금리의 차이를 수치와 시각화로 체험하게 해 금융 이해도를 높입니다.",
  },
  {
    title: "현실적인 비용 반영",
    description: "중도상환수수료와 부대비용을 반영해 순절감액 중심으로 비교합니다.",
  },
];

export default function DifferentiatorsPage() {
  return (
    <section className="section-shell">
      <span className="kicker">PORTFOLIO VALUE</span>
      <h1 className="mt-6 section-title">포트폴리오용 차별점</h1>
      <p className="section-copy">
        RefinPick은 계산 정확도만이 아니라, 금융 이해도와 서비스 기획 역량을 함께 보여주는 포트폴리오 프로젝트입니다.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {differentiatorCards.map((card) => (
          <article key={card.title} className="surface-card">
            <p className="text-sm font-semibold text-emerald-700">DIFFERENTIATOR</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
