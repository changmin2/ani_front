import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  X,
  Languages,
  Check,
  Paperclip,
  AlertCircle,
} from "lucide-react";

export type LanguageCode = "en" | "ja" | "vi" | "es" | "zh" | "id" | "th";

export const LANGUAGES: { code: LanguageCode; label: string; native: string; flag: string }[] = [
  { code: "en", label: "영어", native: "English", flag: "🇺🇸" },
  { code: "ja", label: "일본어", native: "日本語", flag: "🇯🇵" },
  { code: "vi", label: "베트남어", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "es", label: "스페인어", native: "Español", flag: "🇪🇸" },
  { code: "zh", label: "중국어(간체)", native: "中文(简体)", flag: "🇨🇳" },
  { code: "id", label: "인도네시아어", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", label: "태국어", native: "ภาษาไทย", flag: "🇹🇭" },
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}


interface ContentEditorProps {
  title: string;
  description: string;
  placeholder: string;
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
  source: "customer-notice" | "marketing-content" | "product-manual";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function ContentEditor({
  title,
  description,
  placeholder,
  accentColor,
  accentBg,
  icon,
  source,
}: ContentEditorProps) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<LanguageCode[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addFiles = useCallback((newFiles: FileList | null) => {
  if (!newFiles) return;

  const allowed = Array.from(newFiles).filter(
    (f) => f.size <= 20 * 1024 * 1024
  );

  setFiles((prev) => [
    ...prev,
    ...allowed.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type,
        file: f,   // 추가
      })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const toggleLang = (code: LanguageCode) => {
    setSelectedLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    const errs: string[] = [];

    if (!text.trim() && files.length === 0) {
    errs.push("텍스트를 입력하거나 파일을 업로드해주세요.");
    }

    if (selectedLangs.length === 0) {
    errs.push("번역할 언어를 하나 이상 선택해주세요.");
    }

    if (errs.length > 0) {
    setErrors(errs);
    return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
    const requests: Promise<any>[] = [];

    // 텍스트 번역
    if (text.trim()) {
      requests.push(
        fetch("http://localhost:8000/translate/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            target_languages: selectedLangs,
            source,
          }),
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error("텍스트 번역 실패");
          }

          return {
            type: "text",
            result: await res.json(),
          };
        })
      );
    }

    // 파일 번역
    files.forEach((uploadedFile) => {
      const formData = new FormData();

      formData.append("file", uploadedFile.file);

      selectedLangs.forEach((lang) => {
        formData.append("target_languages", lang);
      });

      formData.append("source", source);

      requests.push(
        fetch("http://localhost:8000/translate/file", {
          method: "POST",
          body: formData,
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error("파일 번역 실패");
          }

          return {
            type: "file",
            fileName: uploadedFile.name,
            result: await res.json(),
          };
        })
      );
    });

    const results = await Promise.all(requests);

    navigate("/translation-result", {
      state: {
        text,
        files,
        languages: selectedLangs,
        source,
        result: results,
      },
    });

    } catch (error) {
    console.error(error);

    setErrors([
      "서버 연결에 실패했습니다. FastAPI 서버가 실행 중인지 확인해주세요.",
    ]);

    } finally {
    setIsLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-11 h-11 rounded-xl ${accentBg} ${accentColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h1 className="text-foreground mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Text + File */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Text input */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <span className="text-sm font-medium text-foreground">내용 입력</span>
              <span className="text-xs text-muted-foreground">{text.length.toLocaleString()}자</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="w-full px-5 py-4 text-sm text-foreground bg-transparent resize-none focus:outline-none leading-relaxed"
              style={{ minHeight: "280px" }}
            />
          </div>

          {/* File upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
              isDragging
                ? `border-current ${accentColor} ${accentBg}`
                : "border-border hover:border-muted-foreground/40 bg-card"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${accentBg} ${accentColor} flex items-center justify-center`}>
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, 이미지 · 최대 20MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
            />
          </div>

          {/* Uploaded files */}
          {files.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Paperclip size={14} />
                  첨부 파일 ({files.length})
                </span>
              </div>
              <ul className="divide-y divide-border">
                {files.map((file) => (
                  <li key={file.id} className="flex items-center gap-3 px-5 py-3.5">
                    <FileText size={16} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatSize(file.size)}</span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Language + Submit */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Language selection */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
              <Languages size={15} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">번역 언어 선택</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLangs.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLang(lang.code)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? `${accentBg} border-2 border-current ${accentColor}`
                        : "bg-secondary border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? accentColor : "text-foreground"}`}>
                        {lang.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{lang.native}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? `bg-current border-current` : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedLangs.length > 0 && (
              <div className="px-5 pb-4">
                <div className={`text-xs font-medium ${accentColor} ${accentBg} px-3 py-2 rounded-lg text-center`}>
                  {selectedLangs.length}개 언어 선택됨
                </div>
              </div>
            )}
          </div>

          {/* Errors */}
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

          {/* Submit */}
         <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50`}
          >
            <Languages size={16} />

            {isLoading ? "번역 요청 중..." : "번역 요청하기"}

            {selectedLangs.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${accentBg} ${accentColor}`}>
                {selectedLangs.length}
              </span>
            )}
          </button>

          {/* Info */}
          <div className="bg-secondary border border-border rounded-2xl px-4 py-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground block mb-1">번역 안내</span>
              번역 완료 후 원본과 번역본을 함께 확인할 수 있습니다. 전문 번역 검수를 원하시면 별도로 신청해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
