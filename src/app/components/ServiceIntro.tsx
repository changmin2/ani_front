import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleAlert,
  FileSearch,
  FileText,
  Languages,
  LayoutTemplate,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import lingoLogo from "@/assets/images/lingo_logo.png";
import monitorImage from "@/assets/images/monitor-shadow-microsoft-white.png";

const features = [
  {
    icon: FileSearch,
    title: "금융문서 자동 분석",
    description: "제목과 본문은 물론 금리, 수수료, 기간, 가입 조건과 고지사항을 자동으로 분리합니다.",
  },
  {
    icon: Languages,
    title: "금융용어 기반 번역",
    description: "금융권 용어집과 승인된 표현을 반영해 문서 전체의 번역을 일관되게 유지합니다.",
  },
  {
    icon: ScanSearch,
    title: "원문·번역문 자동 검수",
    description: "중요 수치와 조건의 누락 또는 왜곡 가능성을 찾아 담당자의 최종 판단을 돕습니다.",
  },
  {
    icon: LayoutTemplate,
    title: "채널별 콘텐츠 생성",
    description: "홈페이지, 모바일 공지, 영업점 게시물과 카드뉴스에 맞는 문안으로 재구성합니다.",
  },
];

const steps = [
  ["01", "문서 입력", "한국어 문서를 업로드하거나 내용을 직접 입력합니다."],
  ["02", "AI 번역 및 검수", "언어와 목적을 선택하면 금융용어와 핵심 정보를 함께 검수합니다."],
  ["03", "게시용 결과 완성", "채널별 문안과 검수 리포트를 확인하고 내려받습니다."],
];

