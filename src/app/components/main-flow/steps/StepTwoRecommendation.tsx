import type { ElementType, ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Circle,
  FileText,
  Info,
  Link2,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { coreNumbers, detectedInfo, reviewChecks } from "../flowData";
import { BottomBar } from "../shared/BottomBar";

type StepTwoRecommendationProps = {
  onBack: () => void;
  onNext: () => void;
};

export function StepTwoRecommendation({ onBack, onNext }: StepTwoRecommendationProps) {
  return (
    <div className="mx-auto max-w-[1460px] px-8 py-7">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-slate-950">
            문서 분석이 완료되었습니다
          </h1>
          <p className="mt-4 text-[16px] font-medium text-slate-600">
            AI가 문서를 분석하여 아래 실행 설정을 추천했습니다. 확인 후 번역과 검수를 시작하세요.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-5 rounded-lg bg-red-50 px-6 py-4 text-red-600">
          <Sparkles size={25} />
          <span className="text-[18px] font-extrabold">AI 추천</span>
          <span className="text-[16px] font-bold">신뢰도</span>
          <span className="text-[28px] font-black">92%</span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[560px_1fr]">
        <SummaryPanel />

        <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-[22px] font-black text-slate-950">AI 추천 실행 설정</h2>
          <p className="mt-2 text-[15px] font-medium text-slate-600">
            AI가 문서를 분석해 아래 설정을 추천했습니다. 필요 시 직접 수정할 수 있습니다.
          </p>

          <div className="mt-7 grid gap-7">
            <SettingRow icon={FileText} label="문서 유형">
              <div className="flex h-12 items-center justify-between rounded-lg border border-slate-200 px-4">
                <span className="font-bold text-slate-950">금융상품 안내문</span>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-extrabold text-red-600">
                    AI 추천
                  </span>
                  <ChevronDown size={18} className="text-slate-500" />
                </div>
              </div>
            </SettingRow>

            <SettingRow icon={Users} label="대상 언어">
              <div className="flex flex-wrap gap-3">
                {["영어 (English)", "베트남어 (Tiếng Việt)"].map((lang) => (
                  <span key={lang} className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-5 text-[16px] font-semibold text-slate-800">
                    {lang}
                    <X size={16} className="text-slate-500" />
                  </span>
                ))}
                <button className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-5 text-[16px] font-semibold text-slate-700">
                  <Plus size={18} />
                  언어 추가
                </button>
              </div>
            </SettingRow>

            <SettingRow icon={Link2} label="게시 채널" hint="(복수 선택 가능)">
              <div className="grid grid-cols-2 gap-x-14 gap-y-4 xl:grid-cols-3">
                {["모바일 앱 공지", "홈페이지 안내", "영업점 게시문", "SNS 카드뉴스", "배너"].map((item, index) => (
                  <CheckOption key={item} checked={index < 3} label={item} />
                ))}
              </div>
            </SettingRow>

            <SettingRow icon={Circle} label="톤 & 스타일">
              <div className="flex h-12 items-center justify-between rounded-lg border border-slate-200 px-4">
                <span className="font-bold text-slate-950">쉽고 명확한 고객 안내 표현</span>
                <ChevronDown size={18} className="text-slate-500" />
              </div>
            </SettingRow>

            <SettingRow icon={ShieldCheck} label="검수 기준" hint="(복수 선택 가능)">
              <div className="grid grid-cols-1 gap-x-16 gap-y-4 xl:grid-cols-2">
                {reviewChecks.map((item) => (
                  <CheckOption key={item} checked label={item} />
                ))}
              </div>
            </SettingRow>
          </div>

          <button className="mt-8 flex h-12 w-full items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-5 text-[15px] font-extrabold text-slate-800">
            <span className="flex items-center gap-3">
              <Info size={18} className="text-amber-600" />
              AI 추천 근거 보기
            </span>
            <ChevronDown size={18} className="text-blue-700" />
          </button>
        </section>
      </div>

      <BottomBar
        leftLabel="이전으로"
        onBack={onBack}
        rightLabel="번역 및 검수 실행"
        onNext={onNext}
      />
    </div>
  );
}

function SummaryPanel() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-[20px] font-extrabold text-slate-950">업로드 문서 요약</h2>
      <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-600 text-white">
            <FileText size={23} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-950">BNK_외국인 고객 예금상품 안내문.pdf</p>
            <p className="mt-1 text-[14px] text-slate-500">PDF · 1.2MB · 3페이지</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-extrabold text-emerald-700">
          업로드 완료
        </span>
      </div>

      <h3 className="mt-6 text-[16px] font-extrabold text-slate-950">AI가 감지한 문서 정보</h3>
      <div className="mt-4 space-y-4">
        {detectedInfo.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex gap-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-500">{item.label}</p>
                <p className="mt-1 text-[15px] font-medium leading-6 text-slate-700">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-slate-950">핵심 수치 미리보기</h3>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600">
            자세히 보기
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {coreNumbers.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="grid grid-cols-[32px_100px_1fr] items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500">
                  <Icon size={17} />
                </div>
                <span className="text-[14px] font-extrabold text-slate-800">{item.label}</span>
                <span className="text-[14px] font-medium text-slate-600">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: ElementType;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-start gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[15px] font-extrabold text-slate-950">{label}</p>
          {hint && <p className="mt-1 text-[13px] font-semibold text-slate-600">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function CheckOption({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex items-center gap-3 text-[15px] font-bold text-slate-950">
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded border",
          checked ? "border-red-600 bg-red-600 text-white" : "border-slate-300 bg-white",
        ].join(" ")}
      >
        {checked && <Check size={14} />}
      </span>
      {label}
    </label>
  );
}
