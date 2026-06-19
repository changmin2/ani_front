import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpenCheck,
  ChevronDown,
  CircleHelp,
  FileText,
  Languages,
  Mail,
  MessageCircleQuestion,
  Search,
  Settings2,
  ShieldCheck,
} from "lucide-react";

type Category = "전체" | "문서 업로드" | "번역·검수" | "결과·리포트" | "계정·보안";

const categories: { label: Category; icon: typeof CircleHelp }[] = [
  { label: "전체", icon: CircleHelp },
  { label: "문서 업로드", icon: FileText },
  { label: "번역·검수", icon: Languages },
  { label: "결과·리포트", icon: BookOpenCheck },
  { label: "계정·보안", icon: ShieldCheck },
];

const faqItems: { category: Exclude<Category, "전체">; question: string; answer: string }[] = [
  {
    category: "문서 업로드",
    question: "어떤 파일 형식을 업로드할 수 있나요?",
    answer:
      "PDF, DOCX, TXT, PNG, JPG, JPEG 파일을 지원합니다. 이미지 파일은 OCR로 문자를 인식하므로 글자가 선명하고 잘리지 않은 원본을 사용해 주세요.",
  },
  {
    category: "문서 업로드",
    question: "파일 업로드가 계속 실패해요.",
    answer:
      "파일이 암호화되어 있거나 손상되지 않았는지 먼저 확인해 주세요. 문제가 계속되면 문서의 텍스트를 복사해 ‘텍스트 직접 입력’ 방식으로 분석할 수 있습니다.",
  },
  {
    category: "문서 업로드",
    question: "여러 문서를 한 번에 분석할 수 있나요?",
    answer:
      "현재는 분석 정확도와 문서별 검수 이력 관리를 위해 한 번에 하나의 문서를 지원합니다. 문서마다 새로운 분석을 시작해 주세요.",
  },
  {
    category: "번역·검수",
    question: "지원하는 번역 언어가 궁금해요.",
    answer:
      "AI 추천 설정 단계에서 현재 제공되는 언어를 확인할 수 있습니다. 문서와 목적에 따라 추천 언어를 선택하거나 직접 변경할 수 있습니다.",
  },
  {
    category: "번역·검수",
    question: "AI 검수 결과를 그대로 사용해도 되나요?",
    answer:
      "AI 검수는 담당자의 최종 판단을 돕기 위한 기능입니다. 금리, 수수료, 가입 조건, 법적 고지와 같이 중요한 정보는 반드시 원문과 대조해 최종 확인해 주세요.",
  },
  {
    category: "번역·검수",
    question: "번역문을 직접 수정할 수 있나요?",
    answer:
      "결과 검토 단계에서 번역문을 직접 수정할 수 있습니다. 수정한 내용은 채널별 콘텐츠와 최종 리포트에 반영됩니다.",
  },
  {
    category: "결과·리포트",
    question: "최종 리포트에는 어떤 내용이 포함되나요?",
    answer:
      "원문 핵심 정보, 번역 결과, 주요 수치의 일치 여부, AI 검수 항목과 주의 사항, 채널별 콘텐츠가 포함됩니다.",
  },
  {
    category: "결과·리포트",
    question: "이전에 작업한 결과를 다시 볼 수 있나요?",
    answer:
      "현재 화면을 벗어나기 전 필요한 결과를 내려받아 보관해 주세요. 작업 이력 조회 기능은 운영 정책에 따라 제공 범위가 달라질 수 있습니다.",
  },
  {
    category: "계정·보안",
    question: "고객 개인정보가 포함된 문서를 올려도 되나요?",
    answer:
      "주민등록번호, 계좌번호, 연락처 등 개인정보와 민감정보는 업로드 전에 반드시 마스킹하거나 삭제해 주세요.",
  },
  {
    category: "계정·보안",
    question: "서비스 이용 중 보안 문제가 의심돼요.",
    answer:
      "즉시 이용을 중단하고 사내 정보보호 담당 부서 또는 아래 문의 채널로 상황과 발생 시각을 알려 주세요. 비밀번호나 인증번호는 문의 내용에 포함하지 마세요.",
  },
];

