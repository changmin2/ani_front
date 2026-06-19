import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  Globe2,
  Info,
  Layers,
  LoaderCircle,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { getApiBaseUrl } from "../../../api";
import type { FlowExecutionSettings, FlowInput } from "../types";

const API_BASE_URL = getApiBaseUrl();

type StepFiveReportProps = {
  onBack: () => void;
  input: FlowInput | null;
  settings: FlowExecutionSettings | null;
};

// 게시 채널 = 출력 규격(1:1). 채널을 고르면 실제 PDF 첫 페이지를 이 width×height 캔버스에
// 비율 유지로 맞춰(여백 흰색) 변환해 보여준다.
const CHANNELS = [
  { key: "web", channelLabel: "홈페이지", icon: Monitor, dimension: "1080 × 1920", width: 1080, height: 1920 },
  { key: "mobile", channelLabel: "모바일 앱 공지", icon: Smartphone, dimension: "1080 × 1920", width: 1080, height: 1920 },
  { key: "branch", channelLabel: "영업점 게시문", icon: Layers, dimension: "A4 1240 × 1754", width: 1240, height: 1754 },
  { key: "sns", channelLabel: "SNS 카드뉴스", icon: Globe2, dimension: "1080 × 1080", width: 1080, height: 1080 },
  { key: "banner", channelLabel: "배너", icon: FileText, dimension: "1200 × 300", width: 1200, height: 300 },
] as const;

type ChannelKey = (typeof CHANNELS)[number]["key"];

const DEFAULT_SELECTED_KEYS: ChannelKey[] = ["web", "mobile", "branch"];

const copySlots = [
  ["메인 타이틀", "권장 20자 이내", "Stable savings with BNK", "21/24"],
  ["서브 문구", "권장 60자 이내", "Enjoy preferential rates and\nreliable deposit protection.", "58/60"],
  ["핵심 혜택", "권장 25자 이내", "Up to 0.50%p preferential rate", "31/40"],
  ["CTA 버튼 문구", "권장 15자 이내", "Learn more", "10/15"],
  ["법적 고지 문구", "권장 80자 이내", "Terms and conditions may apply.", "28/80"],
];

const deviceOptions = [
  { id: "mobile", icon: Smartphone },
  { id: "tablet", icon: Tablet },
  { id: "pc", icon: Monitor },
] as const;

