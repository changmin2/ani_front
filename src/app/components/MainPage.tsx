import { useState } from "react";
import { ServiceIntro } from "./ServiceIntro";
import { FlowHeader } from "./main-flow/shared/FlowHeader";
import { FlowStepper } from "./main-flow/shared/FlowStepper";
import { StepFiveReport } from "./main-flow/steps/StepFiveReport";
import { StepFourReview } from "./main-flow/steps/StepFourReview";
import { StepOneUpload } from "./main-flow/steps/StepOneUpload";
import { StepThreeProcessing } from "./main-flow/steps/StepThreeProcessing";
import { StepTwoRecommendation } from "./main-flow/steps/StepTwoRecommendation";
import type { FlowExecutionSettings, FlowInput, FlowStep, TranslationResult } from "./main-flow/types";

export function MainPage() {
  const [view, setView] = useState<"flow" | "intro">("flow");
  const [step, setStep] = useState<FlowStep>(1);
  const [flowInput, setFlowInput] = useState<FlowInput | null>(null);
  const [executionSettings, setExecutionSettings] =
    useState<FlowExecutionSettings | null>(null);
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);

  const handleInputComplete = (input: FlowInput) => {
    setFlowInput(input);
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
      />
      {view === "intro" && <ServiceIntro onStart={() => setView("flow")} />}
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
          onNext={(result) => {
            setTranslationResult(result);
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
        />
      )}
      {view === "flow" && step === 5 && <StepFiveReport onBack={() => setStep(4)} />}
    </div>
  );
}
