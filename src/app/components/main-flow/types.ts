export type FlowStep = 1 | 2 | 3 | 4 | 5;

export type StepNavigationProps = {
  onBack?: () => void;
  onNext: () => void;
};
