import type { ElementType, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  Globe2,
  Info,
} from "lucide-react";
import { BottomBar } from "../shared/BottomBar";
import type { FlowInput, KeyNumberPreview, TranslationResult } from "../types";

export function StepFourReview({
  onBack,
  onNext,
  input,
  translationResult,
}: {
  onBack: () => void;
  onNext: () => void;
  input: FlowInput | null;
  translationResult: TranslationResult | null;
}) {
  const selectedTranslation = translationResult?.translations[0];
  const analysis = input?.analysisResponse?.analysis;
  const keyNumbers = analysis?.key_numbers_preview ?? [];
  const includedInformation = analysis?.included_information ?? [];
  const sourceTitle =
    input?.mode === "file"
      ? input.fileName
      : analysis?.document_structure?.title || "입력 텍스트";

  return (
    <div className="mx-auto max-w-[1480px] px-12 py-7">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[34px] font-black tracking-tight text-slate-950">
            번역 결과를 검토하세요
          </h1>
          <p className="mt-3 text-[16px] font-medium text-slate-600">
            원문과 번역문을 비교하고, AI가 감지한 검수 항목을 확인한 뒤 승인하세요.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <ScoreBadge icon={CheckCircle2} title="정상" value="8건" color="emerald" />
          <ScoreBadge icon={AlertTriangle} title="주의" value="2건" color="amber" />
          <ScoreBadge icon={AlertTriangle} title="오류" value="0건" color="red" />
          <ScoreBadge icon={Info} title="검토 필요" value="1건" color="blue" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr_440px]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-3 text-[19px] font-black text-slate-950">
            원문 핵심 정보
            <Info size={17} className="text-slate-400" />
          </h2>
          <p className="mt-2 truncate text-[13px] font-bold text-slate-500">
            {sourceTitle}
          </p>
          <OriginalKeyInfo
            keyNumbers={keyNumbers}
            includedInformation={includedInformation}
          />
          <button className="mt-9 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 text-[15px] font-extrabold text-slate-700">
            <FileText size={18} />
            원문 전체 보기
            <ChevronRight size={18} />
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[19px] font-black text-slate-950">번역 결과</h2>
              <Globe2 size={18} className="text-violet-700" />
              <button className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-extrabold text-violet-700">
                영어 (English)
                <ChevronDown size={15} />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[13px] font-extrabold text-slate-700">
                <Edit3 size={15} />
                직접 수정
              </button>
              <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[13px] font-extrabold text-slate-700">
                <Copy size={15} />
                복사
              </button>
            </div>
          </div>

          <article className="max-h-[540px] overflow-hidden pr-5 text-[16px] leading-7 text-slate-700">
            <h3 className="mt-7 text-[18px] font-black text-slate-950">
              {selectedTranslation?.title || "BNK The Convenient Time Deposit"}
            </h3>
            <p className="mt-3">
              A time deposit product that helps you grow your assets with stable interest benefits and reliable deposit protection.
            </p>
            <hr className="my-5 border-slate-200" />
            <ResultSection title="Eligibility">Individuals and sole proprietors</ResultSection>
            <ResultSection title="Term">6 months / 12 months / 24 months / 36 months</ResultSection>
            <div className="grid grid-cols-2 gap-8 border-b border-slate-100 py-4">
              <ResultSection title="Base Interest Rate">3.20% p.a.</ResultSection>
              <ResultSection title="Preferential Interest Rate">Up to 0.50%p</ResultSection>
            </div>
            <ResultSection title="Deposit Protection">
              Protected up to KRW 50 million per depositor under the Deposit Insurance Act.
            </ResultSection>
            <ResultSection title="Early Withdrawal">
              Interest rates may vary depending on the term.
            </ResultSection>
            <ResultSection title="Preferential Conditions">
              • Payroll transfer
              <br />
              • Card usage performance
              <br />
              • Automatic transfer
            </ResultSection>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[20px] font-black text-slate-950">
              AI 검수 결과
              <Info size={18} className="text-slate-400" />
            </h2>
            <button className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] font-extrabold text-slate-700">
              검수 기준 보기
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <ReviewGroup color="emerald" title="정상 (8)" body="모든 금리, 기간, 보호한도 등이 원문과 일치합니다." />
            <ReviewGroup
              color="amber"
              title="주의 (2)"
              body="우대금리 조건 표현이 일부 축약되었습니다."
              detail="우대 조건별 세부 항목(급여이체, 카드 이용실적, 자동이체)이 명확히 드러나지 않았습니다."
            />
            <ReviewGroup color="red" title="오류 (0)" body="오류가 발견되지 않았습니다." />
            <ReviewGroup color="blue" title="검토 필요 (1)" body="마케팅 표현이 과장 광고로 해석될 가능성이 있습니다." />
          </div>
        </section>
      </div>

      <BottomBar
        leftLabel="이전으로"
        onBack={onBack}
        helper="검토 완료 후 다음 단계에서 게시 콘텐츠를 생성할 수 있습니다."
        secondaryLabel="수정사항 저장"
        rightLabel="검토 완료 및 콘텐츠 생성"
        onNext={onNext}
      />
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-4">
      <h4 className="font-black text-slate-950">{title}</h4>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function OriginalKeyInfo({
  keyNumbers,
  includedInformation,
}: {
  keyNumbers: KeyNumberPreview[];
  includedInformation: string[];
}) {
  if (keyNumbers.length > 0) {
    return (
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold text-slate-500">핵심 수치</p>
          <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-extrabold text-red-600">
            {keyNumbers.length}건 추출
          </span>
        </div>
        <div className="max-h-[510px] space-y-3 overflow-y-auto pr-1">
          {keyNumbers.map((item, index) => (
            <div
              key={`${item.label}-${item.value}-${index}`}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-[14px] font-black text-slate-950">{item.label}</p>
                <p className="max-w-[170px] text-right text-[15px] font-black leading-6 text-red-600">
                  {item.value}
                </p>
              </div>
              {item.source_text && (
                <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-[12px] font-semibold leading-5 text-slate-600">
                  {item.source_text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-[13px] font-extrabold text-slate-500">감지된 정보</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {includedInformation.length > 0 ? (
          includedInformation.slice(0, 10).map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[13px] font-bold text-slate-700"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-[14px] font-bold text-slate-500">
            원문에서 확인된 핵심 수치가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: ElementType;
  title: string;
  value: string;
  color: "emerald" | "amber" | "red" | "blue";
}) {
  const classes = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="flex h-16 min-w-28 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${classes[color]}`}>
        <Icon size={21} />
      </div>
      <div>
        <p className={`text-[13px] font-black ${classes[color].split(" ")[0]}`}>{title}</p>
        <p className="text-[19px] font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function ReviewGroup({
  color,
  title,
  body,
  detail,
}: {
  color: "emerald" | "amber" | "red" | "blue";
  title: string;
  body: string;
  detail?: string;
}) {
  const styles = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-100 bg-white text-red-600",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[color]}`}>
      <div className="flex items-center justify-between">
        <p className="font-black">{title}</p>
        <ChevronDown size={18} />
      </div>
      <p className="mt-2 text-[13px] font-semibold text-slate-600">{body}</p>
      {detail && (
        <div className="mt-5 border-t border-amber-200 pt-4">
          <p className="text-[13px] font-semibold leading-6 text-slate-600">{detail}</p>
          <div className="mt-4 flex gap-3">
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[12px] font-extrabold text-slate-700">
              문장 보기
            </button>
            <button className="rounded-md bg-violet-100 px-4 py-2 text-[12px] font-extrabold text-violet-700">
              수정 제안 적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
