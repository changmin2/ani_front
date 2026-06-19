import { useEffect, useState, type ElementType, type ReactNode } from "react";
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
  Type,
  Users,
  X,
} from "lucide-react";
import { analyzeInput, formatFileSize } from "../analyzeInput";
import { reviewChecks } from "../flowData";
import { BottomBar } from "../shared/BottomBar";
import type {
  AnalysisResult,
  FlowExecutionSettings,
  FlowInput,
  RetrievedDocument,
} from "../types";

type StepTwoRecommendationProps = {
  onBack: () => void;
  onNext: (settings: FlowExecutionSettings) => void;
  input: FlowInput | null;
};

const documentTypeOptions = [
  "금융 상품안내문",
  "마케팅 콘텐츠",
  "고객 안내서",
];

const languageOptions = [
  "영어 (English)",
  "중국어 (中文)",
  "베트남어 (Tiếng Việt)",
  "카자흐스탄어 (Қазақша)",
];

const publishChannelOptions = [
  "모바일 앱 공지",
  "홈페이지 안내",
  "영업점 게시문",
  "SNS 카드뉴스",
  "배너",
];

const toneStyleOptions = [
  "쉽고 명확한 고객 안내 표현",
  "공식적이고 신뢰감 있는 금융 문체",
  "법적 고지 중심의 정확한 표현",
  "마케팅용 간결하고 설득력 있는 표현",
  "외국인 고객 대상 쉬운 설명형 표현",
];

function normalizeDocumentType(documentType: string) {
  const matched = documentTypeOptions.find((option) =>
    option.replace(/\s/g, "") === documentType.replace(/\s/g, "")
  );

  return matched || "금융 상품안내문";
}

function getDefaultToneStyle(documentType: string) {
  switch (normalizeDocumentType(documentType)) {
    case "마케팅 콘텐츠":
      return "마케팅용 간결하고 설득력 있는 표현";
    case "고객 안내서":
      return "쉽고 명확한 고객 안내 표현";
    case "금융 상품안내문":
    default:
      return "공식적이고 신뢰감 있는 금융 문체";
  }
}

