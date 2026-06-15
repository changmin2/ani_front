import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  ImageIcon,
  Upload,
  X,
  Languages,
  Check,
  AlertCircle,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { LANGUAGES, type LanguageCode } from "./ContentEditor";

const OCR_API_URL = "http://localhost:8000/ocr/image";

interface OcrText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  polygon?: { x: number; y: number }[];
}

interface OcrResult {
  file_name: string;
  width?: number;
  height?: number;
  texts: OcrText[];
}

interface UploadedImage {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  file: File;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function MarketingContentPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<LanguageCode[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<UploadedImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<UploadedImage> =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) =>
        resolve({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          dataUrl: e.target?.result as string,
          file,
        });

      reader.readAsDataURL(file);
    });

  const addImages = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    const loaded = await Promise.all(imageFiles.map(readFile));

    setImages((prev) => [...prev, ...loaded]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addImages(e.dataTransfer.files);
    },
    [addImages]
  );

  const toggleLang = (code: LanguageCode) => {
    setSelectedLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const requestOcr = async (image: UploadedImage) => {
    const formData = new FormData();

    formData.append("file", image.file);
    formData.append("target_languages", selectedLangs.join(","));

    const res = await fetch("http://localhost:8000/ocr/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(errorText);
      throw new Error(`${image.name} OCR 요청 실패`);
    }

    const ocrResult = await res.json();
    const imageSize = await getImageSize(image.dataUrl);

    return {
      ...image,
      ocr: {
        ...ocrResult,
        width: ocrResult.width ?? imageSize.width,
        height: ocrResult.height ?? imageSize.height,
      },
    };
  };

  const handleSubmit = async () => {
    const errs: string[] = [];

    if (images.length === 0) {
      errs.push("홍보 이미지를 하나 이상 업로드해주세요.");
    }

    if (selectedLangs.length === 0) {
      errs.push("번역할 언어를 하나 이상 선택해주세요.");
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const imagesWithOcr = await Promise.all(images.map(requestOcr));

      navigate("/translation-result", {
        state: {
          type: "image",
          images: imagesWithOcr,
          languages: selectedLangs,
          source: "marketing-content",
        },
      });
    } catch (error) {
      console.error(error);
      setErrors(["이미지 OCR 처리 중 오류가 발생했습니다. 서버 상태와 API 주소를 확인해주세요."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <ImageIcon size={20} />
        </div>

        <div>
          <h1
            className="text-foreground mb-1"
            style={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            마케팅 콘텐츠
          </h1>

          <p className="text-muted-foreground text-sm">
            홍보 이미지를 업로드하고 번역 언어를 선택하면, 이미지 내 텍스트를 번역한 결과를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl px-6 py-12 flex flex-col items-center gap-4 cursor-pointer transition-all ${
              isDragging
                ? "border-amber-400 bg-amber-50"
                : "border-border hover:border-amber-300 bg-card hover:bg-amber-50/40"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Upload size={24} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG, WebP · 여러 장 동시 업로드 가능
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
              <ImageIcon size={12} />
              배너, 포스터, SNS 카드 등 홍보 이미지
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => addImages(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <ImageIcon size={14} className="text-amber-600" />
                업로드된 이미지 ({images.length}장)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative bg-secondary rounded-xl overflow-hidden border border-border aspect-video"
                  >
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(img);
                        }}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-foreground hover:bg-white"
                      >
                        <ZoomIn size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImages((prev) => prev.filter((i) => i.id !== img.id));
                        }}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                      <p className="text-white text-xs truncate">{img.name}</p>
                      <p className="text-white/70 text-xs">{formatSize(img.size)}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-amber-300 hover:text-amber-600 transition-colors"
                >
                  <Upload size={18} />
                  <span className="text-xs">추가</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <p className="text-amber-800 text-xs leading-relaxed">
              <span className="font-semibold block mb-1">📌 이미지 번역 안내</span>
              업로드된 이미지에서 텍스트를 자동으로 감지하여 선택한 언어로 번역합니다.
              이미지 해상도가 높을수록 인식률이 높아집니다. 텍스트가 포함되지 않은 이미지는 번역되지 않습니다.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
              <Languages size={15} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                번역 언어 선택
              </span>
            </div>

            <div className="p-4 flex flex-col gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLangs.includes(lang.code);

                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLang(lang.code)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border-2 ${
                      isSelected
                        ? "bg-amber-50 border-amber-400 text-amber-700"
                        : "bg-secondary border-transparent hover:border-border"
                    }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isSelected ? "text-amber-700" : "text-foreground"
                        }`}
                      >
                        {lang.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{lang.native}</p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-amber-500 border-amber-500"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && (
                        <Check size={10} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedLangs.length > 0 && (
              <div className="px-5 pb-4">
                <div className="text-xs font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-center">
                  {selectedLangs.length}개 언어 선택됨
                </div>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-col gap-1.5">
              {errors.map((err) => (
                <p key={err} className="text-red-600 text-xs flex items-start gap-2">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  {err}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                OCR 처리 중...
              </>
            ) : (
              <>
                <Languages size={16} />
                이미지 번역 요청하기
                {selectedLangs.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                    {selectedLangs.length}개 언어
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">
                {preview.name}
              </p>

              <button
                onClick={() => setPreview(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <img
              src={preview.dataUrl}
              alt={preview.name}
              className="w-full max-h-[70vh] object-contain bg-secondary"
            />
          </div>
        </div>
      )}
    </div>
  );
}