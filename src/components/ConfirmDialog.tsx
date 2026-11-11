import { useRef, useEffect } from "react";
import type { ExperimentStatus } from "../types/experiment";

type ConfirmDialogProps = {
  experimentName: string; // 申請書の案件名
  currentStatus: ExperimentStatus; // 変更前の状態
  newStatus: ExperimentStatus; // 変更後の状態
  onConfirm: () => void; // 承認ボタン
  onCancel: () => void; // 却下ボタン
};

// 日本語表示用のラベル
const statusLabels: Record<ExperimentStatus, string> = {
  planned: "予定",
  inProgress: "進行中",
  paused: "中断",
  cancelled: "中止",
  waitingForData: "データ待ち",
  completed: "完了",
};

export default function ConfirmDialog({
  experimentName,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {

  // HTMLの<dialog>要素を参照
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    // ↓ <dialog>を参照できなかったら処理を終了
    if (!dialog) return;
    // ↓ モーダルとして開く
    dialog.showModal();
    // ↓ クリーンアップ時（アンマウント時）に閉じる
    return () => {
      dialog.close();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="confirm-dialog">
      <div className="dialog-inner">
        <h2>ステータスを変更しますか？</h2>
        <p>実験名：{experimentName}</p>
        <p>
          {statusLabels[currentStatus]} → {statusLabels[newStatus]}
        </p>
        <button type="button" className="cancel-button" onClick={onCancel}>
          キャンセル
        </button>
        <button type="button" className="confirm-button" onClick={onConfirm}>
          変更する
        </button>
      </div>
    </dialog>
  );
}
