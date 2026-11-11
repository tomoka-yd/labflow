import { useState } from "react";
import { useParams } from "react-router";
import { z } from "zod";
import { editFormSchema, isExperimentStatus } from "../types/experiment";
import type { Experiment, EditFormValues } from "../types/experiment";
import { statusLabels } from "@/constants/experiment";
import { useExperiment } from "@/hooks/useExperiment";
import { createRun } from "@/utils/createRun";
import RunCreateDialog from "@/components/RunCreateDialog";
import { RunDetailPanel } from "@/components/RunDetailPanel";

// 実験データから編集フォームの初期値を作る
function createEditForm(experiment: Experiment): EditFormValues {
  return {
    name: experiment.name,
    description: experiment.description,
    status: experiment.status,
    sampleName: experiment.sampleName ?? "",
    plannedStartDate: experiment.plannedStartDate ?? "",
    plannedEndDate: experiment.plannedEndDate ?? "",
    memo: experiment.memo,
  };
}

function ExperimentDetail() {
  // Contextから共有データを取得
  const { experiments, openExperimentList, updateExperiment, addRun } =
    useExperiment();

  // 選択された実験をURLのIDから取得
  const { id } = useParams();
  // 選択された実験の情報
  const experiment = experiments.find((experiment) => experiment.id === id);

  // 編集モードか閲覧モードか (false：閲覧モード true：編集モード)
  const [isEditing, setIsEditing] = useState(false);

  // Run追加フォーム表示/非表示 (false：非表示 true：表示)
  const [isAddRunModalOpen, setIsAddRunModalOpen] = useState(false);

  // 編集中のステータスを管理するstate
  const [form, setForm] = useState<EditFormValues>({
    name: experiment?.name ?? "",
    description: experiment?.description ?? "",
    status: experiment?.status ?? "planned",
    sampleName: experiment?.sampleName ?? "",
    plannedStartDate: experiment?.plannedStartDate ?? "",
    plannedEndDate: experiment?.plannedEndDate ?? "",
    memo: experiment?.memo ?? "",
  });

  // 実験名がない時のエラー
  const [nameError, setNameError] = useState<string | null>(null);

  // 選択されたRunの情報
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  if (!experiment) {
    return <p>実験が見つかりません。</p>;
  }
  // 現在のラベル名
  const currentStatusLabel = statusLabels[experiment.status];

  // クリックして選択したRun
  const selectedRun = experiment.runs.find((run) => run.id === selectedRunId);

  return (
    <div>
      <button type="button" onClick={openExperimentList}>
        ← 実験一覧へ戻る
      </button>

      <h2>{experiment.name}</h2>
      <p>ステータス：{currentStatusLabel}</p>
      <p>概要：{experiment.description || "未入力"}</p>
      <p>サンプル名：{experiment.sampleName || "未入力"}</p>
      <p>開始予定日：{experiment.plannedStartDate || "未入力"}</p>
      <p>終了予定日：{experiment.plannedEndDate || "未入力"}</p>
      <p>メモ：{experiment.memo || "未入力"}</p>
      <div className="flex items-center justify-between">
        <h3>Run一覧</h3>
        <button type="button" onClick={() => setIsAddRunModalOpen(true)}>
          Runを追加
        </button>
      </div>

      {experiment.runs.length === 0 ? (
        <p>Runがまだありません</p>
      ) : (
        experiment.runs.map((run) => (
          <button
            className="flex "
            type="button"
            key={run.id}
            onClick={() => setSelectedRunId(run.id)}
          >
            {run.name}
          </button>
        ))
      )}

      {selectedRun && (
        <RunDetailPanel
          run={selectedRun}
          onClose={() => setSelectedRunId(null)}
        />
      )}

      {/* Run追加時のモーダル */}
      {isAddRunModalOpen && (
        <RunCreateDialog
          onCreate={(name, memo) => {
            const newRun = createRun(name, memo);
            addRun(experiment.id, newRun);
            setIsAddRunModalOpen(false);
          }}
          onCancel={() => setIsAddRunModalOpen(false)}
        />
      )}

      {/* 詳細編集時のモーダル */}
      {isEditing ? (
        <div>
          <label htmlFor="name">実験名:</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              setNameError(null);
            }}
          />
          {nameError && <p role="alert">{nameError}</p>}
          <label htmlFor="status">ステータス：</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => {
              const value = e.target.value;
              // 型の絞り込み
              if (isExperimentStatus(value))
                setForm((prev) => ({ ...prev, status: value }));
            }}
          >
            <option value="planned">予定</option>
            <option value="inProgress">進行中</option>
            <option value="waitingForData">データ待ち</option>
            <option value="paused">中断</option>
            <option value="cancelled">中止</option>
            <option value="completed">完了</option>
          </select>
          <label htmlFor="description">概要：</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
          <label htmlFor="sample-name">サンプル名：</label>
          <input
            id="sample-name"
            type="text"
            value={form.sampleName}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, sampleName: e.target.value }));
            }}
          />
          <label htmlFor="planned-start-date">開始予定日：</label>
          <input
            id="planned-start-date"
            type="date"
            value={form.plannedStartDate}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                plannedStartDate: e.target.value,
              }));
            }}
          />
          <label htmlFor="planned-end-date">終了予定日：</label>
          <input
            id="planned-end-date"
            type="date"
            value={form.plannedEndDate}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, plannedEndDate: e.target.value }));
            }}
          />
          <label htmlFor="memo">メモ：</label>
          <textarea
            id="memo"
            value={form.memo}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, memo: e.target.value }));
            }}
          />
          <button
            type="button"
            onClick={() => {
              setForm(createEditForm(experiment));
              setIsEditing(false);
            }}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => {
              const result = editFormSchema.safeParse(form);
              if (!result.success) {
                const message =
                  z.flattenError(result.error).fieldErrors.name?.[0] ?? null;
                setNameError(message);
                return;
              }
              setNameError(null);
              updateExperiment(experiment.id, result.data);
              setIsEditing(false);
            }}
          >
            保存する
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setForm(createEditForm(experiment));
            setIsEditing(true);
          }}
        >
          編集する
        </button>
      )}
    </div>
  );
}

export default ExperimentDetail;
