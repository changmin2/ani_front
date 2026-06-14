import { Megaphone } from "lucide-react";
import { ContentEditor } from "./ContentEditor";

export function MarketingContentPage() {
  return (
    <ContentEditor
      title="마케팅 콘텐츠"
      description="프로모션, 이벤트 안내 등 마케팅 콘텐츠를 작성하고 다국어로 번역하세요."
      placeholder={`예시:\n\n🎉 여름 특별 프로모션!\n\n지금 가입하시면 첫 3개월 50% 할인!\n\n✅ 할인 혜택: 정가 대비 50% 적용\n✅ 적용 기간: 2026년 6월 1일 ~ 6월 30일\n✅ 대상: 신규 가입 고객 전원\n\n지금 바로 시작하세요!`}
      accentColor="text-amber-700"
      accentBg="bg-amber-50"
      icon={<Megaphone size={20} />}
      source="marketing-content"
    />
  );
}
