import { useState } from "react";
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

const channels = [
  { label: "모바일 앱 공지", icon: Smartphone, selected: true },
  { label: "홈페이지 안내", icon: Monitor, selected: true },
  { label: "영업점 게시문", icon: Layers, selected: true },
  { label: "SNS 카드뉴스", icon: Globe2, selected: false },
  { label: "배너", icon: FileText, selected: false },
];

const templates = [
  { title: "모바일 공지형", sub: "App Notice", selected: true },
  { title: "홈페이지 카드형", sub: "Web Card" },
  { title: "영업점 게시문형", sub: "Branch Poster" },
  { title: "SNS 카드뉴스형", sub: "SNS Card" },
  { title: "배너형", sub: "Banner" },
];

const copySlots = [
  ["메인 타이틀", "권장 20자 이내", "Stable savings with BNK", "21/24"],
  ["서브 문구", "권장 60자 이내", "Enjoy preferential rates and\nreliable deposit protection.", "58/60"],
  ["핵심 혜택", "권장 25자 이내", "Up to 0.50%p preferential rate", "31/40"],
  ["CTA 버튼 문구", "권장 15자 이내", "Learn more", "10/15"],
  ["법적 고지 문구", "권장 80자 이내", "Terms and conditions may apply.", "28/80"],
];

// 미리보기에 공통으로 쓰이는 게시 콘텐츠(현재는 목업 문안).
// 추후 4페이지의 실제 번역 결과로 교체하면 모든 템플릿에 자동 반영된다.
const previewContent = {
  brand: "BNK",
  title: "BNK Time Deposit",
  headline: "Stable savings with clear interest benefits.",
  sub: "Enjoy preferential rates and reliable deposit protection.",
  baseRateLabel: "Base Interest Rate",
  baseRate: "3.20%",
  baseRateNote: "p.a.",
  prefRateLabel: "Preferential Rate",
  prefRate: "Up to 0.50%p",
  cta: "Learn more",
};

const deviceOptions = [
  { id: "mobile", icon: Smartphone },
  { id: "tablet", icon: Tablet },
  { id: "pc", icon: Monitor },
] as const;

const previewTabs = ["홈페이지", "모바일 앱 공지", "영업점 게시문"];

