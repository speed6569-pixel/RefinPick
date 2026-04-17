const productIdeas = [
  "주택담보대출 갈아타기 시뮬레이션",
  "학자금대출 상환 계획 비교",
  "신용대출 금리 비교와 월 부담 분석",
  "우대금리 적용 시 절감 효과 계산",
];

export default function ProductsPage() {
  return (
    <section className="section-shell">
      <span className="kicker">EXPANSION ROADMAP</span>
      <h1 className="mt-6 section-title">확장 가능한 상품 시뮬레이션</h1>
      <p className="section-copy">
        RefinPick은 하나의 계산기를 넘어, 다양한 대출 상품 유형으로 확장할 수 있는 구조를 목표로 합니다.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {productIdeas.map((item) => (
          <div key={item} className="surface-card">
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
