import { useEffect, useState, type ElementType } from "react";
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
  X,
} from "lucide-react";
import { BottomBar } from "../shared/BottomBar";
import type { FlowInput, KeyNumberPreview, TranslationByLanguage, TranslationResult } from "../types";

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
  const [editableTranslations, setEditableTranslations] = useState<TranslationByLanguage[]>(
    translationResult?.translations ?? []
  );
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    translationResult?.translations[0]?.language_code ?? ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const translations = editableTranslations;
  const selectedTranslation =
    translations.find((translation) => translation.language_code === selectedLanguageCode) ??
    translations[0] ??
    null;
  const orderedSections = [...(selectedTranslation?.sections ?? [])].sort(
    (first, second) => first.order - second.order
  );
  const analysis = input?.analysisResponse?.analysis;
  const keyNumbers = analysis?.key_numbers_preview ?? [];
  const includedInformation = analysis?.included_information ?? [];
  const sourceTitle =
    input?.mode === "file"
      ? input.fileName
      : analysis?.document_structure?.title || "입력 텍스트";
  const originalFullText =
    input?.analysisResponse?.text ??
    (input?.mode === "text" ? input.text : "") ??
    "";

  useEffect(() => {
    setEditableTranslations(translationResult?.translations ?? []);
    setIsEditing(false);
  }, [translationResult]);

  useEffect(() => {
    if (translations.length === 0) return;

    const hasSelectedLanguage = translations.some(
      (translation) => translation.language_code === selectedLanguageCode
    );

    if (!hasSelectedLanguage) {
      setSelectedLanguageCode(translations[0].language_code);
    }
  }, [selectedLanguageCode, translations]);

  const updateSelectedTranslation = (
    updater: (translation: TranslationByLanguage) => TranslationByLanguage
  ) => {
    if (!selectedTranslation) return;

    setEditableTranslations((currentTranslations) =>
      currentTranslations.map((translation) =>
        translation.language_code === selectedTranslation.language_code
          ? updater(translation)
          : translation
      )
    );
  };

  const updateSelectedTranslationField = (
    field: "title" | "summary",
    value: string
  ) => {
    updateSelectedTranslation((translation) => ({
      ...translation,
      [field]: value,
      full_text: buildTranslationText({
        ...translation,
        [field]: value,
      }),
    }));
  };

  const updateSelectedSection = (
    sectionId: string,
    order: number,
    field: "translated_label" | "translated_text",
    value: string
  ) => {
    updateSelectedTranslation((translation) => {
      const nextTranslation = {
        ...translation,
        sections: translation.sections.map((section) =>
          section.id === sectionId && section.order === order
            ? {
                ...section,
                [field]: value,
              }
            : section
        ),
      };

      return {
        ...nextTranslation,
        full_text: buildTranslationText(nextTranslation),
      };
    });
  };

  const copySelectedTranslation = () => {
    if (!selectedTranslation) return;

    navigator.clipboard?.writeText(selectedTranslation.full_text || buildTranslationText(selectedTranslation));
  };

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
          <button
            type="button"
            onClick={() => setIsOriginalOpen(true)}
            disabled={!originalFullText}
            className="mt-9 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 text-[15px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={18} />
            원문 전체 보기
            <ChevronRight size={18} />
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-[19px] font-black text-slate-950">번역 결과</h2>
                  <Globe2 size={18} className="text-violet-700" />
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-extrabold text-slate-600">
                    {translations.length}개 언어
                  </span>
                </div>
                <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1">
                  {translations.length > 0 ? (
                    translations.map((translation) => (
                      <button
                        key={translation.language_code || translation.language}
                        onClick={() => setSelectedLanguageCode(translation.language_code)}
                        className={[
                          "h-9 shrink-0 rounded-lg border px-4 text-[13px] font-extrabold transition",
                          selectedTranslation?.language_code === translation.language_code
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {translation.language}
                      </button>
                    ))
                  ) : (
                    <span className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-[13px] font-bold text-slate-500">
                      생성된 번역 결과가 없습니다
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setIsEditing((current) => !current)}
                  disabled={!selectedTranslation}
                  className={[
                    "flex h-9 items-center gap-2 rounded-lg border px-4 text-[13px] font-extrabold",
                    isEditing
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-700",
                    !selectedTranslation ? "cursor-not-allowed opacity-50" : "",
                  ].join(" ")}
                >
                  <Edit3 size={15} />
                  {isEditing ? "수정 완료" : "직접 수정"}
                </button>
                <button
                  onClick={copySelectedTranslation}
                  className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[13px] font-extrabold text-slate-700"
                >
                  <Copy size={15} />
                  복사
                </button>
              </div>
            </div>
          </div>

          <article className="max-h-[540px] overflow-y-auto pr-5 text-[16px] leading-7 text-slate-700">
            {selectedTranslation ? (
              <>
                {isEditing ? (
                  <div className="mt-7 space-y-4">
                    <label className="block">
                      <span className="text-[13px] font-black text-slate-500">번역 제목</span>
                      <input
                        value={selectedTranslation.title}
                        onChange={(event) =>
                          updateSelectedTranslationField("title", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-[16px] font-black text-slate-950 outline-none focus:border-violet-400"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[13px] font-black text-slate-500">요약 문장</span>
                      <textarea
                        value={selectedTranslation.summary}
                        onChange={(event) =>
                          updateSelectedTranslationField("summary", event.target.value)
                        }
                        className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-[15px] leading-7 text-slate-700 outline-none focus:border-violet-400"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <h3 className="mt-7 text-[18px] font-black text-slate-950">
                      {selectedTranslation.title || "제목 없음"}
                    </h3>
                    {selectedTranslation.summary && (
                      <p className="mt-3 text-slate-700">{selectedTranslation.summary}</p>
                    )}
                  </>
                )}
                <hr className="my-5 border-slate-200" />
                {orderedSections.length > 0 ? (
                  orderedSections.map((section) =>
                    isEditing ? (
                      <EditableResultSection
                        key={`${selectedTranslation.language_code}-${section.id}-${section.order}`}
                        title={section.translated_label || section.source_label || `Section ${section.order}`}
                        sourceLabel={section.source_label}
                        sourceText={section.source_text}
                        translatedLabel={section.translated_label}
                        translatedText={section.translated_text}
                        onLabelChange={(value) =>
                          updateSelectedSection(section.id, section.order, "translated_label", value)
                        }
                        onTextChange={(value) =>
                          updateSelectedSection(section.id, section.order, "translated_text", value)
                        }
                      />
                    ) : (
                      <ResultSection
                        key={`${selectedTranslation.language_code}-${section.id}-${section.order}`}
                        title={section.translated_label || section.source_label || `Section ${section.order}`}
                        sourceLabel={section.source_label}
                        sourceText={section.source_text}
                      >
                        {section.translated_text || "-"}
                      </ResultSection>
                    )
                  )
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[14px] font-bold text-slate-500">
                    표시할 번역 섹션이 없습니다.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-7 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[14px] font-bold text-slate-500">
                번역 결과가 아직 전달되지 않았습니다.
              </p>
            )}
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

      {isOriginalOpen && (
        <OriginalDocumentModal
          title={sourceTitle}
          fullText={originalFullText}
          file={input?.mode === "file" ? input.file ?? null : null}
          onClose={() => setIsOriginalOpen(false)}
        />
      )}
    </div>
  );
}

function OriginalDocumentModal({
  title,
  fullText,
  file,
  onClose,
}: {
  title: string;
  fullText: string;
  file: File | null;
  onClose: () => void;
}) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 원본 파일은 blob URL을 만들어 iframe/img로 미리보기한다.
  // 모달이 닫히면 URL을 해제해 메모리 누수를 막는다.
  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const fileType = file?.type ?? "";
  const isImage = fileType.startsWith("image/");
  const isPdf = fileType === "application/pdf" || (file?.name ?? "").toLowerCase().endsWith(".pdf");
  const canPreviewFile = Boolean(fileUrl) && (isImage || isPdf);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-7 py-5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[19px] font-black text-slate-950">
              <FileText size={18} className="text-slate-400" />
              원문 전체 보기
            </h2>
            <p className="mt-1 truncate text-[13px] font-bold text-slate-500">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* 왼쪽: 원본 파일 미리보기 */}
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-slate-100 px-6 py-3 text-[12px] font-extrabold uppercase tracking-wide text-slate-400">
              원본 파일
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
              {!file ? (
                <PreviewFallback message="텍스트로 입력된 문서라 원본 파일이 없습니다." />
              ) : isImage && fileUrl ? (
                <img src={fileUrl} alt={title} className="mx-auto max-w-full rounded-lg shadow-sm" />
              ) : isPdf && fileUrl ? (
                <iframe src={fileUrl} title={title} className="h-[60vh] w-full rounded-lg border border-slate-200 bg-white" />
              ) : (
                <PreviewFallback
                  message="이 형식은 브라우저 미리보기를 지원하지 않습니다. 오른쪽에서 추출된 텍스트를 확인하세요."
                  downloadUrl={fileUrl}
                  downloadName={file.name}
                />
              )}
            </div>
          </div>

          {/* 오른쪽: 추출된 원문 텍스트 */}
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-slate-100 px-6 py-3 text-[12px] font-extrabold uppercase tracking-wide text-slate-400">
              추출된 텍스트
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {fullText ? (
                <pre className="whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-slate-800">
                  {fullText}
                </pre>
              ) : (
                <p className="text-[14px] font-medium text-slate-400">원문 텍스트를 불러올 수 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewFallback({
  message,
  downloadUrl,
  downloadName,
}: {
  message: string;
  downloadUrl?: string | null;
  downloadName?: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <FileText size={40} className="text-slate-300" />
      <p className="max-w-[280px] text-[13px] font-semibold text-slate-500">{message}</p>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download={downloadName}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          파일 다운로드
        </a>
      )}
    </div>
  );
}

function buildTranslationText(translation: TranslationByLanguage) {
  const sectionText = [...translation.sections]
    .sort((first, second) => first.order - second.order)
    .map((section) => `${section.translated_label || section.source_label}\n${section.translated_text}`)
    .join("\n\n");

  return [translation.title, translation.summary, sectionText].filter(Boolean).join("\n\n");
}

function ResultSection({
  title,
  sourceLabel,
  sourceText,
  children,
}: {
  title: string;
  sourceLabel?: string;
  sourceText?: string;
  children: string;
}) {
  return (
    <div className="border-b border-slate-100 py-4">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-black text-slate-950">{title}</h4>
        {sourceLabel && (
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-500">
            원문: {sourceLabel}
          </span>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line">{children}</p>
      {sourceText && (
        <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-[12px] font-semibold leading-5 text-slate-500">
          {sourceText}
        </p>
      )}
    </div>
  );
}

function EditableResultSection({
  sourceLabel,
  sourceText,
  translatedLabel,
  translatedText,
  onLabelChange,
  onTextChange,
}: {
  title: string;
  sourceLabel?: string;
  sourceText?: string;
  translatedLabel: string;
  translatedText: string;
  onLabelChange: (value: string) => void;
  onTextChange: (value: string) => void;
}) {
  return (
    <div className="border-b border-slate-100 py-4">
      <div className="flex items-start justify-between gap-4">
        <label className="min-w-0 flex-1">
          <span className="text-[12px] font-black text-slate-500">섹션 제목</span>
          <input
            value={translatedLabel}
            onChange={(event) => onLabelChange(event.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-[15px] font-black text-slate-950 outline-none focus:border-violet-400"
          />
        </label>
        {sourceLabel && (
          <span className="mt-7 shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-500">
            원문: {sourceLabel}
          </span>
        )}
      </div>
      <label className="mt-3 block">
        <span className="text-[12px] font-black text-slate-500">번역 본문</span>
        <textarea
          value={translatedText}
          onChange={(event) => onTextChange(event.target.value)}
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-[15px] leading-7 text-slate-700 outline-none focus:border-violet-400"
        />
      </label>
      {sourceText && (
        <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-[12px] font-semibold leading-5 text-slate-500">
          {sourceText}
        </p>
      )}
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
