import type { Experiment, ExperimentFormValues } from "../types/experiment";

export function createExperiment(form: ExperimentFormValues): Experiment {
  return {
    id: crypto.randomUUID(),
    name: form.name.trim(),
    description: form.description,
    deletedAt: null,
    status: "planned",
    experimenterId: null,
    collaboratorIds: [],
    history: [],
    sampleName: form.sampleName || null,
    plannedStartDate: form.plannedStartDate || null,
    plannedEndDate: form.plannedEndDate || null,
    actualStartDate: null,
    actualEndDate: null,
    memo: form.memo,
    runs: [],
  };
}
