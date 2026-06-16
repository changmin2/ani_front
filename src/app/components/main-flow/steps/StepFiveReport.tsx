import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  Globe2,
  Info,
  Layers,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";

type StepFiveReportProps = {
  onBack: () => void;
};

const channels = [
  { label: "모바일 앱 공지", icon: Smartphone, selected: true },
  { label: "홈페이지 안내", icon: Monitor, selected: true },
  { label: "영업점 게시문", icon: Layers, selected: true },
  { label: "SNS 카드뉴스", icon: Globe2, selected: false },
  { label: "배너", icon: FileText, selected: false },
];

const templates = [
  { title: "모바일 공지형", sub: "App Notice", selected: true },
  { title: "홈페이지 카드형", sub: "Web Card" },
  { title: "영업점 게시문형", sub: "Branch Poster" },
  { title: "SNS 카드뉴스형", sub: "SNS Card" },
  { title: "배너형", sub: "Banner" },
];

const copySlots = [
  ["메인 타이틀", "권장 20자 이내", "Stable savings with BNK", "21/24"],
  ["서브 문구", "권장 60자 이내", "Enjoy preferential rates and\nreliable deposit protection.", "58/60"],
  ["핵심 혜택", "권장 25자 이내", "Up to 0.50%p preferential rate", "31/40"],
  ["CTA 버튼 문구", "권장 15자 이내", "Learn more", "10/15"],
  ["법적 고지 문구", "권장 80자 이내", "Terms and conditions may apply.", "28/80"],
];

