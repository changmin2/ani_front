import { Check } from "lucide-react";
import { flowSteps } from "../flowData";
import type { FlowStep } from "../types";

export function FlowStepper({ current }: { current: FlowStep }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-5 items-center gap-6 px-8 py-5">
        {flowSteps.map((label, index) => {
          const stepNo = index + 1;
          const done = stepNo < current;
          const active = stepNo === current;

          return (
            <div key={label} className="flex min-w-0 items-center gap-4">
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[18px] font-bold",
                  done
                    ? "border-slate-300 bg-white text-slate-600"
                    : active
                      ? "border-red-600 bg-red-600 text-white shadow-[0_8px_18px_rgba(220,0,0,0.25)]"
                      : "border-slate-300 bg-white text-slate-500",
                ].join(" ")}
              >
                {done ? <Check size={19} /> : stepNo}
              </div>
              <span
                className={[
                  "truncate text-[17px] font-bold",
                  active ? "text-red-600" : "text-slate-600",
                ].join(" ")}
              >
                {done && stepNo === 1 ? `${stepNo} ${label}` : label}
              </span>
              {index < flowSteps.length - 1 && (
                <div className="h-px flex-1 bg-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
