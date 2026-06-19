import { Bell, User } from "lucide-react";
import bnkFinancialGroupCi from "@/assets/images/bnk-financial-group-ci.png";

export function FlowHeader({
  activeView = "flow",
  onGoHome,
  onShowIntro,
  onShowGuide,
  onShowContact,
}: {
  activeView?: "flow" | "intro" | "guide" | "contact";
  onGoHome?: () => void;
  onShowIntro?: () => void;
  onShowGuide?: () => void;
  onShowContact?: () => void;
}) {
  return (
    <header className="h-20 select-none border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between px-8">
        <button
          type="button"
          onClick={onGoHome}
          aria-label="문서 업로드 화면으로 이동"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
        >
          <img
            src={bnkFinancialGroupCi}
            alt="BNK금융그룹"
            className="h-8 w-auto object-contain"
          />
        </button>

        <nav className="hidden items-center gap-14 text-[16px] font-semibold text-slate-950 md:flex">
          <button
            onClick={onShowIntro}
            className={[
              "relative h-20 transition-colors hover:text-red-600",
              activeView === "intro" ? "text-red-600" : "",
            ].join(" ")}
          >
            서비스 소개
            {activeView === "intro" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red-600" />
            )}
          </button>
          <button
            onClick={onShowGuide}
            className={[
              "relative h-20 transition-colors hover:text-red-600",
              activeView === "guide" ? "text-red-600" : "",
            ].join(" ")}
          >
            이용 가이드
            {activeView === "guide" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red-600" />
            )}
          </button>
          <button
            onClick={onShowContact}
            className={[
              "relative h-20 transition-colors hover:text-red-600",
              activeView === "contact" ? "text-red-600" : "",
            ].join(" ")}
          >
            문의하기
            {activeView === "contact" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red-600" />
            )}
          </button>
          <button className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100">
            <Bell size={22} />
            <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
            <User size={21} />
          </button>
        </nav>
      </div>
    </header>
  );
}
