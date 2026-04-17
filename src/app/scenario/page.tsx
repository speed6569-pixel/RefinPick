import { ScenarioPlayground } from "@/components/scenario-playground";

export default function ScenarioPage() {
  return (
    <section className="section-shell">
      <span className="kicker">USER SCENARIO</span>
      <h1 className="mt-6 section-title">사용자 시나리오</h1>
      <p className="section-copy">
        사용자는 RefinPick을 통해 현재 조건을 이해하고, 갈아타기와 금리 리스크를 실제 숫자와 차트로 경험하게 됩니다.
      </p>

      <div className="mt-10">
        <ScenarioPlayground />
      </div>
    </section>
  );
}
