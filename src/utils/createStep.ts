import type { Step } from "../types/experiment";

// 新規作成時に受け取る入力の型
type CreateStepInput =
  | {
      type: "event";
      name: string;
      memo: string;
      plannedDate: string | null;
    }
  | {
      type: "period";
      name: string;
      memo: string;
      plannedStartDate: string | null;
      plannedEndDate: string | null;
    };

export function createStep(input: CreateStepInput): Step {
  // 共通項目を作る
  const base = {
    // 関数内で自動生成
    id: crypto.randomUUID(),
    // 入力から受け取る
    name: input.name.trim(),
    memo: input.memo.trim(),
    // 関数内で初期値を設定
    status: "planned" as const,
    completedAt: null,
  };
  // input.type で分岐する
  if (input.type === "event") {
    const eventStep = {
      ...base,
      type: "event" as const,
      plannedDate: input.plannedDate,
      actualDate: null,
    };

    // Stepを返す
    return eventStep;
  } else {
    const periodStep = {
      ...base,
      type: "period" as const,
      plannedStartDate: input.plannedStartDate,
      plannedEndDate: input.plannedEndDate,
      actualStartDate: null,
      actualEndDate: null,
    };

    // Stepを返す
    return periodStep;
  }
}
