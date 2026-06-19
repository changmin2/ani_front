export type FlowStep = 1 | 2 | 3 | 4 | 5;

export type StepNavigationProps = {
  onBack?: () => void;
  onNext: () => void;
};

export type FlowInput =
  // 1페이지에서 파일을 업로드한 경우.
  // analysisResponse는 백엔드 /documents/analyze/file 응답이며, 2~3페이지에서 계속 재사용한다.
  | {
      mode: "file";
      fileName: string;
      fileSize: number;
      fileType: string;
      analysisResponse?: DocumentAnalyzeResponse;
    }
  // 1페이지에서 텍스트를 직접 입력한 경우.
  // 파일과 동일하게 백엔드 분석 결과를 함께 보관해 다음 단계가 API를 다시 호출하지 않게 한다.
  | {
      mode: "text";
      text: string;
      analysisResponse?: DocumentAnalyzeResponse;
    };

export type KeyNumberPreview = {
  // 화면에는 "기본금리: 연 3.2%"처럼 label/value를 표시한다.
  label: string;
  value: string;
  // source_text는 실제 원문 근거다. 상세보기/검수 화면에서 신뢰 근거로 사용할 수 있다.
  source_text?: string;
};

export type DocumentAnalysis = {
  // 백엔드 Agent가 3개 문서 유형 중 하나로 분류한 결과.
  document_type: string;
  document_character: string;
  // 3페이지 "문서 구조 분석" 카드에서 사용하는 구조화 결과.
  document_structure?: {
    title: string;
    body_sections: string[];
    notice_phrases: string[];
  };
  included_information: string[];
  key_numbers_preview: KeyNumberPreview[];
  confidence?: number;
  legal_notice_detection: {
    count: number;
    items: string[];
  };
};

export type RetrievedDocument = {
  // Azure AI Search에서 가져온 추천 근거 문서.
  // 2페이지 "AI 추천 근거 보기" 패널에 그대로 렌더링된다.
  id: string;
  title: string;
  category: string;
  content: string;
  source_file: string;
  score?: number;
};

export type DocumentAnalyzeResponse = {
  text: string;
  file_name?: string;
  extract_method?: string;
  analysis: DocumentAnalysis;
  retrieved_documents: RetrievedDocument[];
};

export type TranslationSection = {
  id: string;
  order: number;
  source_label: string;
  source_text: string;
  translated_label: string;
  translated_text: string;
};

export type TranslationByLanguage = {
  language: string;
  language_code: string;
  title: string;
  summary: string;
  sections: TranslationSection[];
  full_text: string;
};

export type TranslationResult = {
  translations: TranslationByLanguage[];
};

export type FlowExecutionSettings = {
  // 2페이지에서 사용자가 최종 확정한 실행 설정.
  // 3페이지가 선택 언어/검수 기준에 맞춰 진행 문구를 만드는 데 사용한다.
  documentType: string;
  targetLanguages: string[];
  publishChannels: string[];
  toneStyle: string;
  reviewChecks: string[];
};

export type AnalysisResult = {
  documentType: string;
  documentCharacter: string;
  includedInfo: string;
  legalNoticeCount: number;
  confidence: number;
  keyNumbersPreview: KeyNumberPreview[];
  coreNumbers: {
    baseRate: string;
    preferentialRate: string;
    term: string;
    protection: string;
    earlyWithdrawal: string;
  };
};
