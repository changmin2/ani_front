import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  FileText,
  PencilLine,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { formatFileSize } from "../analyzeInput";
import { FeatureStrip } from "../shared/FeatureStrip";
import lingoLogo from "@/assets/images/lingo_logo.png";
import monitorImage from "@/assets/images/monitor-shadow-microsoft-white.png";
import { getApiBaseUrl } from "../../../api";
import type { FlowInput } from "../types";

type InputMode = "file" | "text";

const API_BASE_URL = getApiBaseUrl();

export function StepOneUpload({ onNext }: { onNext: (input: FlowInput) => void }) {
  const [mode, setMode] = useState<InputMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = mode === "file" ? Boolean(selectedFile) : text.trim().length > 0;
  const canSubmit = hasInput && !isAnalyzing;

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

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="select-none">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-8 pb-6 pt-20 lg:grid-cols-[590px_1fr]">
        <section>
          <div className="h-[100px] w-[350px] overflow-hidden" aria-label="Lingo">
            <img
              src={lingoLogo}
              alt=""
              className="max-w-none w-[415px] -translate-x-[34px] -translate-y-[25px]"
            />
          </div>
          <p className="mt-4 text-[20px] font-medium text-slate-700">
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

            <div
              className={mode === "file" ? "relative h-[204px] overflow-hidden" : "relative"}
            >
            {mode === "file" ? (
              <>
                <input
                  ref={fileInputRef}
                  id="document-file-upload"
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(event) => selectFiles(event.target.files)}
                />
                <div
                  className="relative mt-6 h-[180px]"
                >
                  <AnimatePresence initial={false} mode="wait">
                    {!selectedFile ? (
                      <motion.div
                        key="upload-dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <label
                          htmlFor="document-file-upload"
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
                            "flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white text-center transition-colors",
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
                        </label>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="selected-file"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-0 top-0 flex h-[76px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-6"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm">
                            <FileText size={25} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[16px] font-bold text-slate-950">
                              {selectedFile.name}
                            </p>
                            <p className="mt-1 text-[14px] text-slate-500">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="선택한 파일 삭제"
                          onClick={clearSelectedFile}
                          className="ml-4 shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
                        >
                          <X size={20} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <textarea
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="번역 및 검수할 금융문서 내용을 입력하세요."
                className="mt-6 h-[180px] w-full select-text resize-none rounded-xl border border-red-200 bg-white px-5 py-4 text-[15px] font-medium leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            )}

            {mode === "file" && (
              <AnimatePresence initial={false}>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
                  }}
                  transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-x-0 top-[120px] rounded-lg border border-red-200 bg-red-50 px-5 py-4"
                >
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 text-red-600" size={24} />
                <div>
                  <p className="text-[16px] font-extrabold text-red-600">
                    {isAnalyzing
                      ? "AI Lingo가 문서를 분석하고 있어요"
                      : "AI Lingo가 문서를 분석할 준비가 되었어요"}
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-slate-600">
                    문서 유형, 포함 정보, 핵심 수치, 법적/주의 문구를 자동으로 감지합니다.
                  </p>
                </div>
              </div>
                </motion.div>
              )}
              </AnimatePresence>
            )}
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

        <section className="relative hidden h-[500px] lg:block">
          <img
            src={monitorImage}
            alt="다국어 문서 변환 모니터"
            className="pointer-events-none absolute left-[88px] top-[calc(50%+42px)] w-[650px] max-w-none -translate-y-1/2 object-contain"
          />

          <div className="absolute -left-6 top-1/2 z-10 flex -translate-y-1/2 items-center gap-[10px]">
            {Array.from({ length: 5 }, (_, index) => {
              const fillAt = 0.1 + index * 0.12;

              return (
                <motion.span
                  key={index}
                  className="h-[7px] w-[7px] rounded-full"
                  initial={false}
                  animate={
                    canSubmit
                      ? {
                          backgroundColor: [
                            "#cbd5e1",
                            "#cbd5e1",
                            "#f38b91",
                            "#f38b91",
                            "#cbd5e1",
                          ],
                        }
                      : { backgroundColor: "#cbd5e1" }
                  }
                  transition={
                    canSubmit
                      ? {
                          duration: 2.4,
                          ease: "linear",
                          repeat: Infinity,
                          times: [0, fillAt, fillAt + 0.01, 0.82, 0.83],
                        }
                      : { duration: 0.2 }
                  }
                />
              );
            })}
            <motion.button
              onClick={submit}
              disabled={!hasInput || isAnalyzing}
              className={[
                "ml-2 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.14)]",
                canSubmit ? "" : "cursor-not-allowed",
              ].join(" ")}
              initial={false}
              animate={
                canSubmit
                  ? {
                      color: [
                        "#cbd5e1",
                        "#cbd5e1",
                        "#d80008",
                        "#d80008",
                        "#cbd5e1",
                      ],
                    }
                  : { color: "#cbd5e1" }
              }
              transition={
                canSubmit
                  ? {
                      duration: 2.4,
                      ease: "linear",
                      repeat: Infinity,
                      times: [0, 0.7, 0.71, 0.82, 0.83],
                    }
                  : { duration: 0.2 }
              }
            >
              <ArrowRight size={40} strokeWidth={2.2} />
            </motion.button>
          </div>
        </section>
      </div>
      <FeatureStrip />
    </div>
  );
}
