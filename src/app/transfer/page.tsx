import Link from "next/link";

export default function TransferPage() {
  return (
    <section className="section-shell">
      <span className="kicker">REFINANCING FOCUS</span>
      <h1 className="mt-6 section-title">갈아타기 비교 핵심 포인트</h1>
      <p className="section-copy">
        RefinPick의 핵심은 단순 계산이 아니라, 갈아타기가 실제로 유리한지 판단할 수 있게 만드는 데 있습니다.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="surface-card">
          <h2 className="text-2xl font-semibold text-slate-950">무엇을 비교하는가</h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <li>• 현재 대출과 신규 대출의 월 상환액 차이</li>
            <li>• 총 이자와 총 상환액 차이</li>
            <li>• 중도상환수수료, 부대비용 반영 후 순절감액</li>
            <li>• 비용을 회수하는 손익분기 시점</li>
          </ul>
        </div>

        <div className="surface-card">
          <h2 className="text-2xl font-semibold text-slate-950">바로 계산해보기</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            현재 구현은 기능 페이지 안에서 실제 계산, 비교, 그래프, 상환 스케줄, 추천 해석까지 모두 확인할 수 있도록 통합되어 있습니다.
          </p>
          <div className="mt-6">
            <Link href="/features" className="primary-button">기능 페이지 계산기로 이동</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
