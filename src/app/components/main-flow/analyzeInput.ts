import type { AnalysisResult, FlowInput } from "./types";

// 백엔드 응답이 아직 없거나 개발 중 mock 화면을 볼 때 사용하는 기본 분석값.
// 실제 서비스 흐름에서는 StepOneUpload가 analysisResponse를 받아오므로 이 값은 fallback 역할이다.
const defaultAnalysis: AnalysisResult = {
  documentType: "금융상품 안내문",
  documentCharacter: "외국인 고객 대상 상품 안내",
  includedInfo: "금리, 가입기간, 우대조건, 예금자보호, 중도해지 유의사항",
  legalNoticeCount: 3,
  confidence: 0.92,
  keyNumbersPreview: [
    {
      label: "기본금리",
      value: "연 3.20%",
      source_text: "기본금리 연 3.20%",
    },
    {
      label: "우대금리",
      value: "최대 연 0.50%p",
      source_text: "우대금리 최대 연 0.50%p",
    },
    {
      label: "가입기간",
      value: "6개월 / 12개월 / 24개월 / 36개월",
      source_text: "가입기간 6개월 / 12개월 / 24개월 / 36개월",
    },
    {
      label: "예금자보호",
      value: "1인당 5천만원",
      source_text: "예금자보호 1인당 5천만원",
    },
    {
      label: "중도해지 이율",
      value: "가입기간별 차등 적용",
      source_text: "중도해지 이율 가입기간별 차등 적용",
    },
  ],
  coreNumbers: {
    baseRate: "연 3.20%",
    preferentialRate: "최대 연 0.50%p",
    term: "6개월 / 12개월 / 24개월 / 36개월",
    protection: "1인당 5천만원",
    earlyWithdrawal: "가입기간별 차등 적용",
  },
};

function findMatch(text: string, patterns: RegExp[]) {
  // fallback 분석에서 파일명/텍스트에 들어 있는 간단한 수치 패턴을 추출한다.
  // 백엔드 분석 결과가 있으면 이 함수는 거의 사용되지 않는다.
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const captured = match.slice(1).filter(Boolean).at(-1);
      if (captured) return captured.trim();
    }
    if (match?.[0]) return match[0].trim();
  }
  return "";
}

function getCoreNumberValue(
  keyNumbers: AnalysisResult["keyNumbersPreview"],
  labels: string[],
  fallback: string
) {
  // 백엔드 key_numbers_preview 배열을 기존 UI가 기대하던 coreNumbers 형태로 매핑한다.
  // 예: label이 "기본금리" 또는 "기준금리"이면 coreNumbers.baseRate에 표시한다.
  const found = keyNumbers.find((item) =>
    labels.some((label) => item.label.includes(label))
  );

  return found?.value || fallback;
}

