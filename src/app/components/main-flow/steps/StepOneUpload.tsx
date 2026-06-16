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
import { AiCube } from "../shared/AiCube";
import { FeatureStrip } from "../shared/FeatureStrip";

export function StepOneUpload({ onNext }: { onNext: () => void }) {
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
              <button className="flex h-11 items-center justify-center gap-3 rounded-lg bg-white text-[16px] font-extrabold text-red-600 shadow">
                <FileText size={18} />
                파일 업로드
              </button>
              <button className="flex h-11 items-center justify-center gap-3 text-[16px] font-semibold text-slate-600">
                <PencilLine size={18} />
                텍스트 입력
              </button>
            </div>

            <button
              onClick={onNext}
              className="mt-6 flex h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-red-300 bg-white text-center transition hover:border-red-500 hover:bg-red-50/40"
            >
              <Upload className="text-red-600" size={54} strokeWidth={1.8} />
              <span className="mt-5 text-[17px] font-extrabold text-slate-950">
                파일을 드래그하거나 클릭하여 업로드하세요
              </span>
              <span className="mt-2 text-[14px] font-medium text-slate-500">
                PDF, DOCX, PPTX, TXT (최대 20MB)
              </span>
            </button>

            <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-slate-950">
                    BNK_외국인 고객 예금상품 안내문.pdf
                  </p>
                  <p className="mt-1 text-[14px] text-slate-500">1.2MB</p>
                </div>
              </div>
              <X size={20} className="text-slate-500" />
            </div>

            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 text-red-600" size={24} />
                <div>
                  <p className="text-[16px] font-extrabold text-red-600">
                    AI 라우터가 문서를 분석하고 있어요
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-slate-600">
                    문서 유형을 자동으로 분류하고 최적의 번역 및 게시 옵션을 추천합니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onNext}
              className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-red-600 text-[18px] font-extrabold text-white shadow-[0_8px_18px_rgba(220,0,0,0.22)] transition hover:bg-red-700"
            >
              <PlayCircle size={22} />
              분석 및 번역 시작
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
              onClick={onNext}
              className="ml-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-red-600 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
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
