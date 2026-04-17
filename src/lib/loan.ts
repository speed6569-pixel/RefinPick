export type RepaymentMethod = "equal-payment" | "equal-principal" | "bullet";
export type RateType = "fixed" | "variable";

export type LoanInput = {
  principal: number;
  annualRate: number;
  termMonths: number;
  repaymentMethod: RepaymentMethod;
  rateType: RateType;
  upfrontCost?: number;
};

export type PaymentRow = {
  month: number;
  payment: number;
  principalPayment: number;
  interestPayment: number;
  balance: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: PaymentRow[];
};

export type ComparisonResult = {
  current: LoanResult;
  refinance: LoanResult;
  monthlySavings: number;
  interestSavings: number;
  totalSavings: number;
  netSavings: number;
  breakEvenMonth: number | null;
};

function roundCurrency(value: number) {
  return Math.round(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(roundCurrency(value));
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(input.principal, 0);
  const termMonths = Math.max(Math.floor(input.termMonths), 1);
  const monthlyRate = Math.max(input.annualRate, 0) / 100 / 12;

  if (input.repaymentMethod === "bullet") {
    const schedule: PaymentRow[] = [];
    let totalInterest = 0;

    for (let month = 1; month <= termMonths; month += 1) {
      const interestPayment = roundCurrency(principal * monthlyRate);
      const principalPayment = month === termMonths ? principal : 0;
      const payment = interestPayment + principalPayment;
      const balance = month === termMonths ? 0 : principal;
      totalInterest += interestPayment;

      schedule.push({
        month,
        payment,
        principalPayment,
        interestPayment,
        balance,
      });
    }

    return {
      monthlyPayment: schedule[0]?.payment ?? 0,
      totalInterest: roundCurrency(totalInterest),
      totalRepayment: roundCurrency(principal + totalInterest),
      schedule,
    };
  }

  if (input.repaymentMethod === "equal-principal") {
    const principalSlice = principal / termMonths;
    const schedule: PaymentRow[] = [];
    let remaining = principal;
    let totalInterest = 0;

    for (let month = 1; month <= termMonths; month += 1) {
      const interestPayment = roundCurrency(remaining * monthlyRate);
      const principalPayment = month === termMonths ? roundCurrency(remaining) : roundCurrency(principalSlice);
      const payment = principalPayment + interestPayment;
      remaining = Math.max(0, remaining - principalPayment);
      totalInterest += interestPayment;

      schedule.push({
        month,
        payment,
        principalPayment,
        interestPayment,
        balance: roundCurrency(remaining),
      });
    }

    return {
      monthlyPayment: schedule[0]?.payment ?? 0,
      totalInterest: roundCurrency(totalInterest),
      totalRepayment: roundCurrency(principal + totalInterest),
      schedule,
    };
  }

  const factor = monthlyRate === 0 ? termMonths : (monthlyRate * (1 + monthlyRate) ** termMonths) / ((1 + monthlyRate) ** termMonths - 1);
  const monthlyPayment = monthlyRate === 0 ? principal / termMonths : principal * factor;

  const schedule: PaymentRow[] = [];
  let remaining = principal;
  let totalInterest = 0;

  for (let month = 1; month <= termMonths; month += 1) {
    const interestPayment = roundCurrency(remaining * monthlyRate);
    const payment = month === termMonths ? roundCurrency(remaining + interestPayment) : roundCurrency(monthlyPayment);
    const principalPayment = roundCurrency(payment - interestPayment);
    remaining = Math.max(0, remaining - principalPayment);
    totalInterest += interestPayment;

    schedule.push({
      month,
      payment,
      principalPayment,
      interestPayment,
      balance: roundCurrency(remaining),
    });
  }

  return {
    monthlyPayment: roundCurrency(monthlyPayment),
    totalInterest: roundCurrency(totalInterest),
    totalRepayment: roundCurrency(principal + totalInterest),
    schedule,
  };
}

export function compareLoans(currentInput: LoanInput, refinanceInput: LoanInput): ComparisonResult {
  const current = calculateLoan(currentInput);
  const refinance = calculateLoan(refinanceInput);
  const upfrontCost = refinanceInput.upfrontCost ?? 0;
  const monthlySavings = current.monthlyPayment - refinance.monthlyPayment;
  const interestSavings = current.totalInterest - refinance.totalInterest;
  const totalSavings = current.totalRepayment - refinance.totalRepayment;
  const netSavings = totalSavings - upfrontCost;
  const breakEvenMonth = monthlySavings > 0 ? Math.ceil(upfrontCost / monthlySavings) : null;

  return {
    current,
    refinance,
    monthlySavings,
    interestSavings,
    totalSavings,
    netSavings,
    breakEvenMonth: Number.isFinite(breakEvenMonth) ? breakEvenMonth : null,
  };
}

export function buildVariableRateScenarios(baseInput: LoanInput, deltas: number[]) {
  return deltas.map((delta) => {
    const adjustedRate = Math.max(0, baseInput.annualRate + delta);
    const result = calculateLoan({ ...baseInput, annualRate: adjustedRate });

    return {
      label: delta === 0 ? "기준 금리" : delta > 0 ? `+${delta.toFixed(1)}%p` : `${delta.toFixed(1)}%p`,
      annualRate: adjustedRate,
      result,
    };
  });
}
