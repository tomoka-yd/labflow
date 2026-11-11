import type { ExperimentStatus } from "@/types/experiment";

export const statusLabels: Record<ExperimentStatus, string> = {
  // ここに6種類の日本語ラベルを定義
  planned: "予定",
  inProgress: "進行中",
  waitingForData: "データ待ち",
  paused: "中断",
  cancelled: "中止",
  completed: "完了",
};
