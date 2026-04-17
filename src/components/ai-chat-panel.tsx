"use client";

import { FormEvent, useMemo, useState } from "react";

import { chatbotQuickPrompts } from "@/data/demo";

type AdvisoryType = "소비 분석" | "저축 추천" | "대출 상담" | "일반 안내" | "상담 시작";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  advisoryType?: AdvisoryType;
  evidence?: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "안녕하세요. 저는 Amazon Lex 연동을 가정한 BankFlow AI 상담 도우미예요. 소비 분석, 상품 추천, 대출 상담 흐름을 시연할 수 있어요.",
    advisoryType: "상담 시작",
    evidence: "고객 질문 의도를 분류한 뒤, 계좌 요약과 상품 컨텍스트를 결합해 상담 흐름을 연결하는 구조를 가정합니다.",
  },
];

function getMockResponse(input: string) {
  const normalized = input.trim();

  if (!normalized) {
    return {
      content: "질문을 입력하면 소비 패턴 요약이나 상품 추천 데모를 보여드릴게요.",
      advisoryType: "일반 안내" as const,
      evidence: "질문 분류가 완료되면 관련 상품 정보와 상담 시나리오를 함께 표시할 수 있습니다.",
    };
  }

  if (normalized.includes("소비") || normalized.includes("패턴")) {
    return {
      content:
        "최근 30일 기준으로 식비와 구독비 비중이 높고, 고정 지출은 안정적이에요. 이번 주는 식비 예산을 8%만 줄여도 월 예상 잔액이 약 12만원 개선되는 흐름입니다.",
      advisoryType: "소비 분석" as const,
      evidence: "최근 거래 카테고리, 고정비 비율, 예상 월말 잔액을 기준으로 분석한 시나리오입니다.",
    };
  }

  if (normalized.includes("저축") || normalized.includes("추천")) {
    return {
      content:
        "현재 소비 패턴이라면 'AI 절약 챌린지 통장'과 '생활 안정 적금' 조합이 가장 설득력 있어요. 입출금 통장에서 주간 소비 리포트를 받고, 월 50만원 적금으로 이어지는 구성이 MVP 데모에 잘 맞습니다.",
      advisoryType: "저축 추천" as const,
      evidence: "소비 패턴 안정도와 월 저축 가능 금액을 기준으로 입출금 상품과 적금 상품을 함께 추천했습니다.",
    };
  }

  if (normalized.includes("대출") || normalized.includes("소상공인")) {
    return {
      content:
        "소상공인 브릿지 대출 상담 시나리오를 시작할게요. 1단계는 업종과 매출 규모 확인, 2단계는 필요 서류 체크리스트 제시, 3단계는 심사 예상 기간과 유의사항 안내입니다. 실제 서비스에서는 Amazon Lex 봇과 내부 심사 API가 연결됩니다.",
      advisoryType: "대출 상담" as const,
      evidence: "업종 정보, 매출 규모, 제출 서류 확인 절차를 기준으로 상담 단계를 구성한 예시입니다.",
    };
  }

  return {
    content:
      "이 데모에서는 Amazon Lex 기반 상담 흐름을 가정하고 있어요. 소비 분석, 저축 추천, 소상공인 대출 상담 중 하나로 질문하면 가장 자연스럽게 시연할 수 있습니다.",
    advisoryType: "일반 안내" as const,
    evidence: "현재 데모는 키워드 분류 기반 응답이며, 실제 서비스에서는 Lex 의도 분류 결과와 내부 데이터를 함께 사용할 수 있습니다.",
  };
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const conversationCount = useMemo(
    () => messages.filter((message) => message.role === "assistant").length,
    [messages],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isThinking) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed },
    ]);
    setInput("");
    setIsThinking(true);

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const response = getMockResponse(trimmed);

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
      {
        role: "assistant",
        content: response.content,
        advisoryType: response.advisoryType,
        evidence: response.evidence,
      },
    ];

    setMessages(nextMessages);
    setIsThinking(false);
  };

  const applyQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold text-primary">실제 UI 시연용 AI 기능</p>
            <h3 className="text-2xl font-semibold text-slate-950">BankFlow AI 상담 데스크</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            응답 {conversationCount}건
          </span>
        </div>

        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-3xl rounded-2xl border px-4 py-3 text-sm leading-6 ${
                message.role === "assistant"
                  ? "border-slate-200 bg-slate-50 text-slate-700"
                  : "ml-auto border-primary bg-primary text-white"
              }`}
            >
              {message.role === "assistant" && message.advisoryType ? (
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <span>{message.advisoryType}</span>
                </div>
              ) : null}
              <p>{message.content}</p>
              {message.role === "assistant" && message.evidence ? (
                <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
                  추천 근거: {message.evidence}
                </p>
              ) : null}
            </div>
          ))}
          {isThinking ? (
            <div className="max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <span>상담 분석 중</span>
              </div>
              사용자의 질문 의도를 분류하고, 적합한 금융 상담 시나리오를 생성하고 있습니다.
            </div>
          ) : null}
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="예: 이번 달 소비 패턴 요약해줘"
            className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white"
          />
          <button
            type="submit"
            className="primary-button"
            disabled={isThinking}
          >
            {isThinking ? "응답 생성 중..." : "AI 응답 생성"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-primary">빠른 시연 질문</p>
          <div className="mt-4 space-y-3">
            {chatbotQuickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => applyQuickPrompt(prompt)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-white hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold tracking-[0.16em] text-slate-300">LEX DESIGN POINTS</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>• Lex 의도 분류와 슬롯 기반 상담 흐름 구성</li>
            <li>• Lambda에서 계좌/상품 더미 데이터 결합 및 후처리</li>
            <li>• CloudWatch로 프롬프트 로그와 오류 추적</li>
          </ul>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-300">
            현재 화면은 발표용 데모이지만, 실제 운영 구조에서는 질문 분류, 계좌 컨텍스트 조회, 응답 생성,
            감사 로그 적재 단계를 분리해 설명할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
