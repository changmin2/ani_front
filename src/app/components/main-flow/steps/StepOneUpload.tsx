import { useRef, useState } from "react";
import {
  ChevronRight,
  FileText,
  PencilLine,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { formatFileSize } from "../analyzeInput";
import { AiCube } from "../shared/AiCube";
import { FeatureStrip } from "../shared/FeatureStrip";
import type { FlowInput } from "../types";

type InputMode = "file" | "text";

// 백엔드 FastAPI 서버 주소. 개발 환경에서는 localhost:8000을 사용한다.
// 나중에 배포 환경을 붙이면 env 값으로 분리하면 된다.
const API_BASE_URL = "http://localhost:8000";

export function StepOneUpload({ onNext }: { onNext: (input: FlowInput) => void }) {
  const [mode, setMode] = useState<InputMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = mode === "file" ? Boolean(selectedFile) : text.trim().length > 0;

  const submit = async () => {
    // 이미 분석 중이면 중복 요청을 막는다. 파일 업로드/OCR은 시간이 걸릴 수 있다.
    if (!hasInput || isAnalyzing) return;

    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      if (mode === "file" && selectedFile) {
        const extension = selectedFile.name.split(".").pop()?.toUpperCase() || "FILE";
        const formData = new FormData();

        // 파일 분석 API는 multipart/form-data를 받는다.
        // 이미지 파일이면 백엔드에서 OCR을 먼저 수행하고, PDF/DOCX/TXT는 텍스트 추출을 수행한다.
        formData.append("file", selectedFile);
        formData.append("top", "5");

        const response = await fetch(`${API_BASE_URL}/documents/analyze/file`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.detail || "파일 분석에 실패했습니다.");
        }

        const analysisResponse = await response.json();

        // 분석 결과를 FlowInput에 함께 실어 2페이지/3페이지에서 재사용한다.
        // 이렇게 하면 페이지가 넘어갈 때마다 같은 문서를 다시 분석하지 않아도 된다.
        onNext({
          mode: "file",
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: extension,
          analysisResponse,
        });
        return;
      }

      if (mode === "text" && text.trim()) {
        const trimmedText = text.trim();
        // 텍스트 분석 API는 JSON body를 받는다.
        // 응답 shape은 파일 분석 API와 동일하게 맞춰져 있다.
        const response = await fetch(`${API_BASE_URL}/documents/analyze/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: trimmedText,
            top: 5,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.detail || "텍스트 분석에 실패했습니다.");
        }

        const analysisResponse = await response.json();

        // 텍스트 원문과 백엔드 분석 결과를 함께 다음 단계로 전달한다.
        onNext({
          mode: "text",
          text: trimmedText,
          analysisResponse,
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "문서 분석 중 오류가 발생했습니다."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectFiles = (files: FileList | null) => {
    // 현재 화면 정책은 한 번에 하나의 문서만 분석한다.
    const file = files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setMode("file");
    setErrorMessage("");
  };

  return (
    <div>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-8 pb-6 pt-14 lg:grid-cols-[590px_1fr]">
        <section>
          <h1 className="text-[72px] font-black leading-none tracking-tight text-slate-950">
            A&I
          </h1>
          <p className="mt-6 text-[20px] font-medium text-slate-700">
            금융문서 다국어 현지화 및 콘텐츠 제작 AI 에이전트
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => {
                  setMode("file");
                  setErrorMessage("");
                }}
                className={[
                  "flex h-11 items-center justify-center gap-3 rounded-lg text-[16px]",
                  mode === "file"
                    ? "bg-white font-extrabold text-red-600 shadow"
                    : "font-semibold text-slate-600",
                ].join(" ")}
              >
                <FileText size={18} />
                파일 업로드
              </button>
              <button
                onClick={() => {
                  setMode("text");
                  setErrorMessage("");
                }}
                className={[
                  "flex h-11 items-center justify-center gap-3 rounded-lg text-[16px]",
                  mode === "text"
                    ? "bg-white font-extrabold text-red-600 shadow"
                    : "font-semibold text-slate-600",
                ].join(" ")}
              >
                <PencilLine size={18} />
                텍스트 입력
              </button>
            </div>

            {mode === "file" ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(event) => selectFiles(event.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    selectFiles(event.dataTransfer.files);
                  }}
                  className={[
                    "mt-6 flex h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed bg-white text-center transition",
                    isDragging
                      ? "border-red-500 bg-red-50"
                      : "border-red-300 hover:border-red-500 hover:bg-red-50/40",
                  ].join(" ")}
                >
                  <Upload className="text-red-600" size={54} strokeWidth={1.8} />
                  <span className="mt-5 text-[17px] font-extrabold text-slate-950">
                    파일을 드래그하거나 클릭하여 업로드하세요
                  </span>
                  <span className="mt-2 text-[14px] font-medium text-slate-500">
                    PDF, DOCX, TXT, PNG, JPG (최대 20MB)
                  </span>
                </button>
              </>
            ) : (
              <textarea
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="번역 및 검수할 금융문서 내용을 입력하세요."
                className="mt-6 h-[180px] w-full resize-none rounded-xl border border-red-200 bg-white px-5 py-4 text-[15px] font-medium leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            )}

            {mode === "file" && selectedFile && (
              <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white">
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-950">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-[14px] text-slate-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setErrorMessage("");
                  }}
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            )}

            {mode === "text" && text.trim() && (
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-[13px] font-extrabold text-slate-500">입력 텍스트 미리보기</p>
                <p className="mt-2 line-clamp-3 text-[15px] font-medium leading-7 text-slate-800">
                  {text}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 text-red-600" size={24} />
                <div>
                  <p className="text-[16px] font-extrabold text-red-600">
                    {isAnalyzing
                      ? "AI 라우터가 문서를 분석하고 있어요"
                      : "AI 라우터가 문서를 분석할 준비가 되었어요"}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-slate-600">
                    문서 유형, 포함 정보, 핵심 수치, 법적/주의 문구를 자동으로 감지합니다.
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-[14px] font-bold text-rose-700">
                {errorMessage}
              </div>
            )}

            <button
              onClick={submit}
              disabled={!hasInput || isAnalyzing}
              className={[
                "mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-lg text-[18px] font-extrabold shadow-[0_8px_18px_rgba(220,0,0,0.22)] transition",
                hasInput && !isAnalyzing
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none",
              ].join(" ")}
            >
              <PlayCircle size={22} />
              {isAnalyzing ? "문서 분석 중" : "분석 시작"}
            </button>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] font-medium text-slate-500">
            <ShieldCheck size={15} />
            업로드한 파일은 안전하게 보호되며, 분석 후 자동으로 삭제됩니다.
          </p>
        </section>

        <section className="hidden lg:block">
          <div className="mb-1 ml-2 flex items-center gap-3 text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <button
              onClick={submit}
              disabled={!hasInput || isAnalyzing}
              className={[
                "ml-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]",
                hasInput && !isAnalyzing
                  ? "text-red-600"
                  : "cursor-not-allowed text-slate-300",
              ].join(" ")}
            >
              <ChevronRight size={46} />
            </button>
          </div>
          <AiCube />
        </section>
      </div>
      <FeatureStrip />
    </div>
  );
}
