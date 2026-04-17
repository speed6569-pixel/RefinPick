"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardCard } from "@/components/dashboard-card";
import {
  buildVariableRateScenarios,
  calculateLoan,
  compareLoans,
  formatCurrency,
  formatPercent,
  type LoanInput,
  type RepaymentMethod,
} from "@/lib/loan";

const repaymentOptions: { value: RepaymentMethod; label: string }[] = [
  { value: "equal-payment", label: "원리금균등상환" },
  { value: "equal-principal", label: "원금균등상환" },
  { value: "bullet", label: "만기일시상환" },
];

const scenarioTabs = [
  { id: "burden", title: "현재 대출 부담 확인" },
  { id: "refinance", title: "대출 갈아타기 검토" },
  { id: "risk", title: "금리 변동 리스크 체험" },
  { id: "repayment", title: "상환방식 선택 비교" },
] as const;

type ScenarioTab = (typeof scenarioTabs)[number]["id"];

type BasicLoanForm = {
  principal: string;
  annualRate: string;
  termMonths: string;
  repaymentMethod: RepaymentMethod;
};

type RefinanceForm = BasicLoanForm & {
  upfrontCost: string;
};

function parseNumber(value: string) {
  const numeric = Number(value.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildLoanInput(form: BasicLoanForm): LoanInput {
  return {
    principal: parseNumber(form.principal),
    annualRate: parseNumber(form.annualRate),
    termMonths: parseNumber(form.termMonths),
    repaymentMethod: form.repaymentMethod,
    rateType: "fixed",
  };
}

function buildRefinanceInput(form: RefinanceForm): LoanInput {
  return {
    ...buildLoanInput(form),
    rateType: "fixed",
    upfrontCost: parseNumber(form.upfrontCost),
  };
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-600">
      {label}
      <div className="mt-2 flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus-within:border-emerald-700 focus-within:bg-white">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full bg-transparent outline-none"
        />
        {suffix ? <span className="text-sm text-slate-400">{suffix}</span> : null}
      </div>
    </label>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-6 overflow-x-auto">{children}</div>
    </div>
  );
}

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-2 space-y-1 text-sm text-slate-600">
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ScenarioPlayground() {
  const [activeTab, setActiveTab] = useState<ScenarioTab>("burden");

  const [burdenForm, setBurdenForm] = useState<BasicLoanForm>({
    principal: "50000000",
    annualRate: "4.5",
    termMonths: "120",
    repaymentMethod: "equal-payment",
  });

  const [currentForm, setCurrentForm] = useState<BasicLoanForm>({
    principal: "80000000",
    annualRate: "4.9",
    termMonths: "120",
    repaymentMethod: "equal-payment",
  });

  const [newForm, setNewForm] = useState<RefinanceForm>({
    principal: "80000000",
    annualRate: "3.8",
    termMonths: "120",
    repaymentMethod: "equal-payment",
    upfrontCost: "800000",
  });

  const [riskForm, setRiskForm] = useState<BasicLoanForm>({
    principal: "60000000",
    annualRate: "4.1",
    termMonths: "180",
    repaymentMethod: "equal-payment",
  });

  const [repaymentForm, setRepaymentForm] = useState({
    principal: "70000000",
    annualRate: "4.2",
    termMonths: "180",
  });

  const burdenResult = useMemo(() => calculateLoan(buildLoanInput(burdenForm)), [burdenForm]);
  const refinanceResult = useMemo(
    () => compareLoans(buildLoanInput(currentForm), buildRefinanceInput(newForm)),
    [currentForm, newForm],
  );
  const riskScenarios = useMemo(
    () => buildVariableRateScenarios({ ...buildLoanInput(riskForm), rateType: "variable" }, [-1, 0, 1, 2]),
    [riskForm],
  );

  const repaymentComparison = useMemo(() => {
    const principal = parseNumber(repaymentForm.principal);
    const annualRate = parseNumber(repaymentForm.annualRate);
    const termMonths = parseNumber(repaymentForm.termMonths);

    return repaymentOptions.map((option) => ({
      label: option.label,
      method: option.value,
      result: calculateLoan({
        principal,
        annualRate,
        termMonths,
        repaymentMethod: option.value,
        rateType: "fixed",
      }),
    }));
  }, [repaymentForm]);

  const refinanceChartData = [
    { label: "월 상환액", 기존대출: refinanceResult.current.monthlyPayment, 신규대출: refinanceResult.refinance.monthlyPayment },
    { label: "총 이자", 기존대출: refinanceResult.current.totalInterest, 신규대출: refinanceResult.refinance.totalInterest },
    { label: "총 상환액", 기존대출: refinanceResult.current.totalRepayment, 신규대출: refinanceResult.refinance.totalRepayment },
  ];

  const riskChartData = riskScenarios.map((scenario) => ({
    label: scenario.label,
    월상환액: scenario.result.monthlyPayment,
    총이자: scenario.result.totalInterest,
  }));

  const repaymentChartData = repaymentComparison.map((item) => ({
    label: item.label,
    월상환액: item.result.monthlyPayment,
    총이자: item.result.totalInterest,
  }));

  const scrollToSection = (id: ScenarioTab) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {scenarioTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => scrollToSection(tab.id)}
            className={`surface-card text-left transition ${
              activeTab === tab.id ? "border-emerald-300 shadow-md" : "hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-semibold text-emerald-700">SCENARIO</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{tab.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">클릭하면 해당 기능 영역으로 이동해 직접 입력하고 결과를 확인할 수 있습니다.</p>
          </button>
        ))}
      </div>

      <section id="burden" className="space-y-6">
        <div>
          <span className="kicker">SCENARIO 1</span>
          <h2 className="mt-6 section-title">현재 대출 부담 확인</h2>
          <p className="section-copy">대출 원금, 금리, 기간, 상환방식을 입력하면 월 상환액, 총 이자, 총 상환액을 확인할 수 있습니다.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="대출 원금" value={burdenForm.principal} onChange={(value) => setBurdenForm((prev) => ({ ...prev, principal: value }))} suffix="원" />
              <Field label="연이율" value={burdenForm.annualRate} onChange={(value) => setBurdenForm((prev) => ({ ...prev, annualRate: value }))} suffix="%" />
              <Field label="대출 기간" value={burdenForm.termMonths} onChange={(value) => setBurdenForm((prev) => ({ ...prev, termMonths: value }))} suffix="개월" />
              <label className="block text-sm font-medium text-slate-600">
                상환방식
                <select
                  value={burdenForm.repaymentMethod}
                  onChange={(event) => setBurdenForm((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                >
                  {repaymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <DashboardCard title="월 상환액" value={formatCurrency(burdenResult.monthlyPayment)} />
              <DashboardCard title="총 이자" value={formatCurrency(burdenResult.totalInterest)} />
              <DashboardCard title="총 상환액" value={formatCurrency(burdenResult.totalRepayment)} />
            </div>

            <div className="surface-card overflow-x-auto">
              <h3 className="text-xl font-semibold text-slate-950">월별 상환표</h3>
              <table className="mt-6 min-w-full text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3">월</th>
                    <th className="px-4 py-3">납입액</th>
                    <th className="px-4 py-3">원금</th>
                    <th className="px-4 py-3">이자</th>
                    <th className="px-4 py-3">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {burdenResult.schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3">{row.month}</td>
                      <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                      <td className="px-4 py-3">{formatCurrency(row.principalPayment)}</td>
                      <td className="px-4 py-3">{formatCurrency(row.interestPayment)}</td>
                      <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="refinance" className="space-y-6">
        <div>
          <span className="kicker">SCENARIO 2</span>
          <h2 className="mt-6 section-title">대출 갈아타기 검토</h2>
          <p className="section-copy">기존 대출과 신규 대출 조건을 각각 입력하고 월 절감액, 총 절감액, 순절감액, 손익분기 시점을 비교합니다.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card">
            <h3 className="text-xl font-semibold text-slate-950">기존 대출 조건</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="대출 원금" value={currentForm.principal} onChange={(value) => setCurrentForm((prev) => ({ ...prev, principal: value }))} suffix="원" />
              <Field label="연이율" value={currentForm.annualRate} onChange={(value) => setCurrentForm((prev) => ({ ...prev, annualRate: value }))} suffix="%" />
              <Field label="대출 기간" value={currentForm.termMonths} onChange={(value) => setCurrentForm((prev) => ({ ...prev, termMonths: value }))} suffix="개월" />
              <label className="block text-sm font-medium text-slate-600">
                상환방식
                <select
                  value={currentForm.repaymentMethod}
                  onChange={(event) => setCurrentForm((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                >
                  {repaymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="surface-card">
            <h3 className="text-xl font-semibold text-slate-950">신규 대출 조건</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="대출 원금" value={newForm.principal} onChange={(value) => setNewForm((prev) => ({ ...prev, principal: value }))} suffix="원" />
              <Field label="연이율" value={newForm.annualRate} onChange={(value) => setNewForm((prev) => ({ ...prev, annualRate: value }))} suffix="%" />
              <Field label="대출 기간" value={newForm.termMonths} onChange={(value) => setNewForm((prev) => ({ ...prev, termMonths: value }))} suffix="개월" />
              <Field label="중도상환수수료 + 부대비용" value={newForm.upfrontCost} onChange={(value) => setNewForm((prev) => ({ ...prev, upfrontCost: value }))} suffix="원" />
              <label className="block text-sm font-medium text-slate-600 md:col-span-2">
                상환방식
                <select
                  value={newForm.repaymentMethod}
                  onChange={(event) => setNewForm((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                >
                  {repaymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="월 절감액" value={formatCurrency(refinanceResult.monthlySavings)} />
          <DashboardCard title="총 절감액" value={formatCurrency(refinanceResult.totalSavings)} />
          <DashboardCard title="순절감액" value={formatCurrency(refinanceResult.netSavings)} />
          <DashboardCard title="손익분기" value={refinanceResult.breakEvenMonth ? `${refinanceResult.breakEvenMonth}개월` : "계산 불가"} />
        </div>

        <ChartCard title="기존 대출 vs 신규 대출 비교" description="월 상환액, 총 이자, 총 상환액을 막대그래프로 비교합니다.">
          <BarChart width={760} height={320} data={refinanceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend />
            <Bar dataKey="기존대출" radius={[10, 10, 0, 0]} fill="#94a3b8" />
            <Bar dataKey="신규대출" radius={[10, 10, 0, 0]} fill="#059669" />
          </BarChart>
        </ChartCard>
      </section>

      <section id="risk" className="space-y-6">
        <div>
          <span className="kicker">SCENARIO 3</span>
          <h2 className="mt-6 section-title">금리 변동 리스크 체험</h2>
          <p className="section-copy">변동금리 대출을 기준으로 금리가 상승하거나 하락할 때 월 상환액과 총 이자가 어떻게 달라지는지 비교합니다.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="대출 원금" value={riskForm.principal} onChange={(value) => setRiskForm((prev) => ({ ...prev, principal: value }))} suffix="원" />
              <Field label="기준 금리" value={riskForm.annualRate} onChange={(value) => setRiskForm((prev) => ({ ...prev, annualRate: value }))} suffix="%" />
              <Field label="대출 기간" value={riskForm.termMonths} onChange={(value) => setRiskForm((prev) => ({ ...prev, termMonths: value }))} suffix="개월" />
              <label className="block text-sm font-medium text-slate-600">
                상환방식
                <select
                  value={riskForm.repaymentMethod}
                  onChange={(event) => setRiskForm((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white"
                >
                  {repaymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {riskScenarios.map((scenario) => (
              <DashboardCard
                key={scenario.label}
                title={scenario.label}
                value={formatCurrency(scenario.result.monthlyPayment)}
                change={`총 이자 ${formatCurrency(scenario.result.totalInterest)}`}
              />
            ))}
          </div>
        </div>

        <ChartCard title="금리 변동 시나리오 차트" description="-1%, 기본, +1%, +2% 시나리오를 비교합니다.">
          <LineChart width={760} height={320} data={riskChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis yAxisId="left" tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="월상환액" stroke="#059669" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="총이자" stroke="#0f172a" strokeWidth={3} />
          </LineChart>
        </ChartCard>
      </section>

      <section id="repayment" className="space-y-6">
        <div>
          <span className="kicker">SCENARIO 4</span>
          <h2 className="mt-6 section-title">상환방식 선택 비교</h2>
          <p className="section-copy">같은 대출금액 기준으로 상환방식별 월 납입 구조, 총 이자, 총 상환액을 비교할 수 있습니다.</p>
        </div>

        <div className="surface-card">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="대출 원금" value={repaymentForm.principal} onChange={(value) => setRepaymentForm((prev) => ({ ...prev, principal: value }))} suffix="원" />
            <Field label="연이율" value={repaymentForm.annualRate} onChange={(value) => setRepaymentForm((prev) => ({ ...prev, annualRate: value }))} suffix="%" />
            <Field label="대출 기간" value={repaymentForm.termMonths} onChange={(value) => setRepaymentForm((prev) => ({ ...prev, termMonths: value }))} suffix="개월" />
          </div>
        </div>

        <div className="surface-card overflow-x-auto">
          <h3 className="text-xl font-semibold text-slate-950">상환방식별 비교 표</h3>
          <table className="mt-6 min-w-full text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3">상환방식</th>
                <th className="px-4 py-3">월 상환액(첫 달)</th>
                <th className="px-4 py-3">총 이자</th>
                <th className="px-4 py-3">총 상환액</th>
              </tr>
            </thead>
            <tbody>
              {repaymentComparison.map((item) => (
                <tr key={item.label} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">{item.label}</td>
                  <td className="px-4 py-3">{formatCurrency(item.result.monthlyPayment)}</td>
                  <td className="px-4 py-3">{formatCurrency(item.result.totalInterest)}</td>
                  <td className="px-4 py-3">{formatCurrency(item.result.totalRepayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ChartCard title="상환방식별 시각화" description="월 상환액과 총 이자를 막대그래프로 비교합니다.">
          <BarChart width={760} height={320} data={repaymentChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend />
            <Bar dataKey="월상환액" radius={[10, 10, 0, 0]} fill="#059669" />
            <Bar dataKey="총이자" radius={[10, 10, 0, 0]} fill="#94a3b8" />
          </BarChart>
        </ChartCard>
      </section>
    </div>
  );
}
