import type { Run } from "@/types/experiment";
import { phaseNameSchema } from "@/types/experiment";
import { useRef, useEffect, useState } from "react";

type RunDetailPanelProps = {
  run: Run;
  onClose: () => void;
  onAddPhase: (name: string, memo: string) => void;
};

export function RunDetailPanel({
  run,
  onClose,
  onAddPhase,
}: RunDetailPanelProps) {
  const [isAddPhaseFormOpen, setIsAddPhaseFormOpen] = useState(false);
  const [phaseName, setPhaseName] = useState<string>("");
  const [phaseMemo, setPhaseMemo] = useState<string>("");
  // 実験名がない時のエラー
  const [nameError, setNameError] = useState<string | null>(null);

  const runDetailPanelRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = runDetailPanelRef.current;
    // ↓ <dialog>を参照できなかったら処理を終了
    if (!dialog) return;
    // ↓ モーダルとして開く
    dialog.showModal();
    // ↓ クリーンアップ時（アンマウント時）に閉じる
    return () => {
      dialog.close();
    };
  }, []);

  function handleCancel() {
    setIsAddPhaseFormOpen(false);
    setNameError(null);
  }

  function handleAddPhase() {
    const result = phaseNameSchema.safeParse(phaseName);
    if (!result.success) {
      setNameError(result.error.issues[0]?.message ?? null);
      return;
    }

    onAddPhase(phaseName.trim(), phaseMemo.trim());

    setPhaseName("");
    setPhaseMemo("");
    setNameError(null);
    setIsAddPhaseFormOpen(false);
  }

  return (
    <div>
      <dialog
        ref={runDetailPanelRef}
        className="detail-dialog fixed inset-y-0 right-0 left-auto m-0 w-full max-w-lg h-dvh bg-surface z-50 shadow-xl overflow-y-auto backdrop:bg-black/40"
      >
        <div className="panel_inner flex flex-col items-start justify-between gap-8">
          <div>
            <h3>{run.name}</h3>
            <p>{run.memo}</p>
          </div>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
          <div className="w-full flex items-start justify-between">
            <p>Phase一覧</p>
            <button type="button" onClick={() => setIsAddPhaseFormOpen(true)}>
              Phaseを追加する
            </button>
          </div>
          <div>
            {run.phases.length === 0 ? (
              <p>Phaseはまだありません</p>
            ) : (
              run.phases.map((phase) => (
                <div key={phase.id}>
                  <p>{phase.name}</p>
                  <p>{phase.memo}</p>
                </div>
              ))
            )}
          </div>
          {isAddPhaseFormOpen && (
            <div>
              <label htmlFor="phase-name">Phase名:</label>
              <input
                type="text"
                id="phase-name"
                value={phaseName}
                onChange={(e) => {
                  setPhaseName(e.target.value);
                }}
              />
              {nameError && <p role="alert">{nameError}</p>}
              <label htmlFor="phase-memo">メモ:</label>
              <textarea
                id="phase-memo"
                value={phaseMemo}
                onChange={(e) => {
                  setPhaseMemo(e.target.value);
                }}
              />

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="create-button"
                onClick={handleAddPhase}
              >
                追加する
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
