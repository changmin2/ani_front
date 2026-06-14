import { BookOpen } from "lucide-react";
import { ContentEditor } from "./ContentEditor";

export function ProductManualPage() {
  return (
    <ContentEditor
      title="상품설명서"
      description="상품 및 서비스의 상세 설명서, 이용 가이드를 작성하고 다국어로 번역하세요."
      placeholder={`예시:\n\n[상품명] 프리미엄 플랜 이용 가이드\n\n■ 개요\n본 가이드는 프리미엄 플랜 이용 방법에 대해 안내합니다.\n\n■ 주요 기능\n1. 기능 A: 설명\n2. 기능 B: 설명\n3. 기능 C: 설명\n\n■ 이용 방법\n단계별 사용 방법을 기재해주세요.\n\n■ 문의\n고객센터: 1588-0000`}
      accentColor="text-emerald-700"
      accentBg="bg-emerald-50"
      icon={<BookOpen size={20} />}
      source="product-manual"
    />
  );
}
