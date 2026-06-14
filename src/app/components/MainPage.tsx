import { useNavigate } from "react-router";
import { FileText, Megaphone, BookOpen, ArrowRight } from "lucide-react";

const menuItems = [
  {
    id: "customer-notice",
    path: "/customer-notice",
    icon: FileText,
    label: "고객안내문",
    description:
      "고객에게 전달할 공지사항, 안내 문서를 작성하고 관리합니다. 서비스 변경, 이용 약관, 중요 공지 등을 체계적으로 관리할 수 있습니다.",
    tag: "공지·안내",
    color: "from-blue-50 to-slate-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    accentBar: "bg-blue-600",
  },
  {
    id: "marketing-content",
    path: "/marketing-content",
    icon: Megaphone,
    label: "마케팅 콘텐츠",
    description:
      "프로모션, 이벤트, 광고 소재 등 마케팅에 활용할 콘텐츠를 제작하고 캠페인별로 분류하여 관리합니다.",
    tag: "프로모션·이벤트",
    color: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    accentBar: "bg-amber-500",
  },
  {
    id: "product-manual",
    path: "/product-manual",
    icon: BookOpen,
    label: "상품설명서",
    description:
      "상품 및 서비스의 상세 설명서, 이용 가이드, 기술 문서를 등록하고 버전별로 체계적으로 관리합니다.",
    tag: "문서·가이드",
    color: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    accentBar: "bg-emerald-600",
  },
];

export function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-3 py-1 rounded-full text-sm font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          콘텐츠 관리 플랫폼
        </div>
        <h1 className="text-foreground mb-4 leading-tight tracking-tight" style={{ fontSize: "2.5rem", fontWeight: 700 }}>
          필요한 문서를 빠르게
          <br />
          <span style={{ color: "var(--accent)" }}>찾고, 작성하고, 배포</span>하세요
        </h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontSize: "1.0625rem" }}>
          고객안내문, 마케팅 콘텐츠, 상품설명서를 한 곳에서 통합 관리합니다.
          원하는 메뉴를 선택해 바로 시작하세요.
        </p>
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-xs tracking-widest uppercase">메뉴 선택</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`group relative bg-gradient-to-br ${item.color} border border-border rounded-2xl p-7 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            >
              {/* Accent top bar */}
              <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-b-full ${item.accentBar} opacity-0 group-hover:opacity-100 transition-opacity`} />

              {/* Tag */}
              <span className="text-muted-foreground text-xs tracking-wider uppercase mb-5 block">{item.tag}</span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-5`}>
                <Icon size={22} />
              </div>

              {/* Title */}
              <h2 className="text-foreground mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                {item.label}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              {/* CTA */}
              <div className={`inline-flex items-center gap-1.5 text-sm font-medium ${item.iconColor} group-hover:gap-2.5 transition-all`}>
                바로 이동
                <ArrowRight size={15} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick stats bar */}
      <div className="bg-card border border-border rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
        {[
          { label: "등록된 문서", value: "1,248건" },
          { label: "이번 달 업데이트", value: "37건" },
          { label: "활성 캠페인", value: "12개" },
          { label: "마지막 배포", value: "오늘 09:30" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-foreground mb-0.5" style={{ fontSize: "1.375rem", fontWeight: 700 }}>
              {stat.value}
            </p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