export function StepFiveReport({ onBack, input, settings }: StepFiveReportProps) {
  // 레이아웃 보존 번역 PDF 다운로드 상태.
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // 레이아웃 보존 번역은 현재 PDF 원본만 지원(백엔드 프로토타입).
  const originalPdf =
    input?.mode === "file" &&
    input.file &&
    input.file.name.toLowerCase().endsWith(".pdf")
      ? input.file
      : null;
  // 대상 언어는 2페이지에서 고른 첫 번째 언어를 사용한다. (예: "베트남어 (Tiếng Việt)")
  const targetLanguages = settings?.targetLanguages ?? [];
  const targetLanguage = targetLanguages[0] ?? "영어 (English)";

  const downloadTranslatedPdf = async () => {
    if (!originalPdf || isDownloadingPdf) return;

    setIsDownloadingPdf(true);
    setDownloadError("");

    try {
      const formData = new FormData();
      formData.append("file", originalPdf);
      formData.append("target_language", targetLanguage);

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

  // 게시 채널: 다중 선택(토글)
  const [channelList, setChannelList] = useState(channels);
  const selectedChannelCount = channelList.filter((channel) => channel.selected).length;
  const toggleChannel = (label: string) =>
    setChannelList((prev) =>
      prev.map((channel) =>
        channel.label === label ? { ...channel, selected: !channel.selected } : channel
      )
    );

  // 디자인 템플릿: 단일 선택
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates.find((template) => template.selected)?.title ?? templates[0].title
  );

  // 미리보기 디바이스: 단일 선택
  const [device, setDevice] = useState<(typeof deviceOptions)[number]["id"]>("pc");

  // 미리보기 채널 탭: 단일 선택
  const [activeTab, setActiveTab] = useState(0);

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
          <MetricCard icon={Globe2} title="대상 언어" value={targetLanguage} color="blue" />
          <MetricCard icon={Layers} title="게시 채널" value="4개 선택" color="indigo" />
          <MetricCard icon={FileText} title="생성 문안" value="4종" color="slate" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[310px_1fr_430px]">
        <aside className="space-y-4">
          <Panel title="1 게시 채널 선택" trailing={<X size={16} className="text-slate-400" />}>
            <div className="space-y-4">
              {channelList.map((channel) => {
                const Icon = channel.icon;
                return (
                  <button
                    key={channel.label}
                    type="button"
                    onClick={() => toggleChannel(channel.label)}
                    className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-left transition hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-3 text-[15px] font-extrabold text-slate-950">
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded border",
                          channel.selected
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {channel.selected && <Check size={14} />}
                      </span>
                      {channel.label}
                    </span>
                    <Icon size={18} className="text-slate-500" />
                  </button>
                );
              })}
            </div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-right text-[13px] font-semibold text-slate-500">
              선택된 채널 {selectedChannelCount}/{channelList.length}
            </p>
          </Panel>

          <Panel title="2 디자인 템플릿 선택">
            <div className="space-y-2">
              {templates.map((template, index) => {
                const isSelected = selectedTemplate === template.title;
                return (
                  <button
                    key={template.title}
                    type="button"
                    onClick={() => setSelectedTemplate(template.title)}
                    className={[
                      "flex w-full items-center gap-4 rounded-lg border p-3 text-left transition",
                      isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                  >
                    <div className="h-14 w-14 rounded border border-slate-200 bg-gradient-to-br from-white to-red-50 shadow-sm">
                      <div className="m-2 h-2 rounded bg-red-500" />
                      <div className="mx-2 mt-2 h-2 rounded bg-slate-200" />
                      <div className="mx-2 mt-1 h-2 rounded bg-slate-200" />
                      {index === 0 && <div className="mx-2 mt-2 h-4 rounded bg-red-100" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-extrabold text-slate-950">{template.title}</p>
                      <p className="mt-1 text-[12px] font-medium text-slate-500">{template.sub}</p>
                    </div>
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        isSelected ? "border-red-600 bg-red-600 text-white" : "border-slate-300",
                      ].join(" ")}
                    >
                      {isSelected && <Check size={12} />}
                    </span>
                  </button>
                );
              })}
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

          <div className="flex gap-12 border-b border-slate-100 text-[14px] font-extrabold">
            {previewTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(index)}
                className={[
                  "px-1 pb-3 transition",
                  activeTab === index
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-slate-800 hover:text-slate-950",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          <TemplatePreview template={selectedTemplate} />

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
                { key: "image", title: "디자인 적용 이미지", sub: "(고해상도)" },
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
                      {item.loading ? "번역 PDF 생성 중..." : item.sub}
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

function TemplatePreview({ template }: { template: string }) {
  const layouts: Record<string, { spec: string; node: React.ReactNode }> = {
    "모바일 공지형": { spec: "1080 × 1920 · 모바일 화면", node: <MobileNoticePreview /> },
    "홈페이지 카드형": { spec: "1200 × 628 · 웹 카드", node: <WebCardPreview /> },
    "영업점 게시문형": { spec: "595 × 842 · A4 포스터", node: <BranchPosterPreview /> },
    "SNS 카드뉴스형": { spec: "1080 × 1080 · 정사각형", node: <SnsCardPreview /> },
    "배너형": { spec: "1200 × 300 · 가로 배너", node: <BannerPreview /> },
  };

  const layout = layouts[template] ?? layouts["모바일 공지형"];

  return (
    <div className="mt-6">
      <p className="mb-4 text-center text-[12px] font-extrabold uppercase tracking-wide text-slate-400">
        {template} · {layout.spec}
      </p>
      {layout.node}
    </div>
  );
}

// 두 개의 금리 수치 박스(템플릿 간 공유)
function RateGrid({ compact }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg bg-white/90 text-center shadow-sm">
      <div className={compact ? "p-3" : "p-5"}>
        <p className="text-[13px] font-semibold text-[#061b3a]">{previewContent.baseRateLabel}</p>
        <p className={`mt-2 font-black text-[#061b3a] ${compact ? "text-[22px]" : "text-[29px]"}`}>
          {previewContent.baseRate}
        </p>
        <p className="text-[13px] font-bold text-[#061b3a]">{previewContent.baseRateNote}</p>
      </div>
      <div className={`border-l border-slate-100 ${compact ? "p-3" : "p-5"}`}>
        <p className="text-[13px] font-semibold text-[#061b3a]">{previewContent.prefRateLabel}</p>
        <p className={`mt-2 font-black text-[#061b3a] ${compact ? "text-[22px]" : "text-[29px]"}`}>
          {previewContent.prefRate}
        </p>
      </div>
    </div>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <button className={`flex items-center justify-center gap-2 rounded-lg bg-red-600 font-extrabold text-white ${className}`}>
      {previewContent.cta}
      <span>›</span>
    </button>
  );
}

// 1) 모바일 공지형 — 세로 폰 화면
function MobileNoticePreview() {
  return (
    <div className="relative mx-auto max-w-[520px] rounded-[48px] border-[7px] border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
      <div className="absolute left-1/2 top-0 h-7 w-52 -translate-x-1/2 rounded-b-3xl bg-slate-200" />
      <div className="mb-5 flex items-center justify-between pt-4 text-[14px] font-bold text-slate-950">
        <span>9:41</span>
        <span className="text-[12px]">●●▰</span>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-100 p-8">
        <div className="flex items-center justify-between">
          <div className="text-[30px] font-black tracking-[-0.04em] text-red-600">{previewContent.brand}</div>
          <span className="text-slate-600">♧</span>
        </div>
        <h3 className="mt-8 text-[27px] font-black leading-tight tracking-tight text-[#061b3a]">
          {previewContent.title}
        </h3>
        <p className="mt-3 text-[18px] font-bold leading-tight text-[#061b3a]">{previewContent.headline}</p>
        <p className="mt-5 text-[16px] font-medium leading-6 text-[#061b3a]">{previewContent.sub}</p>
        <div className="mt-8">
          <RateGrid />
        </div>
        <CtaButton className="mt-4 h-12 w-full text-[16px]" />
      </div>
    </div>
  );
}

// 2) 홈페이지 카드형 — 가로 웹 카드(브라우저 창)
function WebCardPreview() {
  return (
    <div className="mx-auto max-w-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-[12px] font-semibold text-slate-400">
          www.bnk.co.kr/deposit
        </span>
      </div>
      <div className="grid grid-cols-2 items-center gap-6 bg-gradient-to-br from-red-50 via-white to-red-100 p-8">
        <div>
          <div className="text-[26px] font-black tracking-[-0.04em] text-red-600">{previewContent.brand}</div>
          <h3 className="mt-4 text-[24px] font-black leading-tight tracking-tight text-[#061b3a]">
            {previewContent.title}
          </h3>
          <p className="mt-3 text-[15px] font-medium leading-6 text-[#061b3a]">{previewContent.sub}</p>
          <CtaButton className="mt-6 h-11 w-44 text-[15px]" />
        </div>
        <RateGrid />
      </div>
    </div>
  );
}

// 3) 영업점 게시문형 — 세로 A4 포스터
function BranchPosterPreview() {
  return (
    <div className="mx-auto max-w-[460px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between bg-red-600 px-8 py-5 text-white">
        <span className="text-[26px] font-black tracking-[-0.04em]">{previewContent.brand}</span>
        <span className="text-[13px] font-bold opacity-90">상품 안내문</span>
      </div>
      <div className="px-9 py-8 text-center">
        <h3 className="text-[28px] font-black leading-tight tracking-tight text-[#061b3a]">
          {previewContent.title}
        </h3>
        <p className="mt-3 text-[18px] font-bold text-[#061b3a]">{previewContent.headline}</p>
        <p className="mx-auto mt-4 max-w-[320px] text-[15px] font-medium leading-6 text-slate-600">
          {previewContent.sub}
        </p>
        <div className="mt-8">
          <RateGrid />
        </div>
        <CtaButton className="mx-auto mt-8 h-12 w-56 text-[16px]" />
        <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-400">
          ※ 예금자보호법에 따라 1인당 5천만원까지 보호됩니다.
        </p>
      </div>
    </div>
  );
}

// 4) SNS 카드뉴스형 — 정사각형
function SnsCardPreview() {
  return (
    <div className="mx-auto flex aspect-square max-w-[460px] flex-col justify-between rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-9 text-white shadow-[0_20px_45px_rgba(220,0,0,0.25)]">
      <div className="text-[28px] font-black tracking-[-0.04em]">{previewContent.brand}</div>
      <div>
        <h3 className="text-[30px] font-black leading-tight tracking-tight">{previewContent.title}</h3>
        <p className="mt-3 text-[17px] font-bold leading-snug opacity-95">{previewContent.headline}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[13px] font-semibold opacity-80">{previewContent.baseRateLabel}</p>
          <p className="text-[34px] font-black leading-none">{previewContent.baseRate}</p>
        </div>
        <span className="rounded-full bg-white px-5 py-2 text-[14px] font-extrabold text-red-600">
          {previewContent.cta}
        </span>
      </div>
    </div>
  );
}

// 5) 배너형 — 가로 띠배너
function BannerPreview() {
  return (
    <div className="mx-auto flex max-w-[680px] items-center justify-between gap-6 rounded-xl bg-gradient-to-r from-[#061b3a] via-[#0a2a5e] to-red-700 px-8 py-6 text-white shadow-[0_20px_45px_rgba(15,23,42,0.2)]">
      <div className="min-w-0">
        <div className="text-[20px] font-black tracking-[-0.04em] text-red-300">{previewContent.brand}</div>
        <h3 className="mt-1 truncate text-[22px] font-black tracking-tight">{previewContent.title}</h3>
        <p className="mt-1 text-[14px] font-medium opacity-85">{previewContent.headline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-5">
        <div className="text-right">
          <p className="text-[12px] font-semibold opacity-75">{previewContent.baseRateLabel}</p>
          <p className="text-[28px] font-black leading-none">{previewContent.baseRate}</p>
        </div>
        <CtaButton className="h-11 w-32 text-[15px]" />
      </div>
    </div>
  );
}

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
