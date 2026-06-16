import { Globe2 } from "lucide-react";

export function AiCube({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "relative mx-auto flex items-center justify-center",
        compact ? "h-44 w-80" : "h-[420px] w-[560px]",
      ].join(" ")}
    >
      <div className="absolute h-[52%] w-[84%] rounded-[50%] border-2 border-slate-200" />
      <div className="absolute left-[8%] top-[68%] h-4 w-4 rounded-full bg-slate-200" />
      <div className="absolute right-[9%] top-[27%] h-4 w-4 rounded-full bg-red-200" />
      <div className="absolute right-[8%] top-[58%] h-5 w-5 rounded-full bg-red-200" />
      <div
        className={[
          "relative rounded-[2.2rem] bg-gradient-to-br from-white via-[#fbfaf7] to-slate-200 shadow-[0_35px_55px_rgba(15,23,42,0.18)]",
          compact ? "h-36 w-44" : "h-80 w-96",
        ].join(" ")}
      >
        <div className="absolute inset-x-8 top-9 bottom-12 rounded-[2rem] bg-gradient-to-br from-slate-100 to-white shadow-inner" />
        <div className="absolute left-[26%] top-[34%] flex h-[28%] w-[23%] items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-[42px] font-extrabold text-white shadow-lg">
          가
        </div>
        <div className="absolute left-[43%] top-[43%] h-[34%] w-[24%] rounded-xl bg-white p-4 shadow-xl">
          <div className="text-center text-[38px] font-black text-slate-700">A</div>
          <div className="mt-3 h-2 rounded-full bg-slate-200" />
          <div className="mt-2 h-2 rounded-full bg-slate-200" />
        </div>
        <div className="absolute bottom-3 left-16 right-16 h-6 rounded-[50%] bg-[radial-gradient(circle,#9ca3af_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
        <div className="absolute right-8 top-24 h-3 w-3 rounded-full bg-red-500" />
        <div className="absolute right-8 top-36 h-3 w-3 rounded-full bg-slate-700" />
        <div className="absolute right-8 top-48 h-3 w-3 rounded-full bg-slate-400" />
        <div className="absolute bottom-16 right-5 h-20 w-1.5 rounded-full bg-slate-300" />
      </div>
      {!compact && (
        <div className="absolute right-0 flex flex-col gap-9 text-slate-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl font-bold">
            文
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl font-bold">
            A
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Globe2 size={34} />
          </div>
        </div>
      )}
    </div>
  );
}
