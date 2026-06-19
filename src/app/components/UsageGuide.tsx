import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  FileUp,
  Languages,
  MessageCircleQuestion,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const guideSteps = [
  {
    number: "01",
    icon: FileUp,
    title: "문서를 업로드해 주세요",
    description:
      "PDF, DOCX, TXT 또는 이미지 파일을 올리거나 번역할 내용을 직접 입력할 수 있습니다.",
    tip: "금리·기간·유의사항이 선명하게 보이는 원본을 사용하면 분석 정확도가 높아져요.",
  },
  {
    number: "02",
    icon: Settings2,
    title: "AI 추천 설정을 확인해 주세요",
    description:
      "문서 분석 결과를 바탕으로 추천된 언어, 콘텐츠 목적, 게시 채널을 확인하고 조정합니다.",
    tip: "게시 채널을 정확히 선택하면 채널 특성에 맞는 문장 길이와 말투가 적용돼요.",
  },
  {
    number: "03",
    icon: Languages,
    title: "번역과 AI 검수를 진행해요",
    description:
      "금융 용어집을 반영해 번역하고, 원문의 핵심 수치와 필수 안내 문구를 함께 대조합니다.",
    tip: "처리 중에는 창을 닫지 않아도 다른 탭에서 업무를 계속할 수 있어요.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "결과를 직접 검토해 주세요",
    description:
      "원문과 번역문을 나란히 비교하고 AI가 표시한 주의 항목을 확인한 뒤 문장을 수정합니다.",
    tip: "노란색 주의 항목은 배포 전 담당자의 최종 확인이 필요한 부분이에요.",
  },
  {
    number: "05",
    icon: FileCheck2,
    title: "최종 리포트를 내려받아요",
    description:
      "검수 결과와 채널별 콘텐츠를 확인하고 필요한 형식으로 내려받아 바로 활용합니다.",
    tip: "리포트에는 주요 수치의 원문 일치 여부와 검수 이력이 함께 포함돼요.",
  },
];

const preparationItems = [
  "텍스트를 선택할 수 있는 PDF 또는 DOCX 권장",
  "이미지는 글자가 잘리지 않은 고해상도 원본 사용",
  "한 번에 하나의 문서만 업로드",
  "개인정보가 포함된 경우 업로드 전 마스킹",
];

const faqs = [
  {
    question: "어떤 파일 형식을 지원하나요?",
    answer: "PDF, DOCX, TXT, PNG, JPG, JPEG 형식을 지원합니다. 이미지 문서는 OCR을 거쳐 텍스트를 분석합니다.",
  },
  {
    question: "AI 결과를 그대로 게시해도 되나요?",
    answer:
      "AI 검수는 담당자의 판단을 돕는 기능입니다. 금리, 수수료, 가입 조건과 법적 고지 문구는 반드시 담당자가 최종 확인해 주세요.",
  },
  {
    question: "번역 결과를 직접 수정할 수 있나요?",
    answer: "결과 검토 단계에서 번역문을 직접 수정하고, 수정된 내용으로 최종 리포트를 만들 수 있습니다.",
  },
];