export function ServiceIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="relative border-b border-slate-100 bg-[linear-gradient(135deg,#fff_35%,#fff7f7_100%)]">
        <div className="absolute -right-24 top-8 h-96 w-96 rounded-full bg-red-100/60 blur-3xl" />
        <div className="relative mx-auto grid min-h-[650px] max-w-[1320px] grid-cols-1 items-center gap-10 px-8 py-20 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-7 h-[96px] w-[330px] overflow-hidden" aria-label="Lingo">
              <img
                src={lingoLogo}
                alt="Lingo"
                className="w-[345px] max-w-none -translate-x-[28px] -translate-y-[17px]"
              />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-extrabold text-red-700">
              <Sparkles size={15} /> BNK 금융문서 현지화 AI 에이전트
            </span>
            <h1 className="mt-6 text-[42px] font-black leading-[1.18] tracking-[-0.045em] text-slate-950 md:text-[56px]">
              금융문서 번역부터
              <br />
              <span className="text-red-600">검수와 콘텐츠 제작</span>까지
            </h1>
            <p className="mt-7 max-w-[600px] text-[19px] font-medium leading-8 text-slate-600">
              단순히 언어만 바꾸지 않습니다. 금융용어와 핵심 수치를 확인하고,
              실제 게시 채널에 맞는 다국어 콘텐츠로 완성합니다.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="flex h-14 items-center gap-3 rounded-xl bg-red-600 px-7 text-[17px] font-extrabold text-white shadow-[0_12px_28px_rgba(220,38,38,0.25)] transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                서비스 이용하기 <ArrowRight size={20} />
              </button>
              <p className="flex items-center gap-2 text-[14px] font-semibold text-slate-500">
                <ShieldCheck size={18} className="text-emerald-600" /> 담당자의 최종 검토를 지원합니다
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute left-8 top-10 h-4/5 w-4/5 rounded-full bg-red-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <img
                src={monitorImage}
                alt="다국어 금융문서 처리 AI"
                className="w-full rounded-[32px]"
              />
            </div>
            <div className="absolute bottom-7 left-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:left-7">
              <p className="flex items-center gap-2 text-[13px] font-extrabold text-emerald-700">
                <Check size={16} /> 핵심 정보 검수 완료
              </p>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">금리 · 기간 · 가입 조건 원문 일치</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-950 py-10 text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-8 md:grid-cols-[1.1fr_1fr_1fr_1fr] md:items-center">
          <div>
            <p className="text-[14px] font-extrabold text-red-400">WHY LINGO</p>
            <h2 className="mt-2 text-[24px] font-black">번역보다 오래 걸리는 일을 줄입니다</h2>
          </div>
          {[
            ["번역 의뢰", "초안 확보까지 긴 대기"],
            ["수작업 대조", "핵심 조건의 누락 위험"],
            ["반복 재편집", "채널마다 문안 재작성"],
          ].map(([title, description]) => (
            <div key={title} className="border-l border-white/15 pl-6">
              <p className="text-[17px] font-extrabold">{title}</p>
              <p className="mt-1 text-[14px] text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-8 py-24">
        <SectionHeading
          eyebrow="CORE FEATURES"
          title="금융 콘텐츠 제작에 필요한 과정을 하나로"
          description="문서 분석부터 게시용 문안 생성까지, 담당자가 반복하던 작업을 하나의 흐름으로 연결합니다."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Icon size={25} />
                </div>
                <h3 className="mt-6 text-[19px] font-black">{feature.title}</h3>
                <p className="mt-3 text-[14px] font-medium leading-6 text-slate-600">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-[1160px] px-8">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="세 단계면 충분합니다"
            description="복잡했던 다국어 콘텐츠 제작 과정을 담당자가 이해하기 쉬운 흐름으로 단순화했습니다."
          />
          <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-slate-300 md:block" />
            {steps.map(([number, title, description]) => (
              <article key={number} className="relative rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-50 bg-slate-950 text-[16px] font-black text-white">
                  {number}
                </span>
                <h3 className="mt-5 text-[20px] font-black">{title}</h3>
                <p className="mt-3 text-[14px] font-medium leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-8 py-24 lg:grid-cols-2">
        <div>
          <span className="text-[13px] font-black tracking-[0.16em] text-red-600">AI QUALITY CHECK</span>
          <h2 className="mt-4 text-[36px] font-black leading-tight tracking-[-0.035em]">중요한 금융정보를<br />한 번 더 확인합니다</h2>
          <p className="mt-5 text-[17px] font-medium leading-7 text-slate-600">
            원문과 번역문을 비교해 금리, 기간, 수수료와 가입 조건을 확인하고
            누락 가능성이나 주의가 필요한 표현을 알려드립니다.
          </p>
          <div className="mt-7 space-y-3">
            {["주요 수치와 조건 원문 대조", "과장·위험 표현 탐지", "금융용어 일관성 확인"].map((item) => (
              <p key={item} className="flex items-center gap-3 text-[15px] font-extrabold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={15} /></span>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.09)] md:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <p className="text-[13px] font-bold text-slate-500">AI 검수 리포트</p>
              <h3 className="mt-1 text-[20px] font-black">정기예금 상품 안내문</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[12px] font-extrabold text-emerald-700">검수 완료</span>
          </div>
          <div className="mt-5 space-y-3">
            <ReportRow icon={Check} tone="emerald" title="금리 3.20%" description="원문과 동일하게 유지되었습니다." />
            <ReportRow icon={Check} tone="emerald" title="가입 기간 12개월" description="원문과 동일하게 유지되었습니다." />
            <ReportRow icon={CircleAlert} tone="amber" title="중도해지 안내" description="의미가 축약될 수 있어 대체 문구를 제안합니다." />
          </div>
        </div>
      </section>

      <section className="mx-5 mb-5 rounded-3xl bg-slate-950 px-8 py-20 text-center text-white">
        <BookOpenCheck className="mx-auto text-red-400" size={36} />
        <h2 className="mt-5 text-[34px] font-black tracking-[-0.035em]">다국어 금융 콘텐츠 제작, 하나의 흐름으로 완성하세요</h2>
        <p className="mx-auto mt-4 max-w-[680px] text-[16px] leading-7 text-slate-400">
          반복적인 번역과 대조는 줄이고, 담당자는 콘텐츠의 품질과 고객 경험에 더 집중할 수 있습니다.
        </p>
        <button
          onClick={onStart}
          className="mx-auto mt-8 flex h-14 items-center gap-3 rounded-xl bg-red-600 px-8 text-[17px] font-extrabold text-white transition hover:bg-red-700"
        >
          첫 문서 분석하기 <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <p className="text-[13px] font-black tracking-[0.16em] text-red-600">{eyebrow}</p>
      <h2 className="mt-4 text-[34px] font-black tracking-[-0.035em]">{title}</h2>
      <p className="mx-auto mt-4 max-w-[720px] text-[16px] font-medium leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function ReportRow({
  icon: Icon,
  tone,
  title,
  description,
}: {
  icon: typeof Check;
  tone: "emerald" | "amber";
  title: string;
  description: string;
}) {
  const colors = tone === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600";
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colors}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className="text-[15px] font-black text-slate-950">{title}</p>
        <p className="mt-1 text-[13px] font-medium text-slate-500">{description}</p>
      </div>
    </div>
  );
}
