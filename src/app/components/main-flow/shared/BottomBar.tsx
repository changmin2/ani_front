import { ChevronLeft, ChevronRight, Save, ShieldCheck } from "lucide-react";

type BottomBarProps = {
  leftLabel: string;
  onBack: () => void;
  helper?: string;
  secondaryLabel?: string;
  rightLabel: string;
  onNext: () => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
};

export function BottomBar({
  leftLabel,
  onBack,
  helper,
  secondaryLabel,
  rightLabel,
  onNext,
  disabled,
  onDisabledClick,
}: BottomBarProps) {
  return (
    <div className="mt-5 flex min-h-20 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
      <button
        onClick={onBack}
        className="flex h-12 min-w-40 items-center justify-center gap-3 rounded-lg border border-slate-200 text-[16px] font-extrabold text-slate-950 hover:bg-slate-50"
      >
        <ChevronLeft size={20} />
        {leftLabel}
      </button>

      {helper && (
        <p className="hidden items-center gap-3 text-[15px] font-semibold text-slate-600 md:flex">
          <ShieldCheck size={19} />
          {helper}
        </p>
      )}

      <div className="flex gap-4">
        {secondaryLabel && (
          <button className="flex h-12 min-w-48 items-center justify-center gap-3 rounded-lg border border-slate-200 text-[16px] font-extrabold text-slate-700 hover:bg-slate-50">
            <Save size={19} />
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={() => {
            if (disabled) {
              onDisabledClick?.();
              return;
            }

            onNext();
          }}
          aria-disabled={disabled}
          className={[
            "flex h-12 min-w-72 items-center justify-center gap-3 rounded-lg text-[17px] font-extrabold shadow-sm transition",
            disabled
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-red-600 text-white shadow-[0_8px_18px_rgba(220,0,0,0.2)] hover:bg-red-700",
          ].join(" ")}
        >
          {rightLabel}
          <ChevronRight size={21} />
        </button>
      </div>
    </div>
  );
}
