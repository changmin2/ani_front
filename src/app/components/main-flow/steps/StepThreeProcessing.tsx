import { useEffect, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";
import { AiCube } from "../shared/AiCube";
import { BottomBar } from "../shared/BottomBar";
import type { FlowExecutionSettings, FlowInput } from "../types";

const API_BASE_URL = "http://localhost:8000";

type FinanceTermMatch = {
  id: string;
  term_ko: string;
  term_en: string;
  term_vi: string;
  term_zh: string;
  term_kk: string;
  description: string;
  score?: number;
};

type TermLanguage = {
  label: string;
  field: "term_en" | "term_vi" | "term_zh" | "term_kk";
};

type StepThreeProcessingProps = {
  onBack: () => void;
  onNext: () => void;
  input: FlowInput | null;
  settings: FlowExecutionSettings | null;
};

function formatList(items: string[]) {
  // "영어, 중국어 및 베트남어"처럼 화면 문장에 자연스럽게 들어갈 목록 문자열을 만든다.
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];

  return `${items.slice(0, -1).join(", ")} 및 ${items.at(-1)}`;
}

function getLanguageNames(settings: FlowExecutionSettings | null) {
  // 2페이지 언어 라벨은 "베트남어 (Tiếng Việt)" 형태라, 진행 문구에는 앞의 한국어 이름만 사용한다.
  return settings?.targetLanguages.map((language) => language.split(" ")[0]) ?? [];
}

function getSelectedTermLanguages(settings: FlowExecutionSettings | null): TermLanguage[] {
  const languages = settings?.targetLanguages ?? [];

  return languages
    .map((language) => {
      if (language.startsWith("영어")) return { label: "EN", field: "term_en" } as const;
      if (language.startsWith("중국어")) return { label: "ZH", field: "term_zh" } as const;
      if (language.startsWith("베트남어")) return { label: "VI", field: "term_vi" } as const;
      if (language.startsWith("카자흐스탄어")) return { label: "KK", field: "term_kk" } as const;

      return null;
    })
    .filter((language): language is TermLanguage => Boolean(language));
}

function getCompletedDescription(input: FlowInput | null) {
  // 백엔드 분석 결과에서 실제 추출된 포함 정보/핵심 수치/주의 문구 개수를 모아
  // 3페이지 "방금 완료한 작업" 문장으로 보여준다.
  const analysis = input?.analysisResponse?.analysis;
  const includedInformation = analysis?.included_information ?? [];
  const keyNumbers = analysis?.key_numbers_preview ?? [];
  const legalNoticeCount = analysis?.legal_notice_detection?.count ?? 0;

  const extractedItems = [
    ...includedInformation,
    ...keyNumbers.map((item) => item.label),
    legalNoticeCount > 0 ? `법적/주의 문구 ${legalNoticeCount}건` : "",
  ]
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);

  if (extractedItems.length === 0) {
    return "문서 구조와 주요 정보를 추출했습니다.";
  }

  return `문서에서 ${formatList(extractedItems)}을 추출했습니다.`;
}

function getNextTaskDescription(settings: FlowExecutionSettings | null) {
  // 2페이지에서 선택한 대상 언어에 맞춰 "다음 작업" 문구를 만든다.
  // 예: 베트남어 + 중국어 선택 시 "베트남어 및 중국어 번역 초안..."으로 표시된다.
  const languageNames = getLanguageNames(settings);
  const languageText = formatList(languageNames);

  if (!languageText) {
    return "번역 초안을 생성한 뒤, 수치와 법적 고지 문구의 누락 여부를 검수합니다.";
  }

  return `${languageText} 번역 초안을 생성한 뒤, 수치와 법적 고지 문구의 누락 여부를 검수합니다.`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `약 ${seconds}초`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) return `약 ${minutes}분`;

  return `약 ${minutes}분 ${remainingSeconds}초`;
}

function getEstimatedProcessingTime(
  settings: FlowExecutionSettings | null,
  input: FlowInput | null
) {
  const languageCount = settings?.targetLanguages.length ?? 0;
  const keyNumberCount = input?.analysisResponse?.analysis.key_numbers_preview?.length ?? 0;
  const noticeCount = input?.analysisResponse?.analysis.legal_notice_detection?.count ?? 0;
  const sourceLength = getSourceText(input).length;
  const lengthSeconds = sourceLength > 3000 ? 40 : sourceLength > 1200 ? 25 : 10;
  const baseSeconds = 45;
  const estimatedSeconds =
    baseSeconds +
    Math.max(languageCount, 1) * 25 +
    keyNumberCount * 4 +
    noticeCount * 5 +
    lengthSeconds;

  return `${formatDuration(Math.max(60, estimatedSeconds - 20))} ~ ${formatDuration(estimatedSeconds + 30)}`;
}

