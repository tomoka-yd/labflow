import { useState } from "react";
import { z } from "zod";
import { createExperiment } from "../utils/createExperiment";
import { useExperiment } from "@/hooks/useExperiment";
import { experimentFormSchema } from "@/types/experiment";

function ExperimentCreate() {
  // Contextから共有データを取得
  const { addExperiment, openExperimentList } = useExperiment();
  const [form, setForm] = useState({
    name: "",
    description: "",
    sampleName: "",
    plannedStartDate: "",
    plannedEndDate: "",
    memo: "",
  });
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSubmit() {
    // Zodで入力内容を検証する
    const result = experimentFormSchema.safeParse(form);

    // 検証失敗なら終了
    if (!result.success) {
      const message =
        z.flattenError(result.error).fieldErrors.name?.[0] ?? null;
      setNameError(message);
      return;
    }

    // 検証済みデータから実験を生成する
    const newExperiment = createExperiment(result.data);
    addExperiment(newExperiment);
  }

  return (
    <div>
      <h2>新規実験登録</h2>

      <label htmlFor="experiment-name">実験名</label>
      <input
        id="experiment-name"
        type="text"
        value={form.name}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, name: e.target.value }));
          setNameError(null);
        }}
      />
      {nameError && <p role="alert">{nameError}</p>}

      <label htmlFor="experiment-description">概要</label>
      <textarea
        id="experiment-description"
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <label htmlFor="experiment-sample">サンプル名</label>
      <input
        id="experiment-sample"
        type="text"
        value={form.sampleName}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, sampleName: e.target.value }))
        }
      />

      <label htmlFor="experiment-start">開始予定日</label>
      <input
        id="experiment-start"
        type="date"
        value={form.plannedStartDate}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, plannedStartDate: e.target.value }))
        }
      />

      <label htmlFor="experiment-end">完了予定日</label>
      <input
        id="experiment-end"
        type="date"
        value={form.plannedEndDate}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, plannedEndDate: e.target.value }))
        }
      />

      <label htmlFor="experiment-memo">メモ</label>
      <textarea
        id="experiment-memo"
        value={form.memo}
        onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
      />

      <button type="button" onClick={handleSubmit}>
        登録する
      </button>

      <button type="button" onClick={openExperimentList}>
        キャンセル
      </button>
    </div>
  );
}

export default ExperimentCreate;
