import { useRef, useEffect, useState } from "react";

type RunCreateDialogProps = {
  onCreate: (name: string, memo: string) => void;
  onCancel: () => void;
};

export default function RunCreateDialog({
  onCreate,
  onCancel,
}: RunCreateDialogProps) {
  const [runName, setRunName] = useState("");
  const [runMemo, setRunMemo] = useState("");
  // HTMLの<dialog>要素を参照
  const runDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = runDialogRef.current;
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
    <dialog ref={runDialogRef} className="confirm-dialog">
      <div className="dialog-inner">
        <label htmlFor="run-name">Run名:</label>
        <input
          type="text"
          id="run-name"
          value={runName}
          onChange={(e) => {
            setRunName(e.target.value);
          }}
        />
        <label htmlFor="run-memo">メモ:</label>
        <textarea
          id="run-memo"
          value={runMemo}
          onChange={(e) => {
            setRunMemo(e.target.value);
          }}
        />

        <button type="button" className="cancel-button" onClick={onCancel}>
          キャンセル
        </button>
        <button
          type="button"
          className="create-button"
          onClick={() => onCreate(runName, runMemo)}
        >
          追加する
        </button>
      </div>
    </dialog>
  );
}
