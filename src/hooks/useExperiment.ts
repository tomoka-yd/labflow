import { useContext } from "react";
import { ExperimentContext } from "../contexts/ExperimentContext";

export function useExperiment() {
  // ① useContext() でContextを取得
  const context = useContext(ExperimentContext);

  // ② nullならErrorを投げる
  if (context === null) {
    throw new Error("ExperimentContextが提供されていません");
  }

  // ③ 問題なければContextを返す
  return context;
}
