import type { Phase } from "../types/experiment";

export function createPhase(name: string, memo: string): Phase {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    memo: memo.trim(),
    steps: [],
  };
}