export function UsageGuide({ onStart }: { onStart: () => void }) {
  return (
    <main className="bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="absolute -right-32 -top-44 h-[520px] w-[520px] rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-[42%] h-40 w-40 rounded-full bg-red-500/10 blur-2xl" />
        <div className="relative mx-auto flex min-h-[390px] max-w-[1320px] flex-col justify-center px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-extrabold text-red-300 backdrop-blur">
              <Sparkles size={15} /> LINGO USER GUIDE
            </span>
            <h1 className="mt-6 text-[40px] font-black leading-tight tracking-[-0.04em] md:text-[52px]">
              처음이어도 어렵지 않아요.
              <br />
              <span className="text-red-400">5단계로 완성하는 금융 콘텐츠</span>
            </h1>
            <p className="mt-5 max-w-[690px] text-[17px] font-medium leading-7 text-slate-300 md:text-[18px]">
              문서 입력부터 번역, 검수, 최종 리포트까지 Lingo의 전체 사용 흐름과
              꼭 확인해야 할 항목을 한눈에 살펴보세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="self-start lg:sticky lg:top-8">
            <p className="text-[13px] font-black tracking-[0.15em] text-red-600">QUICK START</p>
            <h2 className="mt-3 text-[26px] font-black tracking-[-0.035em]">이용 순서</h2>
            <nav className="mt-6 space-y-1 border-l border-slate-200" aria-label="이용 가이드 단계">
              {guideSteps.map((step) => (
                <a
                  key={step.number}
                  href={`#guide-step-${step.number}`}
                  className="flex items-center gap-3 border-l-2 border-transparent px-5 py-3 text-[14px] font-bold text-slate-500 transition hover:border-red-600 hover:bg-red-50 hover:text-red-600"
                >
                  <span className="font-black text-slate-300">{step.number}</span>
                  {step.title.replace(/해 주세요|진행해요|내려받아요/, "")}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={onStart}
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-[15px] font-extrabold text-white shadow-[0_10px_24px_rgba(220,38,38,0.2)] transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              지금 시작하기 <ArrowRight size={18} />
            </button>
          </aside>

          <div>
            <div className="flex items-end justify-between border-b border-slate-200 pb-7">
              <div>
                <p className="text-[13px] font-black tracking-[0.15em] text-red-600">STEP BY STEP</p>
                <h2 className="mt-3 text-[30px] font-black tracking-[-0.035em] md:text-[36px]">따라 하기</h2>
              </div>
              <p className="hidden text-[14px] font-semibold text-slate-400 sm:block">예상 소요 시간 약 5분</p>
            </div>

            <div className="divide-y divide-slate-200">
              {guideSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    id={`guide-step-${step.number}`}
                    key={step.number}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className="scroll-mt-8 py-9 first:pt-8 md:py-11"
                  >
                    <div className="grid grid-cols-[56px_1fr] gap-5 md:grid-cols-[72px_1fr] md:gap-7">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 md:h-[72px] md:w-[72px]">
                        <Icon size={28} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black tracking-[0.14em] text-red-600">STEP {step.number}</p>
                        <h3 className="mt-2 text-[22px] font-black tracking-[-0.025em] md:text-[25px]">{step.title}</h3>
                        <p className="mt-3 max-w-[760px] text-[15px] font-medium leading-7 text-slate-600 md:text-[16px]">
                          {step.description}
                        </p>
                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[13px] font-semibold leading-5 text-slate-600">
                          <CircleAlert className="mt-0.5 shrink-0 text-amber-500" size={17} />
                          <span><strong className="mr-2 text-slate-900">TIP</strong>{step.tip}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 px-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={25} />
            </div>
            <h2 className="mt-6 text-[25px] font-black tracking-[-0.03em]">업로드 전 체크해 주세요</h2>
            <div className="mt-6 space-y-4">
              {preparationItems.map((item) => (
                <p key={item} className="flex items-start gap-3 text-[14px] font-semibold leading-6 text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-red-400">
              <MessageCircleQuestion size={25} />
            </div>
            <h2 className="mt-6 text-[25px] font-black tracking-[-0.03em]">자주 묻는 질문</h2>
            <div className="mt-5 divide-y divide-white/10">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="group py-4" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-extrabold marker:hidden">
                    {faq.question}
                    <ChevronDown className="shrink-0 text-slate-400 transition group-open:rotate-180" size={18} />
                  </summary>
                  <p className="pr-8 pt-3 text-[13px] font-medium leading-6 text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 py-20 text-center md:py-24">
        <p className="text-[13px] font-black tracking-[0.15em] text-red-600">READY TO START?</p>
        <h2 className="mt-4 text-[30px] font-black tracking-[-0.04em] md:text-[38px]">이제 첫 문서를 시작해 보세요</h2>
        <p className="mt-4 text-[16px] font-medium text-slate-500">Lingo가 문서 분석부터 최종 검수까지 함께합니다.</p>
        <button
          type="button"
          onClick={onStart}
          className="mx-auto mt-8 flex h-14 items-center gap-3 rounded-xl bg-red-600 px-8 text-[16px] font-extrabold text-white shadow-[0_12px_28px_rgba(220,38,38,0.22)] transition hover:-translate-y-0.5 hover:bg-red-700"
        >
          문서 업로드하기 <ArrowRight size={19} />
        </button>
      </section>
    </main>
  );
}