export function analyzeInput(input: FlowInput | null): AnalysisResult {
  if (!input) return defaultAnalysis;

  const remoteAnalysis = input.analysisResponse?.analysis;

  if (remoteAnalysis) {
    // 실제 API 응답이 있는 정상 흐름.
    // 백엔드는 snake_case, 기존 프론트 UI는 camelCase 형태라 여기서 화면용 모델로 변환한다.
    const keyNumbersPreview = remoteAnalysis.key_numbers_preview || [];

    return {
      documentType: remoteAnalysis.document_type || defaultAnalysis.documentType,
      documentCharacter:
        remoteAnalysis.document_character || defaultAnalysis.documentCharacter,
      includedInfo:
        remoteAnalysis.included_information?.join(", ") ||
        defaultAnalysis.includedInfo,
      legalNoticeCount:
        remoteAnalysis.legal_notice_detection?.count ??
        defaultAnalysis.legalNoticeCount,
      confidence: remoteAnalysis.confidence ?? defaultAnalysis.confidence,
      keyNumbersPreview,
      coreNumbers: {
        baseRate: getCoreNumberValue(
          keyNumbersPreview,
          ["기본금리", "기준금리"],
          "-"
        ),
        preferentialRate: getCoreNumberValue(
          keyNumbersPreview,
          ["우대금리"],
          "-"
        ),
        term: getCoreNumberValue(
          keyNumbersPreview,
          ["가입기간", "만기"],
          "-"
        ),
        protection: getCoreNumberValue(
          keyNumbersPreview,
          ["예금자보호", "보호한도"],
          "-"
        ),
        earlyWithdrawal: getCoreNumberValue(
          keyNumbersPreview,
          ["중도해지", "해지 이율"],
          "-"
        ),
      },
    };
  }

  const sourceText =
    input.mode === "text"
      ? input.text
      : input.fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");

  const normalized = sourceText.replace(/\s+/g, " ");
  // 아래 로직은 API 응답 없이 UI를 확인할 때만 쓰는 간단한 프론트 fallback 분석이다.
  const isDeposit = /예금|적금|deposit|savings|금리|우대|가입기간/i.test(normalized);
  const isNotice = /안내|공지|notice|상품|고객/i.test(normalized);
  const isForeign = /외국인|영어|English|다국어|foreign|베트남|Vietnam/i.test(normalized);

  const baseRate = findMatch(normalized, [
    /기본\s*금리[^0-9%]*(연\s*)?([0-9]+(?:\.[0-9]+)?\s*%)/i,
    /연\s*([0-9]+(?:\.[0-9]+)?\s*%)/i,
    /([0-9]+(?:\.[0-9]+)?\s*%\s*p\.?a\.?)/i,
  ]);

  const preferentialRate = findMatch(normalized, [
    /우대\s*금리[^0-9%]*(최대\s*)?(연\s*)?([0-9]+(?:\.[0-9]+)?\s*%p?)/i,
    /최대\s*(연\s*)?([0-9]+(?:\.[0-9]+)?\s*%p?)/i,
  ]);

  const term = findMatch(normalized, [
    /가입\s*기간[^0-9]*(\d+\s*개월(?:\s*\/\s*\d+\s*개월)*)/i,
    /(\d+\s*개월\s*\/\s*\d+\s*개월(?:\s*\/\s*\d+\s*개월)*)/i,
  ]);

  const protection = findMatch(normalized, [
    /예금자\s*보호[^0-9]*(1인당\s*)?([0-9]+\s*천?만?원)/i,
    /(1인당\s*[0-9]+\s*천?만?원)/i,
  ]);

  const legalKeywords = ["예금자보호", "중도해지", "유의사항", "약관", "보호한도", "조건"];
  const legalNoticeCount = legalKeywords.filter((keyword) => normalized.includes(keyword)).length;

  return {
    documentType: isDeposit ? "금융상품 안내문" : isNotice ? "고객 안내문" : "일반 금융 문서",
    documentCharacter: isForeign ? "외국인 고객 대상 상품 안내" : "고객 대상 금융 안내",
    includedInfo: [
      /금리|이율/.test(normalized) && "금리",
      /가입|기간/.test(normalized) && "가입기간",
      /우대|조건/.test(normalized) && "우대조건",
      /예금자보호|보호/.test(normalized) && "예금자보호",
      /중도해지|해지/.test(normalized) && "중도해지 유의사항",
    ]
      .filter(Boolean)
      .join(", ") || defaultAnalysis.includedInfo,
    legalNoticeCount: legalNoticeCount || defaultAnalysis.legalNoticeCount,
    confidence: defaultAnalysis.confidence,
    keyNumbersPreview: defaultAnalysis.keyNumbersPreview,
    coreNumbers: {
      baseRate: baseRate || defaultAnalysis.coreNumbers.baseRate,
      preferentialRate: preferentialRate || defaultAnalysis.coreNumbers.preferentialRate,
      term: term || defaultAnalysis.coreNumbers.term,
      protection: protection || defaultAnalysis.coreNumbers.protection,
      earlyWithdrawal: /중도해지|해지/.test(normalized)
        ? "가입기간별 차등 적용"
        : defaultAnalysis.coreNumbers.earlyWithdrawal,
    },
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
