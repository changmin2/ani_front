# BNK Global Localizer Agent – Frontend

금융문서 다국어 현지화 및 콘텐츠 제작 AI 에이전트의 프론트엔드 애플리케이션입니다.

## 프로젝트 소개

**BNK Global Localizer Agent**는 BNK금융그룹의 금융문서를 다국어로 번역·현지화하고, 금융 용어 검수 및 게시용 문안 생성까지 한 번에 지원하는 생성형 AI 기반 사내 업무 에이전트입니다.

이 저장소는 서비스의 **프론트엔드(React)** 프로젝트이며, 백엔드 API 서버(FastAPI)와 연동하여 동작합니다.

## 주요 기능

| 단계 | 기능 | 설명 |
|------|------|------|
| 1 | 문서 업로드 | 한국어 원문 문서 업로드 및 대상 언어·목적 선택 |
| 2 | AI 추천 설정 | 문서 유형별 톤 변환, 금융용어집 반영 옵션 설정 |
| 3 | 번역 및 검수 진행 | AI 기반 번역 처리 및 원문-번역문 자동 검수 시각화 |
| 4 | 결과 검토 | 핵심 정보 누락 여부, 위험 문구 표시, 수정 제안 |
| 5 | 최종 리포트 | 게시 채널별 문안 생성 및 최종 결과 리포트 제공 |

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI) |
| Routing | React Router 7 |
| Animation | Motion (Framer Motion) |
| Charts | Recharts |
| Icons | Lucide React |

## 프로젝트 구조

```
src/
├── main.tsx                    # 엔트리 포인트
├── app/
│   ├── App.tsx                 # 앱 루트 컴포넌트
│   ├── routes.ts               # 라우팅 설정
│   └── components/
│       ├── MainPage.tsx        # 메인 페이지
│       ├── Root.tsx            # 루트 레이아웃
│       ├── main-flow/          # 핵심 플로우 컴포넌트
│       │   ├── shared/         # 공통 UI (헤더, 스텝퍼 등)
│       │   └── steps/          # 각 단계별 화면
│       └── ui/                 # shadcn/ui 컴포넌트
├── assets/                     # 이미지 등 정적 자원
└── styles/                     # 글로벌 스타일
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 백엔드 연동

백엔드 API 서버(FastAPI)가 별도로 실행되어야 합니다. 백엔드 프로젝트 저장소를 참고하여 서버를 구동한 뒤, 프론트엔드에서 API를 호출할 수 있습니다.

## 디자인 참고

UI 디자인 시안은 [docs/ui_design](docs/ui_design) 디렉토리에서 확인할 수 있습니다.

## 관련 문서

- [아이디어 제안서](../ani_server/docs/아이디어_제안서.md)
- [UI 가이드라인](guidelines/Guidelines.md)