function getCurrentProcessingStage(settings: FlowExecutionSettings | null) {
  const languageNames = getLanguageNames(settings);
  const languageText = formatList(languageNames);

  if (!languageText) {
    return "번역 초안을 생성하고 원문과 번역본의 수치/조건을 대조하고 있습니다.";
  }

  return `${languageText} 번역 초안을 생성하고 원문과 번역본의 수치/조건을 대조하고 있습니다.`;
}

function getDocumentStructure(input: FlowInput | null) {
  // 백엔드 document_structure를 3페이지 "문서 구조 분석" 카드에 맞는 형태로 정리한다.
  // 구조 분석 값이 비어 있으면 파일명/포함 정보/주의 문구 분석 결과로 fallback한다.
  const analysis = input?.analysisResponse?.analysis;
  const structure = analysis?.document_structure;
  const fallbackTitle =
    input?.mode === "file"
      ? input.fileName.replace(/\.[^.]+$/, "")
      : analysis?.document_type || "입력 문서";

  return {
    title: structure?.title || fallbackTitle,
    bodySections:
      structure?.body_sections?.length
        ? structure.body_sections
        : analysis?.included_information ?? [],
    noticePhrases:
      structure?.notice_phrases?.length
        ? structure.notice_phrases
        : analysis?.legal_notice_detection?.items ?? [],
  };
}

function getSourceText(input: FlowInput | null) {
  if (!input) return "";
  if (input.analysisResponse?.text) return input.analysisResponse.text;
  if (input.mode === "text") return input.text;

  return "";
}

function dedupeTermMatches(matches: FinanceTermMatch[]) {
  const seenTerms = new Set<string>();

  return matches.filter((match) => {
    const termKey = match.term_ko.trim().replace(/\s+/g, "");

    if (!termKey || seenTerms.has(termKey)) {
      return false;
    }

    seenTerms.add(termKey);
    return true;
  });
}

