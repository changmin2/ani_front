import { BookOpen, FileText, LayoutTemplate, Shield } from "lucide-react";

export function FeatureStrip() {
  const items = [
    { icon: FileText, title: "문서 자동 분석", desc: "문서 유형 및 구조를 AI가 자동으로 분석합니다." },
    { icon: BookOpen, title: "금융용어 일관성", desc: "금융용어집과 승인 번역 데이터를 활용하여 정확하게 번역합니다." },
    { icon: Shield, title: "AI 검수 및 품질 관리", desc: "핵심 정보 검수와 위험 문구 점검으로 번역 품질을 높입니다." },
    { icon: LayoutTemplate, title: "게시용 문안 생성", desc: "다양한 채널과 템플릿에 맞춰 최적의 문안을 생성합니다." },
  ];

  return (
    <div className="mx-auto mt-8 grid max-w-[1320px] grid-cols-1 rounded-xl border border-slate-200 bg-white px-8 py-6 shadow-sm md:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={[
              "flex items-start gap-5 px-5",
              index > 0 ? "border-slate-200 md:border-l" : "",
            ].join(" ")}
          >
            <Icon className="mt-1 text-red-600" size={32} strokeWidth={2.1} />
            <div>
              <h3 className="text-[17px] font-extrabold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-600">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
