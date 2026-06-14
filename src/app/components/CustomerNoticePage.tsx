import { FileText } from "lucide-react";
import { ContentEditor } from "./ContentEditor";

export function CustomerNoticePage() {
  return (
    <ContentEditor
      title="고객안내문"
      description="고객에게 전달할 공지사항 및 안내 문서를 작성하고 번역 언어를 선택하세요."
      placeholder={`예시:\n\n안녕하세요, 고객님.\n\n항상 저희 서비스를 이용해 주셔서 감사합니다.\n\n다음과 같이 서비스 변경 사항을 안내드립니다.\n\n1. 변경 내용\n2. 시행 일자\n3. 문의 방법`}
      accentColor="text-blue-700"
      accentBg="bg-blue-50"
      icon={<FileText size={20} />}
      source="customer-notice"
    />
  );
}