export function StepTwoRecommendation({ onBack, onNext, input }: StepTwoRecommendationProps) {
  // StepOneUpload에서 받아온 백엔드 분석 결과를 화면용 AnalysisResult로 변환한다.
  const analysis = analyzeInput(input);
  const confidencePercent = Math.round(
    Math.min(Math.max(analysis.confidence, 0), 1) * 100
  );
  const [selectedDocumentType, setSelectedDocumentType] = useState(
    normalizeDocumentType(analysis.documentType)
  );
  const [selectedToneStyle, setSelectedToneStyle] = useState(
    getDefaultToneStyle(analysis.documentType)
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [selectedPublishChannels, setSelectedPublishChannels] = useState<string[]>(
    publishChannelOptions.slice(0, 3)
  );
  const [selectedReviewChecks, setSelectedReviewChecks] = useState<string[]>([
    ...reviewChecks,
  ]);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const retrievedDocuments = input?.analysisResponse?.retrieved_documents ?? [];
  // 실행 전에 반드시 선택되어야 하는 설정들.
  // 버튼은 항상 활성 상태로 보이지만, 누락 항목이 있으면 다음 단계로 넘기지 않고 안내 문구를 띄운다.
  const missingRequiredSettings = [
    !selectedDocumentType && "문서 유형",
    selectedLanguages.length === 0 && "대상 언어",
    selectedPublishChannels.length === 0 && "게시 채널",
    !selectedToneStyle && "톤 & 스타일",
    selectedReviewChecks.length === 0 && "검수 기준",
  ].filter(Boolean);
  const canRunReview = missingRequiredSettings.length === 0;
  const requiredSettingsMessage = canRunReview
    ? "실행 설정이 모두 선택되었습니다."
    : `${missingRequiredSettings.join(", ")} 선택이 필요합니다.`;
  const runReview = () => {
    if (!canRunReview) {
      setValidationMessage(requiredSettingsMessage);
      return;
    }

    // 사용자가 2페이지에서 최종 선택한 실행 설정을 3페이지로 넘긴다.
    // 3페이지는 이 값을 사용해 "다음 작업" 문구와 번역 대상 언어 표시를 동적으로 만든다.
    onNext({
      documentType: selectedDocumentType,
      targetLanguages: selectedLanguages,
      publishChannels: selectedPublishChannels,
      toneStyle: selectedToneStyle,
      reviewChecks: selectedReviewChecks,
    });
  };

  useEffect(() => {
    // API 분석 결과가 바뀌면 문서 유형과 톤 기본 추천도 다시 맞춘다.
    // 사용자가 문서 유형을 직접 바꾸는 경우에도 같은 추천 규칙을 적용한다.
    const nextDocumentType = normalizeDocumentType(analysis.documentType);

    setSelectedDocumentType(nextDocumentType);
    setSelectedToneStyle(getDefaultToneStyle(nextDocumentType));
  }, [analysis.documentType]);

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
          <span className="text-[28px] font-black">{confidencePercent}%</span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[560px_1fr]">
        <SummaryPanel input={input} analysis={analysis} />

        <section className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-[22px] font-black text-slate-950">AI 추천 실행 설정</h2>
          <p className="mt-2 text-[15px] font-medium text-slate-600">
            AI가 문서를 분석해 아래 설정을 추천했습니다. 필요 시 직접 수정할 수 있습니다.
          </p>

          <div className="mt-7 grid gap-7">
            <SettingRow icon={FileText} label="문서 유형">
              <div className="relative flex h-12 items-center rounded-lg border border-slate-200 px-4">
                <select
                  value={selectedDocumentType}
                  onChange={(event) => {
                    const nextDocumentType = event.target.value;

                    setSelectedDocumentType(nextDocumentType);
                    setSelectedToneStyle(getDefaultToneStyle(nextDocumentType));
                    setValidationMessage("");
                  }}
                  className="h-full flex-1 appearance-none bg-transparent pr-32 text-[16px] font-bold text-slate-950 outline-none"
                >
                  {documentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-extrabold text-red-600">
                    AI 추천
                  </span>
                  <ChevronDown size={18} className="pointer-events-none text-slate-500" />
                </div>
              </div>
            </SettingRow>

            <SettingRow icon={Users} label="대상 언어">
              <div className="relative flex flex-wrap gap-3">
                {selectedLanguages.map((lang) => (
                  <span key={lang} className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-5 text-[16px] font-semibold text-slate-800">
                    {lang}
                    <button
                      onClick={() =>
                        setSelectedLanguages((current) =>
                          current.filter((item) => item !== lang)
                        )
                      }
                      onMouseDown={() => setValidationMessage("")}
                    >
                      <X size={16} className="text-slate-500" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setIsLanguageMenuOpen((open) => !open)}
                  className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-5 text-[16px] font-semibold text-slate-700"
                >
                  <Plus size={18} />
                  언어 추가
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute left-0 top-14 z-10 w-[260px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    {languageOptions.map((lang) => {
                      const isSelected = selectedLanguages.includes(lang);

                      return (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguages((current) =>
                              isSelected
                                ? current.filter((item) => item !== lang)
                                : [...current, lang]
                            );
                            setIsLanguageMenuOpen(false);
                            setValidationMessage("");
                          }}
                          className={[
                            "flex h-11 w-full items-center justify-between rounded-md px-3 text-left text-[15px] font-semibold",
                            isSelected
                              ? "bg-red-50 text-red-600"
                              : "text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <span>{lang}</span>
                          {isSelected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </SettingRow>

            <SettingRow icon={Link2} label="게시 채널" hint="(복수 선택 가능)">
              <div className="grid grid-cols-2 gap-x-14 gap-y-4 xl:grid-cols-3">
                {publishChannelOptions.map((item) => (
                  <CheckOption
                    key={item}
                    checked={selectedPublishChannels.includes(item)}
                    label={item}
                    onToggle={() =>
                      setSelectedPublishChannels((current) =>
                        current.includes(item)
                          ? current.filter((selected) => selected !== item)
                          : [...current, item]
                      )
                    }
                    onAfterToggle={() => setValidationMessage("")}
                  />
                ))}
              </div>
            </SettingRow>

            <SettingRow icon={Circle} label="톤 & 스타일">
              <div className="relative flex h-12 items-center rounded-lg border border-slate-200 px-4">
                <select
                  value={selectedToneStyle}
                  onChange={(event) => setSelectedToneStyle(event.target.value)}
                  onClick={() => setValidationMessage("")}
                  className="h-full flex-1 appearance-none bg-transparent pr-10 text-[16px] font-bold text-slate-950 outline-none"
                >
                  {toneStyleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none text-slate-500" />
              </div>
            </SettingRow>

            <SettingRow icon={ShieldCheck} label="검수 기준" hint="(복수 선택 가능)">
              <div className="grid grid-cols-1 gap-x-16 gap-y-4 xl:grid-cols-2">
                {reviewChecks.map((item) => (
                  <CheckOption
                    key={item}
                    checked={selectedReviewChecks.includes(item)}
                    label={item}
                    onToggle={() =>
                      setSelectedReviewChecks((current) =>
                        current.includes(item)
                          ? current.filter((selected) => selected !== item)
                          : [...current, item]
                      )
                    }
                    onAfterToggle={() => setValidationMessage("")}
                  />
                ))}
              </div>
            </SettingRow>
          </div>

          <div className="mt-8 w-full">
            <button
              onClick={() => setIsEvidenceOpen((open) => !open)}
              className="flex h-12 w-full items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-5 text-[15px] font-extrabold text-slate-800"
            >
              <span className="flex items-center gap-3">
                <Info size={18} className="text-amber-600" />
                AI 추천 근거 보기
              </span>
              <ChevronDown
                size={18}
                className={[
                  "text-blue-700 transition",
                  isEvidenceOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {isEvidenceOpen && (
              <EvidencePanel documents={retrievedDocuments} />
            )}
          </div>

          {validationMessage && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-[14px] font-extrabold text-rose-700">
              {validationMessage}
            </div>
          )}
        </section>
      </div>

      <BottomBar
        leftLabel="이전으로"
        onBack={onBack}
        helper={requiredSettingsMessage}
        rightLabel="번역 및 검수 실행"
        onNext={runReview}
      />
    </div>
  );
}

function EvidencePanel({ documents }: { documents: RetrievedDocument[] }) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-extrabold text-slate-950">
            AI Search 검색 근거
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-slate-500">
            문서 유형과 추천 설정 판단에 참고한 관련 문서입니다.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[12px] font-extrabold text-slate-600">
          {documents.length}건
        </span>
      </div>

      <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto pr-1">
        {documents.length > 0 ? (
          documents.map((document, index) => (
            <div
              key={`${document.id}-${index}`}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-600">
                      {document.category || "분류 없음"}
                    </span>
                    <span className="text-[12px] font-bold text-slate-400">
                      {document.id}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-extrabold text-slate-950">
                    {document.title || "제목 없음"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-bold text-slate-400">관련도 점수</p>
                  <p className="mt-1 text-[13px] font-extrabold text-slate-700">
                    {typeof document.score === "number"
                      ? document.score.toFixed(4)
                      : "-"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[14px] font-medium leading-6 text-slate-700">
                {document.content || "내용 없음"}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[12px] font-bold text-slate-500">
                  원본 파일
                </span>
                <span className="text-[12px] font-extrabold text-slate-700">
                  {document.source_file || "-"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
            <p className="text-[14px] font-bold text-slate-500">
              표시할 검색 근거가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function splitIncludedInfo(value: string) {
  return value
    .split(/,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);
}

function shortenInfoLabel(value: string) {
  const maxLength = 28;

  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength)}...`;
}

function SummaryInfoRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-[15px] font-medium leading-6 text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function SummaryPanel({
  input,
  analysis,
}: {
  input: FlowInput | null;
  analysis: AnalysisResult;
}) {
  const [isIncludedInfoExpanded, setIsIncludedInfoExpanded] = useState(false);
  const [isKeyNumbersOpen, setIsKeyNumbersOpen] = useState(false);
  const coreRows = [
    { label: "기본금리", value: analysis.coreNumbers.baseRate },
    { label: "우대금리", value: analysis.coreNumbers.preferentialRate },
    { label: "가입기간", value: analysis.coreNumbers.term },
    { label: "예금자보호", value: analysis.coreNumbers.protection },
    { label: "중도해지 이율", value: analysis.coreNumbers.earlyWithdrawal },
  ].filter((item) => item.value && item.value !== "-");

  const keyNumberRows =
    analysis.keyNumbersPreview.length > 0
      ? analysis.keyNumbersPreview
      : coreRows;
  // 핵심 수치가 많으면 화면이 길어지므로 일부만 보여주고 나머지는 모달로 뺀다.
  const KEY_NUMBER_PREVIEW_LIMIT = 5;
  const visibleKeyNumberRows = keyNumberRows.slice(0, KEY_NUMBER_PREVIEW_LIMIT);
  const hiddenKeyNumberCount = Math.max(
    keyNumberRows.length - visibleKeyNumberRows.length,
    0
  );
  const includedInfoItems = splitIncludedInfo(analysis.includedInfo);
  const visibleIncludedInfoItems = isIncludedInfoExpanded
    ? includedInfoItems
    : includedInfoItems.slice(0, 8);
  const hiddenIncludedInfoCount = Math.max(
    includedInfoItems.length - visibleIncludedInfoItems.length,
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-[20px] font-extrabold text-slate-950">
        {input?.mode === "text" ? "입력 텍스트 요약" : "업로드 문서 요약"}
      </h2>
      <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-600 text-white">
            {input?.mode === "text" ? <Type size={23} /> : <FileText size={23} />}
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-950">
              {input?.mode === "text"
                ? "직접 입력한 금융문서 텍스트"
                : input?.fileName ?? "업로드된 문서가 없습니다"}
            </p>
            <p className="mt-1 text-[14px] text-slate-500">
              {input?.mode === "text"
                ? `${input.text.length.toLocaleString()}자`
                : input
                  ? `${input.fileType || "FILE"} · ${formatFileSize(input.fileSize)}`
                  : "파일 또는 텍스트를 먼저 입력해주세요"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-extrabold text-emerald-700">
          {input?.mode === "text" ? "입력 완료" : "업로드 완료"}
        </span>
      </div>

      {input?.mode === "text" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-[13px] font-extrabold text-slate-500">입력 내용</p>
          <p className="max-h-32 overflow-y-auto text-[14px] font-medium leading-7 text-slate-700">
            {input.text}
          </p>
        </div>
      )}

      <h3 className="mt-6 text-[16px] font-extrabold text-slate-950">AI가 감지한 문서 정보</h3>
      <div className="mt-4 space-y-4">
        <SummaryInfoRow
          icon={Sparkles}
          label="문서 유형"
          value={analysis.documentType}
          color="bg-red-50 text-red-600"
        />
        <SummaryInfoRow
          icon={Users}
          label="문서 성격"
          value={analysis.documentCharacter}
          color="bg-slate-100 text-slate-600"
        />
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <FileText size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-bold text-slate-500">포함 정보</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                {includedInfoItems.length}개 감지
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {visibleIncludedInfoItems.length > 0 ? (
                visibleIncludedInfoItems.map((item) => (
                  <span
                    key={item}
                    title={item}
                    className="max-w-full rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[13px] font-bold text-slate-700"
                  >
                    {shortenInfoLabel(item)}
                  </span>
                ))
              ) : (
                <span className="text-[14px] font-medium text-slate-500">
                  감지된 포함 정보가 없습니다.
                </span>
              )}
              {hiddenIncludedInfoCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsIncludedInfoExpanded(true)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-extrabold text-slate-600"
                >
                  +{hiddenIncludedInfoCount}개 더보기
                </button>
              )}
              {isIncludedInfoExpanded && includedInfoItems.length > 8 && (
                <button
                  type="button"
                  onClick={() => setIsIncludedInfoExpanded(false)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-extrabold text-slate-600"
                >
                  접기
                </button>
              )}
            </div>
          </div>
        </div>
        <SummaryInfoRow
          icon={Info}
          label="법적/주의 문구 감지"
          value={`${analysis.legalNoticeCount}건`}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-slate-950">
            핵심 수치 미리보기
            {keyNumberRows.length > 0 && (
              <span className="ml-2 text-[13px] font-semibold text-slate-500">
                ({keyNumberRows.length})
              </span>
            )}
          </h3>
          {hiddenKeyNumberCount > 0 && (
            <button
              type="button"
              onClick={() => setIsKeyNumbersOpen(true)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              자세히 보기
            </button>
          )}
        </div>
        <div className="mt-4 space-y-3">
          {keyNumberRows.length > 0 ? (
            <>
              {visibleKeyNumberRows.map((item) => (
                <div key={item.label} className="grid grid-cols-[32px_100px_1fr] items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500">
                    <Check size={17} />
                  </div>
                  <span className="text-[14px] font-extrabold text-slate-800">{item.label}</span>
                  <span className="text-[14px] font-medium text-slate-600">{item.value}</span>
                </div>
              ))}
              {hiddenKeyNumberCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsKeyNumbersOpen(true)}
                  className="w-full rounded-lg border border-dashed border-red-200 bg-white py-2 text-[13px] font-extrabold text-red-600 hover:bg-red-50"
                >
                  +{hiddenKeyNumberCount}건 더 보기
                </button>
              )}
            </>
          ) : (
            <p className="text-[14px] font-medium text-slate-500">
              원문에서 확인된 핵심 수치가 없습니다.
            </p>
          )}
        </div>
      </div>

      {isKeyNumbersOpen && (
        <KeyNumbersDialog rows={keyNumberRows} onClose={() => setIsKeyNumbersOpen(false)} />
      )}
    </div>
  );
}

function KeyNumbersDialog({
  rows,
  onClose,
}: {
  rows: { label: string; value: string }[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6"
      onClick={onClose}
    >
      <section
        className="flex max-h-[80vh] w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-[19px] font-black text-slate-950">핵심 수치 전체</h2>
            <p className="mt-1 text-[13px] font-semibold text-slate-500">
              원문에서 추출한 핵심 수치 {rows.length}건
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[64vh] overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            {rows.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="grid grid-cols-[32px_120px_1fr] items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500">
                  <Check size={17} />
                </div>
                <span className="text-[14px] font-extrabold text-slate-800">{item.label}</span>
                <span className="text-[14px] font-medium text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
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

function CheckOption({
  checked,
  label,
  onToggle,
  onAfterToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  onAfterToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onToggle();
        onAfterToggle?.();
      }}
      className="flex items-center gap-3 text-left text-[15px] font-bold text-slate-950"
      aria-pressed={checked}
    >
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded border",
          checked ? "border-red-600 bg-red-600 text-white" : "border-slate-300 bg-white",
        ].join(" ")}
      >
        {checked && <Check size={14} />}
      </span>
      {label}
    </button>
  );
}
