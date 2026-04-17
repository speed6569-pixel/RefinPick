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
  compareLoans,
  formatCurrency,
  formatPercent,
  type LoanInput,
  type RateType,
  type RepaymentMethod,
} from "@/lib/loan";

const repaymentOptions: { value: RepaymentMethod; label: string }[] = [
  { value: "equal-payment", label: "원리금균등상환" },
  { value: "equal-principal", label: "원금균등상환" },
  { value: "bullet", label: "만기일시상환" },
];

const rateOptions: { value: RateType; label: string }[] = [
  { value: "fixed", label: "고정금리" },
  { value: "variable", label: "변동금리" },
];

type LoanFormState = {
  principal: string;
  annualRate: string;
  termMonths: string;
  repaymentMethod: RepaymentMethod;
  rateType: RateType;
  upfrontCost?: string;
};

type ValidationIssue = {
  field: string;
  level: "error" | "warning";
  message: string;
};

function parseNumber(value: string) {
  const numeric = Number(value.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildLoanInput(form: LoanFormState): LoanInput {
  return {
    principal: parseNumber(form.principal),
    annualRate: parseNumber(form.annualRate),
    termMonths: parseNumber(form.termMonths),
    repaymentMethod: form.repaymentMethod,
    rateType: form.rateType,
    upfrontCost: form.upfrontCost ? parseNumber(form.upfrontCost) : 0,
  };
}

function validateLoan(form: LoanFormState, mode: "current" | "refinance"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const principal = parseNumber(form.principal);
  const annualRate = parseNumber(form.annualRate);
  const termMonths = parseNumber(form.termMonths);
  const upfrontCost = parseNumber(form.upfrontCost ?? "0");

  if (principal <= 0) issues.push({ field: `${mode}.principal`, level: "error", message: "대출 원금은 0보다 커야 합니다." });
  else if (principal < 1000000) issues.push({ field: `${mode}.principal`, level: "warning", message: "대출 원금이 100만원 미만입니다. 실제 서비스 용도인지 확인해 보세요." });

  if (annualRate < 0) issues.push({ field: `${mode}.annualRate`, level: "error", message: "금리는 음수가 될 수 없습니다." });
  else if (annualRate === 0) issues.push({ field: `${mode}.annualRate`, level: "warning", message: "금리가 0%로 입력되었습니다. 정책성 대출이 아니라면 다시 확인해 보세요." });
  else if (annualRate > 20) issues.push({ field: `${mode}.annualRate`, level: "warning", message: "금리가 매우 높습니다. 입력 단위를 다시 확인해 보세요." });

  if (termMonths <= 0) issues.push({ field: `${mode}.termMonths`, level: "error", message: "대출 기간은 1개월 이상이어야 합니다." });
  else if (termMonths < 12) issues.push({ field: `${mode}.termMonths`, level: "warning", message: "대출 기간이 12개월 미만입니다. 월 부담이 크게 보일 수 있습니다." });
  else if (termMonths > 600) issues.push({ field: `${mode}.termMonths`, level: "warning", message: "대출 기간이 50년을 초과합니다. 기간 입력이 맞는지 확인해 보세요." });

  if (form.repaymentMethod === "bullet") issues.push({ field: `${mode}.repaymentMethod`, level: "warning", message: "만기일시상환은 만기 시 원금을 한 번에 상환해야 하므로 유동성 부담이 클 수 있습니다." });
  if (form.rateType === "variable") issues.push({ field: `${mode}.rateType`, level: "warning", message: "변동금리는 향후 금리 상승 시 월 상환액과 총 이자가 커질 수 있습니다." });
  if (mode === "refinance" && upfrontCost > principal * 0.05) issues.push({ field: `${mode}.upfrontCost`, level: "warning", message: "초기 비용이 대출 원금 대비 큰 편입니다. 순절감액이 줄어들 수 있습니다." });

  return issues;
}

function buildComparisonWarnings(current: LoanInput, refinance: LoanInput, netSavings: number, monthlySavings: number, breakEvenMonth: number | null) {
  const warnings: string[] = [];
  if (netSavings <= 0) warnings.push("중도상환수수료와 부대비용까지 반영하면 현재 조건 유지가 더 유리할 수 있습니다.");
  if (monthlySavings <= 0) warnings.push("갈아타기 후 월 상환액이 줄지 않습니다. 총 이자보다 월 현금흐름이 더 중요하다면 다시 비교해 보세요.");
  if (refinance.termMonths > current.termMonths) warnings.push("갈아타기 상품의 기간이 더 길어 월 부담은 줄 수 있지만, 전체 상환 기간이 늘어날 수 있습니다.");
  if (refinance.rateType === "variable") warnings.push("갈아타기 상품이 변동금리라면 현재 계산보다 실제 부담이 커질 수 있습니다.");
  if (breakEvenMonth && breakEvenMonth > 36) warnings.push("손익분기 시점이 36개월을 넘습니다. 장기 유지 전제가 필요합니다.");
  return warnings;
}

function InputField({ label, value, onChange, suffix, issues }: { label: string; value: string; onChange: (value: string) => void; suffix?: string; issues?: ValidationIssue[] }) {
  const hasError = issues?.some((issue) => issue.level === "error");
  const hasWarning = issues?.some((issue) => issue.level === "warning");

  return (
    <label className="block text-sm font-medium text-slate-600">
      {label}
      <div className={`mt-2 flex items-center rounded-2xl border px-4 py-3 focus-within:bg-white ${hasError ? "border-rose-400 bg-rose-50 focus-within:border-rose-500" : hasWarning ? "border-amber-300 bg-amber-50 focus-within:border-amber-400" : "border-slate-300 bg-slate-50 focus-within:border-emerald-700"}`}>
        <input value={value} onChange={(event) => onChange(event.target.value.replace(/[^0-9.]/g, ""))} className="w-full bg-transparent outline-none" />
        {suffix ? <span className="text-sm text-slate-400">{suffix}</span> : null}
      </div>
      {issues?.length ? <div className="mt-2 space-y-1">{issues.map((issue) => <p key={issue.message} className={`text-xs ${issue.level === "error" ? "text-rose-600" : "text-amber-700"}`}>{issue.level === "error" ? "⚠ " : "ℹ "}{issue.message}</p>)}</div> : null}
    </label>
  );
}

function CurrencyTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-2 space-y-1 text-sm text-slate-600">{payload.map((entry) => <p key={entry.name} style={{ color: entry.color }}>{entry.name}: {formatCurrency(entry.value)}</p>)}</div>
    </div>
  );
}