export function StepFiveReport({ onBack }: StepFiveReportProps) {
  return (
    <div className="mx-auto max-w-[1480px] px-8 py-6">
      <div className="flex items-start justify-between gap-8">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-slate-950">
            게시 콘텐츠를 생성하세요
          </h1>
          <p className="mt-4 text-[16px] font-medium text-slate-600">
            검토 완료된 번역문을 게시 채널과 디자인 템플릿에 맞춰 자동 적용합니다.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard icon={CheckCircle2} title="검토 완료" value="" color="emerald" />
          <MetricCard icon={Globe2} title="대상 언어" value="영어 (English)" color="blue" />
          <MetricCard icon={Layers} title="게시 채널" value="4개 선택" color="indigo" />
          <MetricCard icon={FileText} title="생성 문안" value="4종" color="slate" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[310px_1fr_430px]">
        <aside className="space-y-4">
          <Panel title="1 게시 채널 선택" trailing={<X size={16} className="text-slate-400" />}>
            <div className="space-y-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.label} className="flex items-center justify-between">
                    <label className="flex items-center gap-3 text-[15px] font-extrabold text-slate-950">
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded border",
                          channel.selected
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {channel.selected && <Check size={14} />}
                      </span>
                      {channel.label}
                    </label>
                    <Icon size={18} className="text-slate-500" />
                  </div>
                );
              })}
            </div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-right text-[13px] font-semibold text-slate-500">
              선택된 채널 3/5
            </p>
          </Panel>

          <Panel title="2 디자인 템플릿 선택">
            <div className="space-y-2">
              {templates.map((template, index) => (
                <button
                  key={template.title}
                  className={[
                    "flex w-full items-center gap-4 rounded-lg border p-3 text-left",
                    template.selected ? "border-red-500 bg-red-50" : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <div className="h-14 w-14 rounded border border-slate-200 bg-gradient-to-br from-white to-red-50 shadow-sm">
                    <div className="m-2 h-2 rounded bg-red-500" />
                    <div className="mx-2 mt-2 h-2 rounded bg-slate-200" />
                    <div className="mx-2 mt-1 h-2 rounded bg-slate-200" />
                    {index === 0 && <div className="mx-2 mt-2 h-4 rounded bg-red-100" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-slate-950">{template.title}</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-500">{template.sub}</p>
                  </div>
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      template.selected ? "border-red-600 bg-red-600 text-white" : "border-slate-300",
                    ].join(" ")}
                  >
                    {template.selected && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-[18px] font-black text-slate-950">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[13px] text-white">
                3
              </span>
              디자인 적용 미리보기
              <Info size={16} className="text-slate-400" />
            </h2>
            <div className="flex rounded-lg border border-slate-200 p-1">
              <button className="rounded-md border border-red-500 bg-red-50 p-2 text-red-600">
                <Smartphone size={18} />
              </button>
              <button className="p-2 text-slate-500">
                <Tablet size={18} />
              </button>
              <button className="p-2 text-slate-500">
                <Monitor size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-12 border-b border-slate-100 text-[14px] font-extrabold">
            <button className="border-b-2 border-red-600 px-1 pb-3 text-red-600">모바일 앱 공지</button>
            <button className="px-1 pb-3 text-slate-800">홈페이지 안내</button>
            <button className="px-1 pb-3 text-slate-800">영업점 게시문</button>
          </div>

          <div className="relative mx-auto mt-6 max-w-[520px] rounded-[48px] border-[7px] border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
            <div className="absolute left-1/2 top-0 h-7 w-52 -translate-x-1/2 rounded-b-3xl bg-slate-200" />
            <div className="mb-5 flex items-center justify-between pt-4 text-[14px] font-bold text-slate-950">
              <span>9:41</span>
              <span className="text-[12px]">●●▰</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-100 p-8">
              <div className="flex items-center justify-between">
                <div className="text-[30px] font-black tracking-[-0.04em] text-red-600">BNK</div>
                <span className="text-slate-600">♧</span>
              </div>
              <h3 className="mt-8 text-[27px] font-black leading-tight tracking-tight text-[#061b3a]">
                BNK Time Deposit
                <br />
                Stable savings with
                <br />
                clear interest benefits.
              </h3>
              <p className="mt-5 text-[16px] font-medium leading-6 text-[#061b3a]">
                Enjoy preferential rates and
                <br />
                reliable deposit protection.
              </p>
              <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-lg bg-white/90 text-center shadow-sm">
                <div className="p-5">
                  <p className="text-[13px] font-semibold text-[#061b3a]">Base Interest Rate</p>
                  <p className="mt-2 text-[29px] font-black text-[#061b3a]">3.20%</p>
                  <p className="text-[13px] font-bold text-[#061b3a]">p.a.</p>
                </div>
                <div className="border-l border-slate-100 p-5">
                  <p className="text-[13px] font-semibold text-[#061b3a]">Preferential Rate</p>
                  <p className="mt-2 text-[29px] font-black text-[#061b3a]">Up to 0.50%p</p>
                </div>
              </div>
              <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-[16px] font-extrabold text-white">
                Learn more
                <span>›</span>
              </button>
            </div>
          </div>

          <div className="relative -mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-950">레이아웃 적합성 검수 결과</h3>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-extrabold text-slate-700">
                전체 검수 리포트 보기
              </button>
            </div>
            <div className="space-y-3 text-[14px]">
              <FitRow status="정상" text="제목 길이가 권장 범위(20자 이내)에 적합합니다." />
              <FitRow status="정상" text="CTA 문구가 버튼 영역에 적합합니다." />
              <FitRow status="주의" text="본문 문장이 다소 길어 모바일 화면에서 2줄 이상 표시될 수 있습니다." warning />
            </div>
          </div>
        </main>

        <aside className="space-y-4">
          <Panel title="4 템플릿 슬롯 문안" action="전체 수정">
            <div className="space-y-3">
              {copySlots.map(([label, hint, value, count]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[13px] font-extrabold text-slate-950">
                      {label} <span className="font-medium text-slate-500">({hint})</span>
                    </p>
                    <span className="text-[12px] font-semibold text-slate-500">{count}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_64px] gap-3">
                    <div className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-[14px] font-medium leading-5 text-slate-700">
                      {value}
                    </div>
                    <button className="rounded-lg border border-slate-200 text-[13px] font-extrabold text-slate-700">
                      수정
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="5 최종 산출물 및 다운로드">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["번역 결과", "(전체 문서)"],
                ["검수 리포트", "(AI 검수 요약)"],
                ["게시 문안", "(선택 채널)"],
                ["디자인 적용 이미지", "(고해상도)"],
              ].map(([title, sub]) => (
                <button key={title} className="flex h-14 items-center gap-3 rounded-lg border border-slate-200 px-4 text-left">
                  <Download size={18} className="text-slate-500" />
                  <span>
                    <span className="block text-[13px] font-extrabold text-slate-950">{title}</span>
                    <span className="block text-[12px] font-medium text-slate-500">{sub}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-3 flex items-center gap-2 text-[15px] font-black text-slate-950">
                승인 번역 자산 저장
                <Info size={15} className="text-slate-400" />
              </p>
              {["최종 번역문 저장", "게시 채널 문안 저장", "금융용어 매칭 결과 저장"].map((item) => (
                <label key={item} className="mb-2 flex items-center gap-2 text-[14px] font-extrabold text-slate-950">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-red-600 text-white">
                    <Check size={11} />
                  </span>
                  {item}
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <Save size={34} />
              </div>
            </div>
            <button className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-red-600 text-[16px] font-extrabold text-white shadow-[0_8px_18px_rgba(220,0,0,0.2)]">
              <Download size={20} />
              최종 리포트 생성 및 자산 저장
            </button>
          </Panel>
        </aside>
      </div>

      <div className="mt-4 flex min-h-16 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
        <button
          onClick={onBack}
          className="flex h-12 min-w-36 items-center justify-center gap-3 rounded-lg border border-slate-200 text-[16px] font-extrabold text-slate-950 hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
          이전으로
        </button>
        <p className="hidden items-center gap-3 text-[15px] font-semibold text-slate-600 md:flex">
          <ShieldCheck size={19} />
          생성된 콘텐츠는 내부 보안 정책에 따라 안전하게 저장되며, 승인 번역 자산으로 관리됩니다.
        </p>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  trailing,
  action,
}: {
  title: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  action?: string;
}) {
  const [num, ...rest] = title.split(" ");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[16px] font-black text-slate-950">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[13px] text-white">
            {num}
          </span>
          {rest.join(" ")}
          <Info size={15} className="text-slate-400" />
        </h2>
        {action ? (
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-extrabold text-slate-700">
            {action}
          </button>
        ) : (
          trailing
        )}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  color: "emerald" | "blue" | "indigo" | "slate";
}) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="flex h-14 min-w-32 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors[color]}`}>
        <Icon size={19} />
      </div>
      <div>
        <p className={`text-[13px] font-black ${colors[color].split(" ")[1]}`}>{title}</p>
        {value && <p className="text-[14px] font-black text-slate-950">{value}</p>}
      </div>
    </div>
  );
}

function FitRow({
  status,
  text,
  warning,
}: {
  status: string;
  text: string;
  warning?: boolean;
}) {
  return (
    <div className="grid grid-cols-[70px_1fr] items-center rounded-lg bg-slate-50 px-4 py-3">
      <span
        className={[
          "flex items-center gap-2 font-extrabold",
          warning ? "text-amber-600" : "text-emerald-600",
        ].join(" ")}
      >
        {warning ? "▲" : "●"} {status}
      </span>
      <span className="font-medium text-slate-600">{text}</span>
    </div>
  );
}