export function ContactSupport({ onShowGuide }: { onShowGuide: () => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqItems.filter((faq) => {
      const matchesCategory = activeCategory === "전체" || faq.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-red-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-[1040px] px-8 pb-16 pt-20 text-center md:pb-20 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-extrabold text-red-700">
              <MessageCircleQuestion size={16} /> HELP CENTER
            </span>
            <h1 className="mt-6 text-[38px] font-black tracking-[-0.045em] md:text-[48px]">무엇을 도와드릴까요?</h1>
            <p className="mt-4 text-[16px] font-medium text-slate-500 md:text-[18px]">
              자주 묻는 질문에서 필요한 답변을 빠르게 찾아보세요.
            </p>
          </motion.div>

          <div className="relative mx-auto mt-9 max-w-[720px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={21} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="궁금한 내용을 검색해 보세요"
              aria-label="자주 묻는 질문 검색"
              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] font-semibold text-slate-900 shadow-[0_12px_35px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-50"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.label;
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => setActiveCategory(category.label)}
                className={[
                  "flex h-11 items-center gap-2 rounded-full border px-5 text-[14px] font-extrabold transition",
                  active
                    ? "border-red-600 bg-red-600 text-white shadow-[0_8px_18px_rgba(220,38,38,0.2)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600",
                ].join(" ")}
              >
                <Icon size={16} /> {category.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-[900px]">
          <div className="flex items-end justify-between border-b-2 border-slate-950 pb-5">
            <div>
              <p className="text-[12px] font-black tracking-[0.15em] text-red-600">FREQUENTLY ASKED</p>
              <h2 className="mt-2 text-[28px] font-black tracking-[-0.035em]">자주 묻는 질문</h2>
            </div>
            <p className="text-[13px] font-bold text-slate-400">총 {filteredFaqs.length}개</p>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {filteredFaqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.2) }}
                  className="group bg-white first:rounded-t-xl last:rounded-b-xl"
                >
                  <summary className="flex min-h-[78px] cursor-pointer list-none items-center gap-5 px-5 py-5 marker:hidden md:px-7">
                    <span className="font-black text-red-600">Q</span>
                    <span className="flex-1 text-[16px] font-extrabold text-slate-900 md:text-[17px]">{faq.question}</span>
                    <ChevronDown className="shrink-0 text-slate-400 transition duration-200 group-open:rotate-180 group-open:text-red-600" size={20} />
                  </summary>
                  <div className="grid grid-cols-[24px_1fr] gap-5 bg-slate-50 px-5 py-6 md:px-7">
                    <span className="font-black text-slate-400">A</span>
                    <div>
                      <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-500 ring-1 ring-slate-200">
                        {faq.category}
                      </span>
                      <p className="text-[14px] font-medium leading-7 text-slate-600 md:text-[15px]">{faq.answer}</p>
                    </div>
                  </div>
                </motion.details>
              ))}
            </div>
          ) : (
            <div className="rounded-b-2xl bg-white px-8 py-20 text-center">
              <CircleHelp className="mx-auto text-slate-300" size={42} />
              <h3 className="mt-5 text-[18px] font-black">검색 결과가 없습니다</h3>
              <p className="mt-2 text-[14px] font-medium text-slate-500">다른 검색어를 입력하거나 전체 카테고리에서 찾아보세요.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("전체");
                }}
                className="mt-5 text-[14px] font-extrabold text-red-600 hover:text-red-700"
              >
                검색 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1040px] px-8">
          <div className="rounded-3xl bg-slate-950 p-7 text-white md:flex md:items-center md:justify-between md:gap-10 md:p-10">
            <div>
              <p className="text-[13px] font-black tracking-[0.14em] text-red-400">STILL NEED HELP?</p>
              <h2 className="mt-3 text-[25px] font-black tracking-[-0.03em] md:text-[30px]">원하는 답변을 찾지 못하셨나요?</h2>
              <p className="mt-3 max-w-[560px] text-[14px] font-medium leading-6 text-slate-400">
                오류가 발생한 단계, 파일 형식, 발생 시각을 함께 알려 주시면 더 빠르게 확인할 수 있습니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Mail size={16} className="text-red-400" /> 문의 시 오류 화면과 발생 시각을 함께 전달해 주세요</span>
              </div>
            </div>
            <a
              href="mailto:?subject=[Lingo 문의]"
              className="mt-7 flex h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-[15px] font-extrabold text-white transition hover:bg-red-700 md:mt-0"
            >
              이메일 문의하기 <ArrowRight size={18} />
            </a>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Settings2 size={20} /></span>
              <div>
                <p className="text-[14px] font-extrabold text-slate-900">서비스 사용법이 궁금하신가요?</p>
                <p className="mt-0.5 text-[12px] font-medium text-slate-500">5단계 이용 가이드에서 전체 흐름을 확인해 보세요.</p>
              </div>
            </div>
            <button type="button" onClick={onShowGuide} className="shrink-0 text-[14px] font-extrabold text-red-600 hover:text-red-700">
              이용 가이드 보기 →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
