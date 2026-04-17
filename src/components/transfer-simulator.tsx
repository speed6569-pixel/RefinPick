"use client";

import { FormEvent, useState } from "react";

const mockAccounts = [
  { name: "주거래 입출금 계좌", balance: 5420000 },
  { name: "생활비 통장", balance: 1680000 },
  { name: "비상금 통장", balance: 920000 },
];
const mockTargets = ["홍길동", "신한카드 결제계좌", "적금 자동이체"];

const transferSteps = ["이체 정보 입력", "이체 정보 확인", "이체 완료"];

type TransferStep = "form" | "review" | "complete";

function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function TransferSimulator() {
  const [fromAccount, setFromAccount] = useState(mockAccounts[0].name);
  const [target, setTarget] = useState(mockTargets[0]);
  const [amount, setAmount] = useState("500000");
  const [memo, setMemo] = useState("생활비 이체");
  const [step, setStep] = useState<TransferStep>("form");
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    fromAccount: string;
    target: string;
    amount: number;
    memo: string;
    transactionId: string;
    completedAt: string;
  } | null>(null);

  const selectedAccount = mockAccounts.find((account) => account.name === fromAccount) ?? mockAccounts[0];
  const numericAmount = Number(amount);
  const fee = 0;
  const remainingBalance = selectedAccount.balance - numericAmount - fee;

  const validateTransfer = () => {
    if (!numericAmount || numericAmount < 1000) {
      return "최소 이체 금액은 1,000원입니다.";
    }

    if (numericAmount > selectedAccount.balance) {
      return "출금 계좌 잔액이 부족합니다. 금액을 다시 확인해 주세요.";
    }

    return null;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateTransfer();

    if (validationError) {
      setError(validationError);
      setStep("form");
      return;
    }

    setError(null);
    setStep("review");
  };

  const handleConfirm = () => {
    const now = new Date();

    setReceipt({
      fromAccount,
      target,
      amount: numericAmount,
      memo,
      transactionId: `BF-${now.getTime().toString().slice(-8)}`,
      completedAt: now.toLocaleString("ko-KR"),
    });
    setError(null);
    setStep("complete");
  };

  const handleReset = () => {
    setStep("form");
    setError(null);
    setReceipt(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold text-primary">안정성 평가용 구현 모듈</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">이체 시뮬레이션</h3>
          </div>
          <span className="status-pill">실행 가능</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {transferSteps.map((label, index) => {
            const isActive =
              (step === "form" && index === 0) ||
              (step === "review" && index === 1) ||
              (step === "complete" && index === 2);
            const isComplete = (step === "review" && index === 0) || step === "complete";

            return (
              <div
                key={label}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  isActive
                    ? "border-primary bg-blue-50 text-primary"
                    : isComplete
                      ? "border-slate-300 bg-slate-50 text-slate-700"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <p className="text-xs font-semibold tracking-[0.16em]">STEP {index + 1}</p>
                <p className="mt-1 font-medium">{label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            출금 계좌
            <select
              value={fromAccount}
              onChange={(event) => {
                setFromAccount(event.target.value);
                setError(null);
                if (step !== "form") {
                  setStep("form");
                }
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
              disabled={step !== "form"}
            >
              {mockAccounts.map((account) => (
                <option key={account.name}>{account.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              출금 가능 금액: {formatCurrency(selectedAccount.balance)}
            </p>
          </label>

          <label className="block text-sm font-medium text-slate-600">
            받는 사람
            <select
              value={target}
              onChange={(event) => {
                setTarget(event.target.value);
                setError(null);
                if (step !== "form") {
                  setStep("form");
                }
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
              disabled={step !== "form"}
            >
              {mockTargets.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-600">
            이체 금액
            <input
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value.replace(/[^0-9]/g, ""));
                setError(null);
                if (step !== "form") {
                  setStep("form");
                }
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
              disabled={step !== "form"}
            />
          </label>

          <label className="block text-sm font-medium text-slate-600">
            받는 통장 메모
            <input
              value={memo}
              onChange={(event) => {
                setMemo(event.target.value);
                if (step !== "form") {
                  setStep("form");
                }
              }}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
              disabled={step !== "form"}
            />
          </label>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {step === "review" ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-primary">이체 정보 확인</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-4">
                <span>출금 계좌</span>
                <span className="font-medium text-slate-950">{fromAccount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>받는 사람</span>
                <span className="font-medium text-slate-950">{target}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>이체 금액</span>
                <span className="font-medium text-slate-950">{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>수수료</span>
                <span className="font-medium text-slate-950">{formatCurrency(fee)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                <span>이체 후 예상 잔액</span>
                <span className="font-semibold text-primary">{formatCurrency(remainingBalance)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>메모</span>
                <span className="font-medium text-slate-950">{memo || "없음"}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {step === "form" ? (
            <button type="submit" className="primary-button">
              이체 정보 확인
            </button>
          ) : null}

          {step === "review" ? (
            <>
              <button type="button" onClick={handleConfirm} className="primary-button">
                이체 실행
              </button>
              <button type="button" onClick={() => setStep("form")} className="secondary-button">
                다시 입력
              </button>
            </>
          ) : null}

          {step === "complete" ? (
            <button type="button" onClick={handleReset} className="secondary-button">
              새 이체 작성
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-primary">검증 포인트</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• 금액 입력 유효성 검사</li>
            <li>• 입력, 확인, 완료 단계 분리</li>
            <li>• 잔액 부족 여부와 완료 후 영수증 스타일 제공</li>
            <li>• 실제 연결 시 거래 로그 적재 위치 명시</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold tracking-[0.16em] text-slate-300">실행 결과</p>

          {step === "complete" && receipt ? (
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div>
                <p className="text-base font-semibold text-white">이체가 정상적으로 완료되었습니다.</p>
                <p className="mt-1 text-slate-300">실제 서비스에서는 Lambda 처리 결과와 거래 로그가 함께 저장됩니다.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span>거래 번호</span>
                    <span className="font-medium text-white">{receipt.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>완료 시각</span>
                    <span className="font-medium text-white">{receipt.completedAt}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>출금 계좌</span>
                    <span className="font-medium text-white">{receipt.fromAccount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>받는 사람</span>
                    <span className="font-medium text-white">{receipt.target}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                    <span>이체 금액</span>
                    <span className="text-base font-semibold text-white">{formatCurrency(receipt.amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : step === "review" ? (
            <p className="mt-4 text-sm leading-6 text-slate-200">
              왼쪽에서 입력한 이체 정보가 검증되었습니다. 금액, 수취인, 예상 잔액을 확인한 뒤 이체를 실행할 수 있습니다.
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-200">
              왼쪽 폼에서 이체 정보를 입력하면 확인 단계와 완료 결과가 이 영역에 표시됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