export function StepThreeProcessing({
  onBack,
  onNext,
  input,
  settings,
}: StepThreeProcessingProps) {
  const [ready, setReady] = useState(false);
  const [termMatches, setTermMatches] = useState<FinanceTermMatch[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [hasLoadedTerms, setHasLoadedTerms] = useState(false);
  const [termError, setTermError] = useState("");
  // 아래 값들은 1페이지 분석 결과와 2페이지 실행 설정을 조합해 만든 3페이지 표시용 데이터다.
  const completedDescription = getCompletedDescription(input);
  const nextTaskDescription = getNextTaskDescription(settings);
  const documentStructure = getDocumentStructure(input);
  const keyNumbers = input?.analysisResponse?.analysis.key_numbers_preview ?? [];
  const sourceText = getSourceText(input);
  const languageNames = getLanguageNames(settings);
  const selectedTermLanguages = getSelectedTermLanguages(settings);
  const estimatedProcessingTime = getEstimatedProcessingTime(settings, input);
  const currentProcessingStage = getCurrentProcessingStage(settings);
  const statusLanguageLabel =
    languageNames.length > 0 ? `${formatList(languageNames)} 번역 준비 중` : "번역 준비 중";
  const shouldWaitForTermMatches = Boolean(sourceText.trim()) && !hasLoadedTerms;

  useEffect(() => {
    // 현재는 실제 번역 API가 없으므로 짧은 처리 대기 후 다음 단계 버튼을 활성화한다.
    // 추후 번역/검수 API가 생기면 이 timer 대신 실제 작업 완료 상태를 연결하면 된다.
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sourceText.trim()) {
      setTermMatches([]);
      setHasLoadedTerms(true);
      return;
    }

    const controller = new AbortController();

    async function loadFinanceTerms() {
      setIsLoadingTerms(true);
      setHasLoadedTerms(false);
      setTermError("");

      try {
        const response = await fetch(`${API_BASE_URL}/finance-terms/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: sourceText,
            top: 12,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.detail || "금융용어 매칭에 실패했습니다.");
        }

        const data = await response.json();
        setTermMatches(dedupeTermMatches(data.matches ?? []));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setTermError(
          error instanceof Error
            ? error.message
            : "금융용어 매칭 중 오류가 발생했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTerms(false);
          setHasLoadedTerms(true);
        }
      }
    }

    loadFinanceTerms();

    return () => controller.abort();
  }, [sourceText]);

  if (shouldWaitForTermMatches) {
    return (
      <div className="mx-auto max-w-[980px] px-10 py-16">
        <section className="rounded-xl border border-amber-100 bg-amber-50 p-10 shadow-sm">
          <div className="flex items-start gap-7">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-600">
              <Sparkles size={28} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[30px] font-black tracking-tight text-slate-950">
                금융용어를 매칭하고 있습니다
              </h1>
              <p className="mt-4 max-w-[720px] text-[16px] font-medium leading-8 text-slate-700">
                업로드한 원문에서 실제로 등장한 금융용어를 찾고, 선택한 대상 언어의 표준 표현만 정리하고 있습니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <StatusPill color="amber" label="AI Search 금융용어집 검색 중" />
                <StatusPill color="blue" label={statusLanguageLabel} />
              </div>
              <p className="mt-7 flex items-center gap-3 text-[15px] font-bold text-slate-600">
                <Clock3 size={20} className="animate-pulse text-amber-600" />
                매칭이 끝나면 중간 산출물 화면으로 자동 이동합니다.
              </p>
              {isLoadingTerms && (
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-500" />
                </div>
              )}
            </div>
          </div>
        </section>
        <button
          onClick={onBack}
          className="mt-6 h-11 rounded-lg border border-slate-200 px-5 text-[14px] font-extrabold text-slate-700"
        >
          이전으로
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] px-10 py-4">
      <section className="rounded-xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-red-50 p-9 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_380px]">
          <div className="flex items-start gap-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-[32px] font-black tracking-tight text-slate-950">
                번역 및 검수를 진행하고 있습니다
              </h1>
              <p className="mt-4 max-w-[660px] text-[17px] font-medium leading-8 text-slate-700">
                현재 승인된 번역 데이터와 금융용어집을 비교하여 가장 적합한 표현을 선택하고 있습니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <StatusPill color="red" label="승인 번역 데이터 참조 중" />
                <StatusPill color="amber" label="금융용어 표준 표현 적용 중" />
                <StatusPill color="blue" label={statusLanguageLabel} />
              </div>
              <div className="mt-6 rounded-lg border border-slate-200 bg-white px-5 py-4">
                <div className="flex flex-wrap items-center gap-3 text-[15px] font-bold text-slate-800">
                  <Clock3 size={21} className="text-slate-500" />
                  처리 예상 시간
                  <span className="text-[18px] font-black text-red-600">
                    {estimatedProcessingTime}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-semibold leading-6 text-slate-600">
                  {currentProcessingStage}
                </p>
              </div>
            </div>
          </div>
          <AiCube compact />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[480px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-[22px] font-black text-slate-950">AI 처리 상태</h2>
          <div className="mt-8 space-y-8">
            <ProcessItem
              done
              title="방금 완료한 작업"
              desc={completedDescription}
            />
            <ProcessItem
              active
              title="현재 진행 중"
              desc="이전 승인 번역 데이터와 금융용어집을 비교하여 가장 적합한 표현을 선택하고 있습니다."
            />
            <ProcessItem
              title="다음 작업"
              desc={nextTaskDescription}
            />
          </div>
          <button className="mt-10 flex h-13 w-full items-center justify-between rounded-lg border border-slate-200 px-5 text-[16px] font-extrabold text-slate-950">
            상세 처리 과정 보기
            <ChevronDown size={20} />
          </button>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 text-[22px] font-black text-slate-950">
            중간 산출물 미리보기
            <Info size={19} className="text-slate-400" />
          </h2>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <PreviewCard title="문서 구조 분석" tone="red">
              <p className="font-extrabold">제목</p>
              <p>{documentStructure.title || "-"}</p>
              <p className="mt-3 font-extrabold">본문 영역</p>
              <p>
                {documentStructure.bodySections.length > 0
                  ? documentStructure.bodySections.join(", ")
                  : "-"}
              </p>
              <p className="mt-3 font-extrabold">주의 문구</p>
              <p>
                {documentStructure.noticePhrases.length > 0
                  ? documentStructure.noticePhrases.join(", ")
                  : "감지된 주의 문구 없음"}
              </p>
            </PreviewCard>
            <PreviewCard title="금융용어 매칭" tone="amber">
              {isLoadingTerms ? (
                <p className="text-slate-500">AI Search에서 금융용어를 매칭하고 있습니다.</p>
              ) : termError ? (
                <p className="text-red-600">{termError}</p>
              ) : termMatches.length > 0 ? (
                <>
                  <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
                    {termMatches.slice(0, 6).map((term) => (
                      <div key={term.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                        <div className="grid grid-cols-[82px_20px_1fr] gap-1">
                          <b className="text-slate-950">{term.term_ko}</b>
                          <span className="text-amber-600">→</span>
                          <span>
                            {selectedTermLanguages.length === 1
                              ? term[selectedTermLanguages[0].field] || "-"
                              : selectedTermLanguages.length > 1
                                ? `${selectedTermLanguages.length}개 언어 매칭`
                                : "-"}
                          </span>
                        </div>
                        {selectedTermLanguages.length > 1 && (
                          <div className="mt-2 grid grid-cols-1 gap-1 text-[13px] leading-6 text-slate-500">
                            {selectedTermLanguages.map((language) => (
                              <span key={language.field}>
                                {language.label} {term[language.field] || "-"}
                              </span>
                            ))}
                          </div>
                        )}
                        {term.description && (
                          <p className="mt-2 text-[13px] leading-6 text-slate-600">
                            {term.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-right font-bold text-slate-600">
                    총 {termMatches.length}건 매칭 완료
                  </p>
                </>
              ) : (
                <p className="text-slate-500">매칭된 금융용어가 없습니다.</p>
              )}
            </PreviewCard>
            <PreviewCard title="핵심 수치 검수 대상" tone="green">
              {keyNumbers.length > 0 ? (
                keyNumbers.map((item) => (
                  <div key={`${item.label}-${item.value}`} className="grid grid-cols-[100px_1fr] py-1">
                    <b>{item.label}</b>
                    <span className="text-right">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">원문에서 확인된 핵심 수치가 없습니다.</p>
              )}
              <p className="mt-5 text-right font-bold text-slate-600">
                총 {keyNumbers.length}건 수치 검수 예정
              </p>
            </PreviewCard>
          </div>

          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-[20px] font-black text-slate-950">
                <Sparkles className="text-violet-600" size={24} />
                번역 초안 생성 중
              </h3>
              <span className="rounded-full bg-violet-100 px-4 py-1 text-[14px] font-extrabold text-violet-700">
                생성 중...
              </span>
            </div>
            <p className="mt-4 font-extrabold text-slate-950">BNK The Convenient Time Deposit</p>
            <p className="mt-2 text-slate-700">
              This product is designed for foreign customers who want a stable savings option with clear interest benefits...
            </p>
            <p className="mt-3 text-[17px] font-bold text-violet-700">
              우대금리 조건 문장을 검수하고 있습니다.
            </p>
          </div>
        </section>
      </div>

      <BottomBar
        leftLabel="이전으로"
        onBack={onBack}
        helper="입력된 문서는 암호화되어 안전하게 처리되며, 분석 후 자동으로 삭제됩니다."
        rightLabel="결과 검토로 이동"
        onNext={onNext}
        disabled={!ready}
      />
    </div>
  );
}

function StatusPill({ color, label }: { color: "red" | "amber" | "blue"; label: string }) {
  const className = {
    red: "border-red-200 bg-red-50 text-slate-800 before:bg-red-600",
    amber: "border-amber-200 bg-amber-50 text-slate-800 before:bg-amber-500",
    blue: "border-blue-200 bg-blue-50 text-slate-800 before:bg-blue-600",
  }[color];

  return (
    <span className={`relative rounded-full border px-5 py-2 pl-9 text-[14px] font-bold before:absolute before:left-5 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full ${className}`}>
      {label}
    </span>
  );
}

function ProcessItem({
  done,
  active,
  title,
  desc,
}: {
  done?: boolean;
  active?: boolean;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5">
      <div
        className={[
          "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          done ? "bg-emerald-50 text-emerald-600" : active ? "border-2 border-blue-600 text-blue-600" : "text-slate-500",
        ].join(" ")}
      >
        {done ? <CheckCircle2 size={24} /> : active ? <Circle size={18} className="animate-pulse" /> : <Clock3 size={24} />}
      </div>
      <div>
        <h3 className={`text-[16px] font-extrabold ${done ? "text-emerald-700" : active ? "text-blue-700" : "text-slate-600"}`}>
          {title}
        </h3>
        <p className="mt-2 text-[14px] font-medium leading-7 text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function PreviewCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "red" | "amber" | "green";
  children: ReactNode;
}) {
  const classes = {
    red: "border-red-100 bg-red-50 text-red-600",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-[14px] leading-7 text-slate-700">
      <div className={`flex items-center gap-3 border-b px-5 py-3 ${classes[tone]}`}>
        <FileText size={18} />
        <h3 className="font-extrabold text-slate-950">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
