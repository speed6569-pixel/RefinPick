export const navItems = [
  { href: "/", label: "메인" },
  { href: "/login", label: "로그인" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/products", label: "금융상품" },
  { href: "/ai-chat", label: "AI 챗봇" },
  { href: "/transfer", label: "이체 시뮬레이션" },
];

export const heroMetrics = [
  { label: "주간 MVP 범위", value: "6개 화면" },
  { label: "AWS 핵심 리소스", value: "8개" },
  { label: "AI 시연 플로우", value: "1개 이상" },
  { label: "데모 준비 시간", value: "1주" },
];

export const dashboardMetrics = [
  {
    title: "총 자산",
    value: "₩38,420,000",
    change: "+2.8% vs 지난달",
  },
  {
    title: "이번 달 소비",
    value: "₩1,280,000",
    change: "식비 비중 22%",
  },
  {
    title: "AI 추천 점수",
    value: "84점",
    change: "자동 저축 상품 적합",
  },
  {
    title: "예상 현금 흐름",
    value: "+₩540,000",
    change: "7일 기준 안정",
  },
];

export const recentTransactions = [
  {
    date: "2026-04-13",
    title: "급여 입금",
    type: "입금",
    amount: "+₩3,400,000",
  },
  {
    date: "2026-04-12",
    title: "생활비 이체",
    type: "출금",
    amount: "-₩420,000",
  },
  {
    date: "2026-04-10",
    title: "정기 적금 자동이체",
    type: "출금",
    amount: "-₩500,000",
  },
  {
    date: "2026-04-08",
    title: "카드 대금 결제",
    type: "출금",
    amount: "-₩880,000",
  },
];

export const productItems = [
  {
    name: "AI 절약 챌린지 통장",
    badge: "추천",
    summary: "소비 패턴을 분석해 자동으로 예산과 저축 목표를 제안하는 입출금 상품",
    features: ["소비 카테고리 분석", "주간 목표 리포트", "대시보드 연동"],
  },
  {
    name: "생활 안정 적금",
    badge: "MVP",
    summary: "7일 데모 범위 안에서 가장 설득력 있게 설명 가능한 기본 적금 상품",
    features: ["월 자동이체", "만기 시뮬레이션", "우대금리 조건 예시"],
  },
  {
    name: "소상공인 브릿지 대출",
    badge: "AWS AI",
    summary: "Amazon Lex 기반 상담 도우미와 연결되는 정책형 대출 상담 시나리오",
    features: ["질문 자동 분류", "서류 체크리스트", "심사 안내 흐름"],
  },
];

export const architectureNodes = [
  "Route 53 + CloudFront",
  "Next.js 프론트엔드 on Amplify Hosting 또는 ECS",
  "API Gateway + Lambda",
  "Amazon Cognito",
  "Amazon DynamoDB",
  "Amazon S3",
  "Amazon Lex",
  "Amazon CloudWatch",
];

export const chatbotQuickPrompts = [
  "이번 달 소비 패턴 요약해줘",
  "저축 상품 추천해줘",
  "소상공인 대출 상담 흐름 보여줘",
];
