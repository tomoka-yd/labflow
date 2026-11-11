import { useState } from "react";
import { useParams } from "react-router";
import { isExperimentStatus } from "../types/experiment";
import type { Experiment, EditFormValues } from "../types/experiment";
import  {statusLabels} from "@/constants/experiment";
import { useExperiment } from "@/hooks/useExperiment";

function ExperimentDetail() {
  // Contextから共有データを取得
  const { experiments, updateExperimentStatus, openExperimentList } =
    useExperiment();

  // 選択された実験をURLのIDから取得
  const { id } = useParams();

  // 選択された実験の情報
  const experiment = experiments.find((experiment) => experiment.id === id);

  // 編集モードか閲覧モードか (false：閲覧モード true：編集モード)
  const [isEditing, setIsEditing] = useState(false);

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


  if (!experiment) {
    return <p>実験が見つかりません。</p>;
  }
  // 現在のラベル名
  const currentStatusLabel = statusLabels[experiment.status];

  return (
    <div>
      <button type="button" onClick={openExperimentList}>
        ← 実験一覧へ戻る
      </button>

      <h2>{experiment.name}</h2>
      <p>ステータス：{currentStatusLabel}</p>
      <p>概要：{experiment.description || "未入力"}</p>
      <p>サンプル名：{experiment.sampleName ?? "未入力"}</p>
      <p>開始予定日：{experiment.plannedStartDate ?? "未入力"}</p>
      <p>終了予定日：{experiment.plannedEndDate ?? "未入力"}</p>
      <p>メモ：{experiment.memo || "未入力"}</p>

      {isEditing ? (
        <div>
          <select
            value={form.status}
            onChange={(e) => {
              const value = e.target.value;
              if (isExperimentStatus(value)) setForm(value);
            }}
          >
            <option value="planned">予定</option>
            <option value="inProgress">進行中</option>
            <option value="waitingForData">データ待ち</option>
            <option value="paused">中断</option>
            <option value="cancelled">中止</option>
            <option value="completed">完了</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setDraftStatus(experiment.status);
              setIsEditing(false);
            }}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => {
              updateExperimentStatus(experiment.id, draftStatus);
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
            setDraftStatus(experiment.status);
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
