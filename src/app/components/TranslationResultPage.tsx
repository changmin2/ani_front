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
  Maximize2,
  X,
} from "lucide-react";
import { LANGUAGES, type LanguageCode } from "./ContentEditor";

type Source = "customer-notice" | "marketing-content" | "product-manual";

type FileInfo = {
  id: string;
  name: string;
  size: number;
  type: string;
};

type OcrText = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  polygon?: { x: number; y: number }[];
  translations?: Record<string, string>;
};

type OcrResult = {
  file_name: string;
  width: number;
  height: number;
  texts: OcrText[];
  translated_images?: Record<string, string>;
};

type ImageInfo = {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  ocr?: OcrResult;
};

type TextResultState = {
  type?: "text";
  text: string;
  files: FileInfo[];
  languages: LanguageCode[];
  source: Source;
  result?: any;
};

type ImageResultState = {
  type: "image";
  images: ImageInfo[];
  languages: LanguageCode[];
  source: Source;
  result?: any;
};

type ResultState = TextResultState | ImageResultState;

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

function OcrOverlayImage({ image }: { image: ImageInfo }) {
  const ocr = image.ocr;
  const texts = ocr?.texts ?? [];
  const imageWidth = ocr?.width || 1;
  const imageHeight = ocr?.height || 1;

  return (
    <div className="relative w-full bg-secondary flex justify-center overflow-hidden">
      <div className="relative inline-block">
        <img
          src={image.dataUrl}
          alt={image.name}
          className="max-w-full max-h-80 object-contain"
        />

        {texts.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {texts.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className="absolute border-2 border-dashed border-amber-400 rounded-sm"
                style={{
                  left: `${(item.x / imageWidth) * 100}%`,
                  top: `${(item.y / imageHeight) * 100}%`,
                  width: `${(item.width / imageWidth) * 100}%`,
                  height: `${(item.height / imageHeight) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OriginalImageCard({
  image,
  onExpand,
}: {
  image: ImageInfo;
  onExpand: () => void;
}) {
  const texts = image.ocr?.texts ?? [];

  return (
    <div className="bg-card border rounded-2xl overflow-hidden border-border">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary border-border">
        <div>
          <p className="text-sm font-medium text-foreground">🇰🇷 원본</p>
          <p className="text-xs text-muted-foreground">Korean</p>
        </div>

        <button
          onClick={onExpand}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      <OcrOverlayImage image={image} />

      <div className="px-4 py-3 border-t border-border bg-secondary">
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          감지된 텍스트 ({texts.length}개)
        </p>

        {texts.length > 0 ? (
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {texts.map((item, index) => (
              <p key={`${item.text}-${index}`} className="text-xs text-foreground">
                • {item.text}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            감지된 텍스트가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

function TranslatedImageCard({
  image,
  lang,
  accentColor,
  accentBg,
  accentBorder,
  onExpand,
}: {
  image: ImageInfo;
  lang: {
    code: LanguageCode;
    label: string;
    native: string;
    flag: string;
  };
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  onExpand: (src: string, label: string) => void;
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  const translatedImage = image.ocr?.translated_images?.[lang.code];
  const imageSrc = showOriginal || !translatedImage ? image.dataUrl : translatedImage;

  const translatedTexts =
    image.ocr?.texts?.map((item) => ({
      original: item.text,
      translated: item.translations?.[lang.code] ?? "번역 결과 없음",
    })) ?? [];

  const copyText = translatedTexts
    .map((item) => `${item.original}\n→ ${item.translated}`)
    .join("\n\n");

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${accentBorder}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${accentBg} ${accentBorder}`}>
        <div className="flex items-center gap-2">
          <span>{lang.flag}</span>
          <div>
            <p className={`text-sm font-medium ${accentColor}`}>{lang.label}</p>
            <p className="text-xs text-muted-foreground">{lang.native}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowOriginal((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-card transition-colors"
          >
            {showOriginal ? "번역 보기" : "원본 보기"}
          </button>

          <button
            onClick={() =>
              onExpand(
                imageSrc,
                showOriginal ? "원본 이미지" : `${lang.flag} ${lang.label} 번역 이미지`
              )
            }
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      <div className="relative w-full bg-secondary flex justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={`${lang.label} 번역 이미지`}
          className="max-w-full max-h-80 object-contain"
        />
      </div>

      {!translatedImage && !showOriginal && (
        <div className="px-4 py-2 border-t border-border bg-secondary">
          <p className="text-xs text-muted-foreground">
            번역 이미지가 없어 원본 이미지를 표시합니다.
          </p>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground font-medium">
            번역된 텍스트 ({translatedTexts.length}개)
          </p>
          <CopyButton text={copyText} />
        </div>

        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
          {translatedTexts.length > 0 ? (
            translatedTexts.map((item, index) => (
              <div key={index} className="border border-border rounded-xl p-3 bg-background">
                <p className="text-xs text-muted-foreground mb-1">원본</p>
                <p className="text-sm text-foreground mb-2">{item.original}</p>

                <p className="text-xs text-muted-foreground mb-1">번역</p>
                <p className={`text-sm font-medium ${accentColor}`}>
                  {item.translated}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              번역할 OCR 텍스트가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
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
  const [expandedImage, setExpandedImage] = useState<{
    src: string;
    label: string;
  } | null>(null);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <Languages size={40} className="text-muted-foreground mb-4" />
        <p className="text-foreground font-medium mb-2">번역 결과가 없습니다.</p>
        <p className="text-muted-foreground text-sm mb-6">
          먼저 콘텐츠를 작성하고 번역을 요청하세요.
        </p>
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

  const isImageMarketing =
    state.source === "marketing-content" && state.type === "image";

  if (isImageMarketing) {
    const firstImage = state.images[0];

    const detectedTextCount = state.images.reduce(
      (sum, img) => sum + (img.ocr?.texts?.length ?? 0),
      0
    );

    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
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

            <span className="text-muted-foreground text-sm">이미지 번역 결과</span>
          </div>

          <button className="flex items-center gap-1.5 text-sm border border-border bg-card px-4 py-2 rounded-xl hover:bg-secondary transition-colors">
            <Download size={14} />
            전체 다운로드
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "업로드 이미지", value: `${state.images.length}장` },
            { label: "번역 언어 수", value: `${state.languages.length}개` },
            { label: "감지된 텍스트", value: `${detectedTextCount}개` },
            {
              label: "번역 완료",
              value: `${detectedTextCount * state.languages.length}건`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-muted-foreground text-xs mb-0.5">{s.label}</p>
              <p className="text-foreground font-semibold text-sm">{s.value}</p>
            </div>
          ))}
        </div>

        {state.images.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {state.images.map((img) => (
              <button
                key={img.id}
                className="shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 border-accent"
              >
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {firstImage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <OriginalImageCard
              image={firstImage}
              onExpand={() =>
                setExpandedImage({
                  src: firstImage.dataUrl,
                  label: "원본 이미지",
                })
              }
            />

            {translatedLangs.map((lang) => (
              <TranslatedImageCard
                key={lang.code}
                image={firstImage}
                lang={lang}
                accentColor={meta.color}
                accentBg={meta.bg}
                accentBorder={meta.border}
                onExpand={(src, label) => setExpandedImage({ src, label })}
              />
            ))}
          </div>
        )}

        <div className={`mt-6 rounded-2xl border ${meta.border} ${meta.bg} px-5 py-4`}>
          <p className={`text-xs font-semibold ${meta.color} mb-1`}>
            번역 방식 안내
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            원본 이미지는 OCR 좌표를 기준으로 감지 영역을 표시하고, 언어별 카드는 번역 문구가 입혀진 이미지와 문장별 번역 결과를 함께 표시합니다.
          </p>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm border border-border bg-card px-5 py-2.5 rounded-xl hover:bg-secondary transition-colors"
          >
            <RotateCcw size={14} />
            다시 업로드하기
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            메인으로 돌아가기
          </button>
        </div>

        {expandedImage && (
          <div
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-6"
            onClick={() => setExpandedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <p className="text-sm font-medium text-foreground">
                  {expandedImage.label}
                </p>
                <button
                  onClick={() => setExpandedImage(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <img
                src={expandedImage.src}
                alt={expandedImage.label}
                className="w-full max-h-[75vh] object-contain bg-secondary"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const files = state.type === "image" ? [] : state.files;

  const originalText =
    state.type === "image"
      ? ""
      : state.text ||
        (files.length > 0
          ? `[파일 업로드: ${files.map((f) => f.name).join(", ")}]\n\n파일 내용이 여기에 표시됩니다.`
          : "");

  const getTranslation = (lang: LanguageCode) => {
    if (!state?.result) return "";

    const textResult = Array.isArray(state.result)
      ? state.result.find((item: any) => item.type === "text")
      : null;

    return textResult?.result?.translations?.[lang]?.final_translation ?? "";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* 아래 기존 텍스트 결과 화면은 그대로 유지 */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
      </div>

      <p className="text-sm text-muted-foreground">
        기존 텍스트 결과 화면 코드는 여기 아래에 그대로 두면 됩니다.
      </p>
    </div>
  );
}