function ChartBox({ title, description, children, height = 320 }: { title: string; description: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-6" style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

export function LoanSimulator() {
  const [currentLoan, setCurrentLoan] = useState<LoanFormState>({ principal: "80000000", annualRate: "4.9", termMonths: "120", repaymentMethod: "equal-payment", rateType: "fixed" });
  const [refinanceLoan, setRefinanceLoan] = useState<LoanFormState>({ principal: "80000000", annualRate: "3.8", termMonths: "120", repaymentMethod: "equal-payment", rateType: "fixed", upfrontCost: "800000" });

  const currentIssues = useMemo(() => validateLoan(currentLoan, "current"), [currentLoan]);
  const refinanceIssues = useMemo(() => validateLoan(refinanceLoan, "refinance"), [refinanceLoan]);
  const errorCount = [...currentIssues, ...refinanceIssues].filter((issue) => issue.level === "error").length;

  const currentInput = useMemo(() => buildLoanInput(currentLoan), [currentLoan]);
  const refinanceInput = useMemo(() => buildLoanInput(refinanceLoan), [refinanceLoan]);
  const comparison = useMemo(() => compareLoans(currentInput, refinanceInput), [currentInput, refinanceInput]);
  const scenarios = useMemo(() => buildVariableRateScenarios(refinanceInput, [-1, 0, 1]), [refinanceInput]);
  const schedulePreview = comparison.refinance.schedule.slice(0, 12);
  const comparisonWarnings = buildComparisonWarnings(currentInput, refinanceInput, comparison.netSavings, comparison.monthlySavings, comparison.breakEvenMonth);

  const recommendation = errorCount > 0 ? "입력값 오류를 먼저 수정해야 정확한 비교 결과를 해석할 수 있습니다." : comparison.netSavings > 0 ? "갈아타기 후 순절감액이 플러스입니다. 비용을 반영해도 경제적으로 유리한 시나리오입니다." : "부대비용까지 고려하면 절감 효과가 제한적입니다. 추가 금리 인하나 기간 조정이 필요합니다.";

  const comparisonChartRows = [
    { label: "월 상환액", 현재대출: comparison.current.monthlyPayment, 갈아타기: comparison.refinance.monthlyPayment },
    { label: "총 이자", 현재대출: comparison.current.totalInterest, 갈아타기: comparison.refinance.totalInterest },
    { label: "총 상환액", 현재대출: comparison.current.totalRepayment, 갈아타기: comparison.refinance.totalRepayment },
  ];

  const scheduleChartRows = schedulePreview.map((row) => ({ month: `${row.month}월`, 원금: row.principalPayment, 이자: row.interestPayment, 잔액: row.balance }));
  const scenarioChartRows = scenarios.map((scenario) => ({ label: scenario.label, monthlyPayment: scenario.result.monthlyPayment, totalInterest: scenario.result.totalInterest }));

  const currentFieldIssues = {
    principal: currentIssues.filter((issue) => issue.field === "current.principal"),
    annualRate: currentIssues.filter((issue) => issue.field === "current.annualRate"),
    termMonths: currentIssues.filter((issue) => issue.field === "current.termMonths"),
  };
  const refinanceFieldIssues = {
    principal: refinanceIssues.filter((issue) => issue.field === "refinance.principal"),
    annualRate: refinanceIssues.filter((issue) => issue.field === "refinance.annualRate"),
    termMonths: refinanceIssues.filter((issue) => issue.field === "refinance.termMonths"),
    upfrontCost: refinanceIssues.filter((issue) => issue.field === "refinance.upfrontCost"),
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card">
          <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">CURRENT LOAN</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">현재 대출 정보</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">실시간 계산</span></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField label="대출 원금" value={currentLoan.principal} onChange={(value) => setCurrentLoan((prev) => ({ ...prev, principal: value }))} suffix="원" issues={currentFieldIssues.principal} />
            <InputField label="연이율" value={currentLoan.annualRate} onChange={(value) => setCurrentLoan((prev) => ({ ...prev, annualRate: value }))} suffix="%" issues={currentFieldIssues.annualRate} />
            <InputField label="대출 기간" value={currentLoan.termMonths} onChange={(value) => setCurrentLoan((prev) => ({ ...prev, termMonths: value }))} suffix="개월" issues={currentFieldIssues.termMonths} />
            <label className="block text-sm font-medium text-slate-600">상환방식<select value={currentLoan.repaymentMethod} onChange={(event) => setCurrentLoan((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white">{repaymentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{currentIssues.filter((issue) => issue.field === "current.repaymentMethod").map((issue) => <p key={issue.message} className="mt-2 text-xs text-amber-700">ℹ {issue.message}</p>)}</label>
            <label className="block text-sm font-medium text-slate-600 md:col-span-2">금리 유형<div className="mt-2 grid gap-3 sm:grid-cols-2">{rateOptions.map((option) => <button key={option.value} type="button" onClick={() => setCurrentLoan((prev) => ({ ...prev, rateType: option.value }))} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${currentLoan.rateType === option.value ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600"}`}>{option.label}</button>)}</div>{currentIssues.filter((issue) => issue.field === "current.rateType").map((issue) => <p key={issue.message} className="mt-2 text-xs text-amber-700">ℹ {issue.message}</p>)}</label>
          </div>
        </section>

        <section className="surface-card">
          <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">REFINANCE OPTION</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">갈아타기 상품 정보</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">비용 반영</span></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField label="대출 원금" value={refinanceLoan.principal} onChange={(value) => setRefinanceLoan((prev) => ({ ...prev, principal: value }))} suffix="원" issues={refinanceFieldIssues.principal} />
            <InputField label="연이율" value={refinanceLoan.annualRate} onChange={(value) => setRefinanceLoan((prev) => ({ ...prev, annualRate: value }))} suffix="%" issues={refinanceFieldIssues.annualRate} />
            <InputField label="대출 기간" value={refinanceLoan.termMonths} onChange={(value) => setRefinanceLoan((prev) => ({ ...prev, termMonths: value }))} suffix="개월" issues={refinanceFieldIssues.termMonths} />
            <InputField label="중도상환수수료 + 부대비용" value={refinanceLoan.upfrontCost ?? ""} onChange={(value) => setRefinanceLoan((prev) => ({ ...prev, upfrontCost: value }))} suffix="원" issues={refinanceFieldIssues.upfrontCost} />
            <label className="block text-sm font-medium text-slate-600">상환방식<select value={refinanceLoan.repaymentMethod} onChange={(event) => setRefinanceLoan((prev) => ({ ...prev, repaymentMethod: event.target.value as RepaymentMethod }))} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white">{repaymentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{refinanceIssues.filter((issue) => issue.field === "refinance.repaymentMethod").map((issue) => <p key={issue.message} className="mt-2 text-xs text-amber-700">ℹ {issue.message}</p>)}</label>
            <label className="block text-sm font-medium text-slate-600">금리 유형<select value={refinanceLoan.rateType} onChange={(event) => setRefinanceLoan((prev) => ({ ...prev, rateType: event.target.value as RateType }))} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:bg-white">{rateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{refinanceIssues.filter((issue) => issue.field === "refinance.rateType").map((issue) => <p key={issue.message} className="mt-2 text-xs text-amber-700">ℹ {issue.message}</p>)}</label>
          </div>
        </section>
      </div>

      {errorCount > 0 ? <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">정확한 계산을 위해 먼저 오류 {errorCount}개를 수정해 주세요. 현재 결과는 참고용입니다.</div> : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="현재 월 상환액" value={formatCurrency(comparison.current.monthlyPayment)} change={`총 이자 ${formatCurrency(comparison.current.totalInterest)}`} />
        <DashboardCard title="갈아타기 월 상환액" value={formatCurrency(comparison.refinance.monthlyPayment)} change={`총 이자 ${formatCurrency(comparison.refinance.totalInterest)}`} />
        <DashboardCard title="월 절감액" value={formatCurrency(comparison.monthlySavings)} change={`총 절감액 ${formatCurrency(comparison.totalSavings)}`} />
        <DashboardCard title="순절감액" value={formatCurrency(comparison.netSavings)} change={comparison.breakEvenMonth ? `손익분기 ${comparison.breakEvenMonth}개월` : "손익분기 계산 불가"} />
      </section>

      <section className="surface-card">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">VISUAL COMPARISON</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">현재 대출 vs 갈아타기 그래프</h2></div><p className="text-sm text-slate-500">핵심 지표 시각화</p></div>
        <ChartBox title="핵심 지표 비교" description="월 상환액, 총 이자, 총 상환액을 실제 차트로 비교합니다.">
          <BarChart width={720} height={320} data={comparisonChartRows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip content={<CurrencyTooltip />} />
            <Legend />
            <Bar dataKey="현재대출" radius={[10, 10, 0, 0]} fill="#94a3b8" />
            <Bar dataKey="갈아타기" radius={[10, 10, 0, 0]} fill="#059669" />
          </BarChart>
        </ChartBox>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 overflow-hidden">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">AMORTIZATION SNAPSHOT</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">월별 상환 스케줄</h2></div><p className="text-sm text-slate-500">앞 12개월 기준</p></div>
            <div className="mt-6 overflow-x-auto"><table className="min-w-full text-left text-sm text-slate-600"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="px-4 py-3">월</th><th className="px-4 py-3">총 납입액</th><th className="px-4 py-3">원금</th><th className="px-4 py-3">이자</th><th className="px-4 py-3">잔액</th></tr></thead><tbody>{schedulePreview.map((row) => <tr key={row.month} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3">{row.month}</td><td className="px-4 py-3">{formatCurrency(row.payment)}</td><td className="px-4 py-3">{formatCurrency(row.principalPayment)}</td><td className="px-4 py-3">{formatCurrency(row.interestPayment)}</td><td className="px-4 py-3">{formatCurrency(row.balance)}</td></tr>)}</tbody></table></div>
          </div>

          <ChartBox title="월별 상환 흐름 그래프" description="원금, 이자, 잔액을 함께 확인할 수 있습니다.">
            <LineChart width={720} height={320} data={scheduleChartRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="원금" stroke="#059669" strokeWidth={3} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="이자" stroke="#94a3b8" strokeWidth={3} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="잔액" stroke="#0f172a" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ChartBox>
        </section>

        <section className="space-y-6">
          <div className="surface-card"><p className="text-sm font-semibold text-emerald-700">INTERPRETATION</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">추천 해석과 경고</h2><p className="mt-4 text-sm leading-7 text-slate-600">{recommendation}</p><div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-800">현재 대출 조건</p><ul className="mt-3 space-y-2 text-sm text-slate-600"><li>• 금리 {formatPercent(currentInput.annualRate)}</li><li>• 기간 {currentInput.termMonths}개월</li><li>• 방식 {repaymentOptions.find((item) => item.value === currentInput.repaymentMethod)?.label}</li></ul></div><div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-sm font-semibold text-emerald-800">갈아타기 상품 조건</p><ul className="mt-3 space-y-2 text-sm text-emerald-900"><li>• 금리 {formatPercent(refinanceInput.annualRate)}</li><li>• 기간 {refinanceInput.termMonths}개월</li><li>• 방식 {repaymentOptions.find((item) => item.value === refinanceInput.repaymentMethod)?.label}</li><li>• 초기 비용 {formatCurrency(refinanceInput.upfrontCost ?? 0)}</li></ul></div><div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-semibold text-amber-900">주의할 점</p><ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">{comparisonWarnings.length > 0 ? comparisonWarnings.map((warning) => <li key={warning}>• {warning}</li>) : <li>• 현재 입력 조건에서는 특별한 경고 없이 비교가 가능합니다.</li>}</ul></div></div>

          <div className="surface-card">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">RATE SCENARIOS</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">금리 시나리오 차트</h2></div><p className="text-sm text-slate-500">갈아타기 상품 기준</p></div>
            <ChartBox title="금리 변화에 따른 월 상환액" description="금리 상승과 하락 시 월 부담이 어떻게 바뀌는지 보여줍니다." height={288}>
              <BarChart width={520} height={288} data={scenarioChartRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${Math.round(value / 10000)}만`} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar dataKey="monthlyPayment" name="월 상환액" radius={[10, 10, 0, 0]}>{scenarioChartRows.map((entry) => <Cell key={entry.label} fill={entry.label === "기준 금리" ? "#059669" : entry.label.startsWith("+") ? "#dc2626" : "#2563eb"} />)}</Bar>
              </BarChart>
            </ChartBox>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{scenarios.map((scenario) => <div key={scenario.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-500">{scenario.label}</p><p className="mt-2 text-lg font-semibold text-slate-950">{formatPercent(scenario.annualRate)}</p><div className="mt-3 space-y-1 text-sm text-slate-600"><p>월 상환액 {formatCurrency(scenario.result.monthlyPayment)}</p><p>총 이자 {formatCurrency(scenario.result.totalInterest)}</p></div></div>)}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