export function StepFiveReport({ onBack, input, settings }: StepFiveReportProps) {
  // 레이아웃 보존 번역 PDF 다운로드 상태.
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // 레이아웃 보존 번역은 현재 PDF 원본만 지원(백엔드 프로토타입).
  const originalPdf =
    input?.mode === "file" &&
    input.file &&
    input.file.name.toLowerCase().endsWith(".pdf")
      ? input.file
      : null;
  // 2페이지에서 고른 대상 언어들. 미리보기/다운로드는 사용자가 선택한 언어를 따른다.
  const targetLanguages = settings?.targetLanguages ?? [];
  const [previewLanguage, setPreviewLanguage] = useState(
    targetLanguages[0] ?? "영어 (English)"
  );

  const downloadTranslatedPdf = async () => {
    if (!originalPdf || isDownloadingPdf) return;

    setIsDownloadingPdf(true);
    setDownloadError("");

    try {
      const formData = new FormData();
      formData.append("file", originalPdf);
      formData.append("target_language", previewLanguage);

      const response = await fetch(`${API_BASE_URL}/documents/translate-layout`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.detail || "번역 PDF 생성에 실패했습니다.");
      }

      // 응답 PDF(blob)를 받아 브라우저 다운로드를 트리거한다.
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `translated_${originalPdf.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "다운로드 중 오류가 발생했습니다."
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // 1번 게시 채널: 다중 선택. 채널 = 출력 규격(1:1).
  const [selectedKeys, setSelectedKeys] = useState<ChannelKey[]>(DEFAULT_SELECTED_KEYS);
  // 미리보기 중인 채널(2번 강조 + 3번 미리보기 대상).
  const [activeKey, setActiveKey] = useState<ChannelKey>(DEFAULT_SELECTED_KEYS[0]);
  // 미리보기 디바이스: 단일 선택
  const [device, setDevice] = useState<(typeof deviceOptions)[number]["id"]>("pc");

  // CHANNELS 순서를 유지하며 선택된 채널만 추린다.
  const selectedChannels = CHANNELS.filter((channel) => selectedKeys.includes(channel.key));
  const activeChannel = CHANNELS.find((channel) => channel.key === activeKey) ?? CHANNELS[0];

  // 실제 PDF 첫 페이지를 활성 채널 규격으로 변환한 PNG. (채널+언어)별 캐싱.
  const [pdfPreviewCache, setPdfPreviewCache] = useState<Record<string, string>>({});
  const [isLoadingPdfPreview, setIsLoadingPdfPreview] = useState(false);
  const [pdfPreviewError, setPdfPreviewError] = useState("");
  const previewCacheKey = `${activeKey}|${previewLanguage}`;
  const pdfPreviewUrl = pdfPreviewCache[previewCacheKey] ?? null;

  const pdfPreviewCacheRef = useRef(pdfPreviewCache);
  pdfPreviewCacheRef.current = pdfPreviewCache;
  useEffect(() => {
    return () => {
      Object.values(pdfPreviewCacheRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!originalPdf) return;
    if (pdfPreviewCache[previewCacheKey]) {
      setPdfPreviewError("");
      return;
    }

    const controller = new AbortController();

    async function loadPdfPreview() {
      setIsLoadingPdfPreview(true);
      setPdfPreviewError("");

      try {
        const formData = new FormData();
        formData.append("file", originalPdf!);
        formData.append("target_language", previewLanguage);
        // 활성 채널 규격(width×height)에 맞춰 변환(여백 fit).
        formData.append("width", String(activeChannel.width));
        formData.append("height", String(activeChannel.height));

        const response = await fetch(`${API_BASE_URL}/documents/translate-layout/preview`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.detail || "미리보기 생성에 실패했습니다.");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPdfPreviewCache((prev) => ({ ...prev, [previewCacheKey]: objectUrl }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPdfPreviewError(
          error instanceof Error ? error.message : "미리보기 중 오류가 발생했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingPdfPreview(false);
        }
      }
    }

    loadPdfPreview();

    return () => controller.abort();
  }, [originalPdf, previewLanguage, activeChannel.width, activeChannel.height, previewCacheKey, pdfPreviewCache]);

  const toggleChannel = (key: ChannelKey) => {
    setSelectedKeys((prev) => {
      const next = prev.includes(key)
        ? prev.filter((selected) => selected !== key)
        : [...prev, key];

      // 활성 항목이 해제되면 남은 선택 중 첫 번째로 활성 키를 옮긴다.
      if (!next.includes(activeKey)) {
        const fallback = CHANNELS.find((channel) => next.includes(channel.key));
        if (fallback) setActiveKey(fallback.key);
      }

      return next;
    });
  };

  // PDF 전체 페이지를 선택 채널 규격으로 변환해 세로로 이어붙인 PNG 한 장으로 다운로드.
  const downloadDesignImage = async () => {
    if (!originalPdf || isDownloadingImage) return;

    setIsDownloadingImage(true);
    setDownloadError("");

    try {
      const formData = new FormData();
      formData.append("file", originalPdf);
      formData.append("target_language", previewLanguage);
      formData.append("width", String(activeChannel.width));
      formData.append("height", String(activeChannel.height));

      const response = await fetch(`${API_BASE_URL}/documents/translate-layout/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.detail || "이미지 생성에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeChannel.channelLabel}_${previewLanguage.split(" ")[0]}_${activeChannel.width}x${activeChannel.height}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "이미지 다운로드 중 오류가 발생했습니다."
      );
    } finally {
      setIsDownloadingImage(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1480px] px-8 py-6">
      <div className="flex items-start justify-between gap-8">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-slate-950">
            게시 콘텐츠를 생성하세요
          </h1>
          <p className="mt-4 text-[16px] font-medium text-slate-600">
            검토 완료된 번역문을 게시 채널과 디자인 템플릿에 맞춰 자동 적용합니다.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard icon={CheckCircle2} title="검토 완료" value="" color="emerald" />
          <MetricCard icon={Globe2} title="대상 언어" value={previewLanguage} color="blue" />
          <MetricCard icon={Layers} title="게시 채널" value={`${selectedKeys.length}개 선택`} color="indigo" />
          <MetricCard icon={FileText} title="생성 문안" value="4종" color="slate" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[310px_1fr_430px]">
        <aside className="space-y-4">
          <Panel title="1 게시 채널 선택" trailing={<X size={16} className="text-slate-400" />}>
            <div className="space-y-4">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedKeys.includes(channel.key);
                return (
                  <button
                    key={channel.key}
                    type="button"
                    onClick={() => toggleChannel(channel.key)}
                    className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-3 text-[15px] font-extrabold text-slate-950">
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded border",
                          isSelected
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {isSelected && <Check size={14} />}
                      </span>
                      {channel.channelLabel}
                    </span>
                    <Icon size={18} className="text-slate-500" />
                  </button>
                );
              })}
            </div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-right text-[13px] font-semibold text-slate-500">
              선택된 채널 {selectedKeys.length}/{CHANNELS.length}
            </p>
          </Panel>

          <Panel title="2 디자인 규격 선택">
            <div className="space-y-2">
              {selectedChannels.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-400">
                  먼저 게시 채널을 선택하세요.
                </p>
              ) : (
                selectedChannels.map((channel) => {
                  const isActive = activeKey === channel.key;
                  const Icon = channel.icon;
                  return (
                    <button
                      key={channel.key}
                      type="button"
                      onClick={() => setActiveKey(channel.key)}
                      className={[
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                        isActive
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          isActive ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-extrabold text-slate-950">
                          {channel.channelLabel}
                        </span>
                        <span className="block text-[12px] font-medium text-slate-500">
                          {channel.dimension}
                        </span>
                      </span>
                      {isActive && (
                        <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                          미리보기 중
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </Panel>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[18px] font-black text-slate-950">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[13px] text-white">
                3
              </span>
              디자인 적용 미리보기
              <Info size={16} className="text-slate-400" />
            </h2>
            <div className="flex rounded-lg border border-slate-200 p-1">
              {deviceOptions.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  className={[
                    "rounded-md p-2 transition",
                    device === id
                      ? "border border-red-500 bg-red-50 text-red-600"
                      : "text-slate-500 hover:text-slate-700",
                  ].join(" ")}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {targetLanguages.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-1.5 text-[13px] font-extrabold text-slate-500">
                <Globe2 size={15} />
                번역 언어
              </span>
              {targetLanguages.map((language) => {
                const isActive = previewLanguage === language;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => setPreviewLanguage(language)}
                    title={language}
                    className={[
                      "rounded-full border px-4 py-1.5 text-[13px] font-extrabold transition",
                      isActive
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {language.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6">
            {selectedChannels.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <Layers size={36} className="text-slate-300" />
                <p className="max-w-[320px] text-[14px] font-semibold text-slate-500">
                  게시 채널을 선택하면 규격별 미리보기가 표시됩니다.
                </p>
              </div>
            ) : !originalPdf ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <FileText size={36} className="text-slate-300" />
                <p className="max-w-[340px] text-[14px] font-semibold text-slate-500">
                  규격별 미리보기는 PDF 원본을 업로드한 경우에만 지원됩니다.
                </p>
              </div>
            ) : isLoadingPdfPreview && !pdfPreviewUrl ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                <LoaderCircle size={32} className="animate-spin text-red-500" />
                <p className="text-[14px] font-bold text-slate-600">미리보기를 생성하고 있습니다...</p>
                <p className="text-[12px] font-medium text-slate-400">
                  {activeChannel.channelLabel} 규격에 {previewLanguage.split(" ")[0]} 번역 적용 중
                </p>
              </div>
            ) : pdfPreviewError ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-6 py-16 text-center">
                <p className="text-[14px] font-bold text-red-600">{pdfPreviewError}</p>
              </div>
            ) : pdfPreviewUrl ? (
              <div>
                <p className="mb-4 text-center text-[12px] font-extrabold uppercase tracking-wide text-slate-400">
                  {activeChannel.channelLabel} · {activeChannel.dimension} · {previewLanguage.split(" ")[0]} 번역 적용
                </p>
                {activeKey === "mobile" ? (
                  // 모바일 채널은 폰 프레임으로 감싸 휴대폰 느낌을 준다.
                  <div className="relative mx-auto w-full max-w-[320px] rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-[0_24px_50px_rgba(15,23,42,0.3)]">
                    <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
                    <img
                      src={pdfPreviewUrl}
                      alt={`${activeChannel.channelLabel} 규격 미리보기`}
                      className="block w-full rounded-[34px] bg-white"
                    />
                  </div>
                ) : (
                  <img
                    src={pdfPreviewUrl}
                    alt={`${activeChannel.channelLabel} 규격 미리보기`}
                    className="mx-auto max-w-full rounded-lg border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.15)]"
                  />
                )}
              </div>
            ) : null}
          </div>

          <div className="relative -mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-950">레이아웃 적합성 검수 결과</h3>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-extrabold text-slate-700">
                전체 검수 리포트 보기
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <FitRow status="정상" text="제목 길이가 권장 범위(20자 이내)에 적합합니다." />
              <FitRow status="정상" text="CTA 문구가 버튼 영역에 적합합니다." />
              <FitRow status="주의" text="본문 문장이 다소 길어 모바일 화면에서 2줄 이상 표시될 수 있습니다." warning />
            </div>
          </div>
        </main>

        <aside className="space-y-4">
          <Panel title="4 템플릿 슬롯 문안" action="전체 수정">
            <div className="space-y-3">
              {copySlots.map(([label, hint, value, count]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[13px] font-extrabold text-slate-950">
                      {label} <span className="font-medium text-slate-500">({hint})</span>
                    </p>
                    <span className="text-[12px] font-semibold text-slate-500">{count}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_64px] gap-3">
                    <div className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-[14px] font-medium leading-5 text-slate-700">
                      {value}
                    </div>
                    <button className="rounded-lg border border-slate-200 text-[13px] font-extrabold text-slate-700">
                      수정
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="5 최종 산출물 및 다운로드">
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  key: "translation",
                  title: "번역 결과",
                  sub: "(원본 레이아웃 유지 PDF)",
                  onClick: downloadTranslatedPdf,
                  disabled: !originalPdf,
                  loading: isDownloadingPdf,
                },
                { key: "report", title: "검수 리포트", sub: "(AI 검수 요약)" },
                { key: "copy", title: "게시 문안", sub: "(선택 채널)" },
                {
                  key: "image",
                  title: "디자인 적용 이미지",
                  sub: `(${activeChannel.channelLabel} 규격 · 전체 페이지 PNG)`,
                  onClick: downloadDesignImage,
                  disabled: !originalPdf,
                  loading: isDownloadingImage,
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  disabled={item.disabled || item.loading}
                  className="flex h-14 items-center gap-3 rounded-lg border border-slate-200 px-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.loading ? (
                    <LoaderCircle size={18} className="animate-spin text-slate-500" />
                  ) : (
                    <Download size={18} className="text-slate-500" />
                  )}
                  <span>
                    <span className="block text-[13px] font-extrabold text-slate-950">{item.title}</span>
                    <span className="block text-[12px] font-medium text-slate-500">
                      {item.loading ? "생성 중..." : item.sub}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {downloadError && (
              <p className="mt-2 text-[12px] font-bold text-red-600">{downloadError}</p>
            )}
            {!originalPdf && (
              <p className="mt-2 text-[12px] font-medium text-slate-400">
                ※ 「번역 결과」 PDF 다운로드는 PDF 원본을 업로드한 경우에만 지원됩니다.
              </p>
            )}

            <div className="mt-5">
              <p className="mb-3 flex items-center gap-2 text-[15px] font-black text-slate-950">
                승인 번역 자산 저장
                <Info size={15} className="text-slate-400" />
              </p>
              {["최종 번역문 저장", "게시 채널 문안 저장", "금융용어 매칭 결과 저장"].map((item) => (
                <label key={item} className="mb-2 flex items-center gap-2 text-[14px] font-extrabold text-slate-950">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-red-600 text-white">
                    <Check size={11} />
                  </span>
                  {item}
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <Save size={34} />
              </div>
            </div>
            <button className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-red-600 text-[16px] font-extrabold text-white shadow-[0_8px_18px_rgba(220,0,0,0.2)]">
              <Download size={20} />
              최종 리포트 생성 및 자산 저장
            </button>
          </Panel>
        </aside>
      </div>

      <div className="mt-4 flex min-h-16 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
        <button
          onClick={onBack}
          className="flex h-12 min-w-36 items-center justify-center gap-3 rounded-lg border border-slate-200 text-[16px] font-extrabold text-slate-950 hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
          이전으로
        </button>
        <p className="hidden items-center gap-3 text-[15px] font-semibold text-slate-600 md:flex">
          <ShieldCheck size={19} />
          생성된 콘텐츠는 내부 보안 정책에 따라 안전하게 저장되며, 승인 번역 자산으로 관리됩니다.
        </p>
      </div>
    </div>
  );
}

// 두 개의 금리 수치 박스(템플릿 간 공유)
function Panel({
  title,
  children,
  trailing,
  action,
}: {
  title: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  action?: string;
}) {
  const [num, ...rest] = title.split(" ");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[16px] font-black text-slate-950">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[13px] text-white">
            {num}
          </span>
          {rest.join(" ")}
          <Info size={15} className="text-slate-400" />
        </h2>
        {action ? (
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-extrabold text-slate-700">
            {action}
          </button>
        ) : (
          trailing
        )}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  color: "emerald" | "blue" | "indigo" | "slate";
}) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="flex h-14 min-w-32 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors[color]}`}>
        <Icon size={19} />
      </div>
      <div>
        <p className={`text-[13px] font-black ${colors[color].split(" ")[1]}`}>{title}</p>
        {value && <p className="text-[14px] font-black text-slate-950">{value}</p>}
      </div>
    </div>
  );
}

function FitRow({
  status,
  text,
  warning,
}: {
  status: string;
  text: string;
  warning?: boolean;
}) {
  return (
    <div className="grid grid-cols-[70px_1fr] items-center rounded-lg bg-slate-50 px-4 py-3">
      <span
        className={[
          "flex items-center gap-2 font-extrabold",
          warning ? "text-amber-600" : "text-emerald-600",
        ].join(" ")}
      >
        {warning ? "▲" : "●"} {status}
      </span>
      <span className="font-medium text-slate-600">{text}</span>
    </div>
  );
}
