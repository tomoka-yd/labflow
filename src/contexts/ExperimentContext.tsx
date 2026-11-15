import type { Dispatch, SetStateAction } from "react";
import type { EditFormValues, Experiment, ExperimentStatus, Phase, Run, Step } from "../types/experiment";
import { createContext } from "react";

export type ExperimentContextValue = {
  experiments: Experiment[];
  activeStatusTab: ExperimentStatus;
  setActiveStatusTab: Dispatch<SetStateAction<ExperimentStatus>>;
  openExperimentTab: (tab: ExperimentStatus) => void;
  openExperimentList: () => void;
  openExperimentDetail: (id: string) => void;
  openExperimentCreate: () => void;
  addExperiment: (newExperiment: Experiment) => void;
  updateExperiment: (id: string, form: EditFormValues) => void;
  updateExperimentStatus: (id: string, status: ExperimentStatus) => void;
  addRun: (id: string, run: Run) => void;
  addPhase:(experimentId: string, runId: string, phase: Phase) => void;
  addStep: (experimentId: string, runId: string, phaseId: string, step: Step) => void;
  requestStatusChange: (id: string, status: ExperimentStatus) => void;
};

export const ExperimentContext = createContext<ExperimentContextValue | null>(
  null,
);
