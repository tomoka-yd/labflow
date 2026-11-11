import { z } from "zod";

// スキーマ定義
export const experimentStatusSchema = z.enum([
  "planned",
  "inProgress",
  "paused",
  "cancelled",
  "waitingForData",
  "completed",
]);
export const processStatusSchema = z.enum(["planned", "completed"]);

export const changeHistorySchema = z.object({
  prevExperimenterId: z.string(),
  newExperimenterId: z.string(),
  handoverDate: z.string(),
});

export const baseProcessSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: processStatusSchema,
  completedAt: z.string().nullable(),
  memo: z.string(),
});

export const eventProcessSchema = baseProcessSchema.extend({
  type: z.literal("event"),
  plannedDate: z.string().nullable(),
  actualDate: z.string().nullable(),
});

export const periodProcessSchema = baseProcessSchema.extend({
  type: z.literal("period"),
  plannedStartDate: z.string().nullable(),
  plannedEndDate: z.string().nullable(),
  actualStartDate: z.string().nullable(),
  actualEndDate: z.string().nullable(),
});

export const processSchema = z.discriminatedUnion("type", [
  eventProcessSchema,
  periodProcessSchema,
]);

export const experimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  deletedAt: z.string().nullable(),
  status: experimentStatusSchema,
  experimenterId: z.string().nullable(),
  collaboratorIds: z.array(z.string()),
  history: z.array(changeHistorySchema),
  sampleName: z.string().nullable(),
  plannedStartDate: z.string().nullable(),
  plannedEndDate: z.string().nullable(),
  actualStartDate: z.string().nullable(),
  actualEndDate: z.string().nullable(),
  memo: z.string(),
  processes: z.array(processSchema),
});

export const experimentFormSchema = experimentSchema
  .pick({
    name: true,
    description: true,
    sampleName: true,
    plannedStartDate: true,
    plannedEndDate: true,
    memo: true,
  })
  .extend({
    name: z.string().trim().min(1, {error: "実験名を入力してください"}),
    sampleName: z.string(),
    plannedStartDate: z.string(),
    plannedEndDate: z.string(),
  });

export const editFormSchema = experimentFormSchema.extend({
  status: experimentStatusSchema,
});

// タイプ定義
export type ExperimentStatus = z.infer<typeof experimentStatusSchema>;

export type ProcessStatus = z.infer<typeof processStatusSchema>;

export type ChangeHistory = z.infer<typeof changeHistorySchema>;

export type BaseProcess = z.infer<typeof baseProcessSchema>;

export type EventProcess = z.infer<typeof eventProcessSchema>;

export type PeriodProcess = z.infer<typeof periodProcessSchema>;

export type Process = z.infer<typeof processSchema>;

export type Experiment = z.infer<typeof experimentSchema>;

export type ExperimentCreateProps = {
  onAddExperiment: (experiment: Experiment) => void;
  onCancel: () => void;
};

export type ExperimentFormValues = z.infer<typeof experimentFormSchema>;

export type EditFormValues = z.infer<typeof editFormSchema>;

// void は「この関数の戻り値は使わない」という意味で使う型

export function isExperimentStatus(value: string): value is ExperimentStatus {
  return experimentStatusSchema.safeParse(value).success;
}
