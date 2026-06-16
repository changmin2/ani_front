import { Bell, User } from "lucide-react";

export function FlowHeader() {
  return (
    <header className="h-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between px-8">
        <div className="flex items-end gap-3">
          <div className="text-[34px] font-black leading-none tracking-[-0.03em] text-[#df0000]">
            BNK
          </div>
          <div className="pb-1">
            <div className="text-[24px] font-extrabold leading-none text-[#4b3b2b]">
              금융그룹
            </div>
            <div className="mt-1 text-[10px] font-semibold tracking-tight text-[#4b3b2b]">
              BNK Financial Group
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-14 text-[16px] font-semibold text-slate-950 md:flex">
          <button className="hover:text-red-600">서비스 소개</button>
          <button className="hover:text-red-600">이용 가이드</button>
          <button className="hover:text-red-600">문의하기</button>
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
