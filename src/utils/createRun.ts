import type { Run } from "../types/experiment";

export function createRun(name: string, memo: string): Run {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    memo: memo.trim(),
    phases: [],
  };
}
