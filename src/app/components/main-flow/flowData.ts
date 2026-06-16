import {
  AlertTriangle,
  CalendarDays,
  FileText,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const flowSteps = [
  "문서 업로드",
  "AI 추천 설정",
  "번역 및 검수 진행",
  "결과 검토",
  "최종 리포트",
];

export const detectedInfo = [
  {
    icon: Sparkles,
    label: "문서 유형",
    value: "금융상품 안내문",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Users,
    label: "문서 성격",
    value: "외국인 고객 대상 상품 안내",
    color: "bg-slate-100 text-slate-600",
  },
  {
    icon: FileText,
    label: "포함 정보",
    value: "금리, 가입기간, 우대조건, 예금자보호, 중도해지 유의사항",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    label: "법적/주의 문구 감지",
    value: "3건",
    color: "bg-amber-50 text-amber-600",
  },
];

export const coreNumbers = [
  { icon: Percent, label: "기본금리", value: "연 3.20%" },
  { icon: TrendingUp, label: "우대금리", value: "최대 연 0.50%p" },
  { icon: CalendarDays, label: "가입기간", value: "6개월 / 12개월 / 24개월 / 36개월" },
  { icon: ShieldCheck, label: "예금자보호", value: "1인당 5천만원" },
  { icon: AlertTriangle, label: "중도해지 이율", value: "가입기간별 차등 적용" },
];

export const reviewChecks = [
  "금리/수수료 수치 검수",
  "가입 조건 검수",
  "예금자보호 문구 검수",
  "중도해지 유의사항 검수",
  "과장 광고 표현 검수",
];

export const terminologyMatches = [
  ["우대금리", "Preferential Interest Rate"],
  ["중도해지", "Early Withdrawal"],
  ["예금자보호", "Deposit Protection"],
  ["가입기간", "Term"],
];

export const originalSummaryRows = [
  ["상품명", "BNK 더 편한 정기예금"],
  ["기본금리", "연 3.20%"],
  ["우대금리", "최대 연 0.50%p"],
  ["가입기간", "6개월 / 12개월 /\n24개월 / 36개월"],
  ["예금자보호", "1인당 5천만원"],
  ["중도해지", "가입기간별 차등 적용"],
  ["주요 우대조건", "• 급여이체\n• 카드 이용실적\n• 자동이체"],
];
