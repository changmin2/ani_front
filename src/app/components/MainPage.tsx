import { useState } from "react";
import { ServiceIntro } from "./ServiceIntro";
import { UsageGuide } from "./UsageGuide";
import { ContactSupport } from "./ContactSupport";
import { FlowHeader } from "./main-flow/shared/FlowHeader";
import { FlowStepper } from "./main-flow/shared/FlowStepper";
import { StepFiveReport } from "./main-flow/steps/StepFiveReport";
import { StepFourReview } from "./main-flow/steps/StepFourReview";
import { StepOneUpload } from "./main-flow/steps/StepOneUpload";
import { StepThreeProcessing } from "./main-flow/steps/StepThreeProcessing";
import { StepTwoRecommendation } from "./main-flow/steps/StepTwoRecommendation";
import type { FlowExecutionSettings, FlowInput, FlowStep, TranslationResult, ValidationResult } from "./main-flow/types";

export function MainPage() {
  const [view, setView] = useState<"flow" | "intro" | "guide" | "contact">("flow");
  const [step, setStep] = useState<FlowStep>(1);
  const [flowInput, setFlowInput] = useState<FlowInput | null>(null);
  const [executionSettings, setExecutionSettings] =
    useState<FlowExecutionSettings | null>(null);
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const handleInputComplete = (input: FlowInput) => {
    // 새 문서를 분석하면 이전 문서의 하위 단계 결과(설정/번역/검수)는 모두 무효이므로 초기화한다.
    // 초기화하지 않으면 새 파일을 올려도 4·5페이지에 이전 문서의 번역/검수 결과가 남아 표시된다.
    setFlowInput(input);
    setExecutionSettings(null);
    setTranslationResult(null);
    setValidationResult(null);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <FlowHeader
        activeView={view}
        onGoHome={() => {
          setView("flow");
          setStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onShowIntro={() => {
          setView("intro");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onShowGuide={() => {
          setView("guide");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onShowContact={() => {
          setView("contact");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      {view === "intro" && <ServiceIntro onStart={() => setView("flow")} />}
      {view === "guide" && (
        <UsageGuide
          onStart={() => {
            setView("flow");
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {view === "contact" && (
        <ContactSupport
          onShowGuide={() => {
            setView("guide");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {view === "flow" && step > 1 && <FlowStepper current={step} />}
      {view === "flow" && step === 1 && <StepOneUpload onNext={handleInputComplete} />}
      {view === "flow" && step === 2 && (
        <StepTwoRecommendation
          onBack={() => setStep(1)}
          onNext={(settings) => {
            setExecutionSettings(settings);
            setStep(3);
          }}
          input={flowInput}
        />
      )}
      {view === "flow" && step === 3 && (
        <StepThreeProcessing
          onBack={() => setStep(2)}
          onNext={(result, validation) => {
            setTranslationResult(result);
            setValidationResult(validation);
            setStep(4);
          }}
          input={flowInput}
          settings={executionSettings}
        />
      )}
      {view === "flow" && step === 4 && (
        <StepFourReview
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
          input={flowInput}
          translationResult={translationResult}
          validationResult={validationResult}
        />
      )}
      {view === "flow" && step === 5 && (
        <StepFiveReport
          onBack={() => setStep(4)}
          input={flowInput}
          settings={executionSettings}
        />
      )}
    </div>
  );
}
