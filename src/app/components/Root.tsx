import { Outlet, useLocation, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const pageTitles: Record<string, string> = {
    "/customer-notice": "고객안내문",
    "/marketing-content": "마케팅 콘텐츠",
    "/product-manual": "상품설명서",
  };

  const currentTitle = pageTitles[location.pathname] ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          {!isHome && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity mr-2"
              aria-label="메인으로 돌아가기"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">메인</span>
            </button>
          )}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
              <span className="text-primary font-semibold text-xs">M</span>
            </div>
            <span className="text-sm tracking-widest uppercase opacity-70 font-medium">
              {isHome ? "콘텐츠 관리 시스템" : currentTitle}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2026 콘텐츠 관리 시스템. 모든 권리 보유.
          </p>
          <p className="text-muted-foreground text-sm">고객센터: 1588-0000</p>
        </div>
      </footer>
    </div>
  );
}
