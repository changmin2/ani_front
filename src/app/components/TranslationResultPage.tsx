import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  ChevronLeft,
  FileText,
  Megaphone,
  BookOpen,
  Languages,
  RotateCcw,
} from "lucide-react";
import { LANGUAGES, type LanguageCode } from "./ContentEditor";

interface ResultState {
  text: string;
  files: { id: string; name: string; size: number; type: string }[];
  languages: LanguageCode[];
  source: "customer-notice" | "marketing-content" | "product-manual";
  result?: any;
}

const MOCK_TRANSLATIONS: Record<LanguageCode, (original: string) => string> = {
  en: (t) =>
    t
      ? `[English Translation]\n\nDear valued customer,\n\nThank you for using our services. Please find the translated content below.\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line} (translated)` : line))
          .join("\n")
      : "",
  ja: (t) =>
    t
      ? `[日本語翻訳]\n\nお客様へ\n\nいつもご利用いただきありがとうございます。\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line}（翻訳済み）` : line))
          .join("\n")
      : "",
  vi: (t) =>
    t
      ? `[Bản dịch tiếng Việt]\n\nKính gửi Quý khách hàng,\n\nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi.\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line} (đã dịch)` : line))
          .join("\n")
      : "",
  es: (t) =>
    t
      ? `[Traducción al Español]\n\nEstimado cliente,\n\nGracias por usar nuestros servicios.\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line} (traducido)` : line))
          .join("\n")
      : "",
  zh: (t) =>
    t
      ? `[中文翻译]\n\n尊敬的客户，\n\n感谢您使用我们的服务。\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line}（已翻译）` : line))
          .join("\n")
      : "",
  id: (t) =>
    t
      ? `[Terjemahan Bahasa Indonesia]\n\nKepada Pelanggan yang terhormat,\n\nTerima kasih telah menggunakan layanan kami.\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line} (diterjemahkan)` : line))
          .join("\n")
      : "",
  th: (t) =>
    t
      ? `[การแปลภาษาไทย]\n\nเรียนลูกค้าที่เคารพ\n\nขอบคุณที่ใช้บริการของเรา\n\n` +
        t
          .split("\n")
          .map((line) => (line.trim() ? `${line} (แปลแล้ว)` : line))
          .join("\n")
      : "",
};

const SOURCE_META = {
  "customer-notice": {
    label: "고객안내문",
    icon: FileText,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "marketing-content": {
    label: "마케팅 콘텐츠",
    icon: Megaphone,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "product-manual": {
    label: "상품설명서",
    icon: BookOpen,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
    >
      {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

export function TranslationResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState | null;

  const [activeTab, setActiveTab] = useState<"side-by-side" | "tab">("side-by-side");
  const [selectedLang, setSelectedLang] = useState<LanguageCode | null>(
    state?.languages?.[0] ?? null
  );

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <Languages size={40} className="text-muted-foreground mb-4" />
        <p className="text-foreground font-medium mb-2">번역 결과가 없습니다.</p>
        <p className="text-muted-foreground text-sm mb-6">먼저 콘텐츠를 작성하고 번역을 요청하세요.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const meta = SOURCE_META[state.source] ?? SOURCE_META["customer-notice"];
  const Icon = meta.icon;
  const translatedLangs = LANGUAGES.filter((l) => state.languages.includes(l.code));

  const originalText =
    state.text ||
    (state.files.length > 0 ? `[파일 업로드: ${state.files.map((f) => f.name).join(", ")}]\n\n파일 내용이 여기에 표시됩니다.` : "");

  const getTranslation = (lang: LanguageCode) => {
    if (!state?.result) return "";

    const textResult = state.result.find(
      (item: any) => item.type === "text"
    );

    return (
      textResult?.result?.translations?.[lang]?.final_translation ?? ""
    );    
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            돌아가기
          </button>
          <span className="text-border">|</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${meta.bg} ${meta.color}`}>
            <Icon size={15} />
            <span className="text-sm font-medium">{meta.label}</span>
          </div>
          <span className="text-muted-foreground text-sm">번역 결과</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-secondary border border-border rounded-xl overflow-hidden text-sm">
            <button
              onClick={() => setActiveTab("side-by-side")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "side-by-side"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              나란히 보기
            </button>
            <button
              onClick={() => setActiveTab("tab")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "tab"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              탭으로 보기
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-border bg-card px-4 py-2 rounded-xl hover:bg-secondary transition-colors">
            <Download size={14} />
            전체 다운로드
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "원본 언어", value: "한국어 🇰🇷" },
          { label: "번역 언어 수", value: `${state.languages.length}개` },
          { label: "원본 글자 수", value: `${originalText.length.toLocaleString()}자` },
          { label: "첨부 파일", value: `${state.files.length}개` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-muted-foreground text-xs mb-0.5">{s.label}</p>
            <p className="text-foreground font-semibold text-sm">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Language selector (tab view) */}
      {activeTab === "tab" && (
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setSelectedLang(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              selectedLang === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🇰🇷 원본 (한국어)
          </button>
          {translatedLangs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                selectedLang === lang.code
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab view */}
      {activeTab === "tab" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary">
            <span className="text-sm font-medium text-foreground">
              {selectedLang === null
                ? "🇰🇷 원본 (한국어)"
                : `${translatedLangs.find((l) => l.code === selectedLang)?.flag} ${
                    translatedLangs.find((l) => l.code === selectedLang)?.label
                  } 번역본`}
            </span>
            <div className="flex items-center gap-2">
              <CopyButton
                text={
                  selectedLang === null
                      ? originalText
                      : getTranslation(selectedLang)
                }
              />
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-card">
                <Download size={13} />
                다운로드
              </button>
            </div>
          </div>
          <pre className="px-5 py-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans min-h-64">
            {selectedLang === null
                ? originalText || "원본 내용이 없습니다."
                : getTranslation(selectedLang) || "번역 내용이 없습니다."}
          </pre>
        </div>
      )}

      {/* Side by side view */}
      {activeTab === "side-by-side" && (
        <div className="flex flex-col gap-6">
          {/* Original always on top */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary">
              <div className="flex items-center gap-2">
                <span className="text-base">🇰🇷</span>
                <span className="text-sm font-medium text-foreground">원본 (한국어)</span>
              </div>
              <CopyButton text={originalText} />
            </div>
            <pre className="px-5 py-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
              {originalText || "원본 내용이 없습니다."}
            </pre>
          </div>

          {/* Translations grid */}
          <div
            className={`grid gap-4 ${
              translatedLangs.length === 1
                ? "grid-cols-1"
                : translatedLangs.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {translatedLangs.map((lang) => {
              const translated = getTranslation(lang.code);
              return (
                <div
                  key={lang.code}
                  className={`bg-card border rounded-2xl overflow-hidden ${meta.border}`}
                >
                  <div className={`flex items-center justify-between px-5 py-3.5 border-b ${meta.border} ${meta.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <span className={`text-sm font-medium ${meta.color}`}>{lang.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{lang.native}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <CopyButton text={translated} />
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-card">
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                  <pre className="px-5 py-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto">
                    {translated || "번역 내용이 없습니다."}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm border border-border bg-card px-5 py-2.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <RotateCcw size={14} />
          다시 번역하기
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
