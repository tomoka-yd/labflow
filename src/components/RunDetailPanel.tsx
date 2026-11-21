import type { Run } from "@/types/experiment";
import { phaseNameSchema, stepNameSchema } from "@/types/experiment";
import type { StepFormValues } from "@/types/experiment";
import { useRef, useEffect, useState } from "react";

type RunDetailPanelProps = {
  run: Run;
  onClose: () => void;
  onAddPhase: (name: string, memo: string) => void;
  onAddStep: (phaseId: string, stepInput: StepFormValues) => void;
};

export function RunDetailPanel({
  run,
  onClose,
  onAddPhase,
  onAddStep,
}: RunDetailPanelProps) {
  const [isAddPhaseFormOpen, setIsAddPhaseFormOpen] = useState(false);
  // 入力値の状態
  const [phaseName, setPhaseName] = useState<string>("");
  const [phaseMemo, setPhaseMemo] = useState<string>("");

  // 実験名がない時のエラー
  const [phaseNameError, setPhaseNameError] = useState<string | null>(null);
  const [stepNameError, setStepNameError] = useState<string | null>(null);

  // 選んだPhaseの情報
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

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

  // step編集初期値
  const initialStepForm: StepFormValues = {
    name: "",
    type: "event",
    plannedDate: "",
    plannedStartDate: "",
    plannedEndDate: "",
    memo: "",
  };

  // step編集
  const [stepForm, setStepForm] = useState<StepFormValues>(initialStepForm);

  function handleAddCancel() {
    setIsAddPhaseFormOpen(false);
    setPhaseNameError(null);
  }

  function handleAddPhase() {
    const result = phaseNameSchema.safeParse(phaseName);
    if (!result.success) {
      setPhaseNameError(result.error.issues[0]?.message ?? null);
      return;
    }

    onAddPhase(phaseName.trim(), phaseMemo.trim());

    setPhaseName("");
    setPhaseMemo("");
    setPhaseNameError(null);
    setIsAddPhaseFormOpen(false);
  }

  function handleCancelStep() {
    setStepForm(initialStepForm);
    setStepNameError(null);
    setSelectedPhaseId(null);
  }

  function handleAddStep() {
    const result = stepNameSchema.safeParse(stepForm.name);
    if (!result.success) {
      setStepNameError(result.error.issues[0]?.message ?? null);
      return;
    }

    if (!selectedPhaseId) return;

    onAddStep(selectedPhaseId, stepForm);
    setStepNameError(null);
    // 入力内容を初期化
    setStepForm(initialStepForm);
    // 選択中のPhaseを解除してフォームを閉じる
    setSelectedPhaseId(null);
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
                  <p>Phase名:{phase.name}</p>
                  <p>メモ：{phase.memo || "未入力"}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                  >
                    Stepを追加する
                  </button>
                  {phase.steps.length === 0 ? (
                    <p>Stepはまだありません</p>
                  ) : (
                    phase.steps.map((step) => (
                      <div key={step.id}>
                        <p>{step.name}</p>
                        <p>{step.status}</p>
                        <p>{step.memo}</p>
                        {step.type === "event" && (
                          <div>
                            <p>予定日：{step.plannedDate || "未入力"}</p>
                            <p>実施日：{step.actualDate || "未入力"}</p>
                          </div>
                        )}
                        {step.type === "period" && (
                          <div>
                            <p>
                              開始予定日：{step.plannedStartDate || "未入力"}
                            </p>
                            <p>終了予定日：{step.plannedEndDate || "未入力"}</p>
                            <p>開始日：{step.actualStartDate || "未入力"}</p>
                            <p>終了日：{step.actualEndDate || "未入力"}</p>
                          </div>
                        )}
                        <p>完了日：{step.completedAt || "未入力"}</p>
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </div>
          {selectedPhaseId && (
            <div>
              <h3>Step追加フォーム</h3>
              <p>選択中のPhase ID：{selectedPhaseId}</p>
              <div className="flex flex-col">
                <label htmlFor="step-name">Step名:</label>
                <input
                  type="text"
                  name="step-name"
                  id="step-name"
                  value={stepForm.name}
                  onChange={(e) =>
                    setStepForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                {stepNameError && <p role="alert">{stepNameError}</p>}
                <label htmlFor="step-memo">メモ：</label>
                <textarea
                  name="step-memo"
                  id="step-memo"
                  value={stepForm.memo}
                  onChange={(e) =>
                    setStepForm((prev) => ({ ...prev, memo: e.target.value }))
                  }
                ></textarea>
                <fieldset>
                  <legend>Stepの種類</legend>
                  <div>
                    <input
                      type="radio"
                      name="step-type"
                      id="step-type-event"
                      value="event"
                      checked={stepForm.type === "event"}
                      onChange={() =>
                        setStepForm((prev) => ({ ...prev, type: "event" }))
                      }
                    />
                    <label htmlFor="step-type-event">単日</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="step-type"
                      id="step-type-period"
                      value="period"
                      checked={stepForm.type === "period"}
                      onChange={() =>
                        setStepForm((prev) => ({ ...prev, type: "period" }))
                      }
                    />
                    <label htmlFor="step-type-period">期間</label>
                  </div>
                </fieldset>
                {stepForm.type === "event" ? (
                  <div>
                    <label htmlFor="step-event-date">予定日：</label>
                    <input
                      type="date"
                      name="step-event-date"
                      id="step-event-date"
                      value={stepForm.plannedDate}
                      onChange={(e) =>
                        setStepForm((prev) => ({
                          ...prev,
                          plannedDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="step-period-start-date">開始予定日：</label>
                    <input
                      type="date"
                      name="step-period-start-date"
                      id="step-period-start-date"
                      value={stepForm.plannedStartDate}
                      onChange={(e) =>
                        setStepForm((prev) => ({
                          ...prev,
                          plannedStartDate: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="step-period-end-date">終了予定日：</label>
                    <input
                      type="date"
                      name="step-period-end-date"
                      id="step-period-end-date"
                      value={stepForm.plannedEndDate}
                      onChange={(e) =>
                        setStepForm((prev) => ({
                          ...prev,
                          plannedEndDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <button type="button" onClick={handleCancelStep}>
                キャンセル
              </button>
              <button
                type="button"
                className="create-button"
                onClick={handleAddStep}
              >
                追加する
              </button>
            </div>
          )}
          {isAddPhaseFormOpen && (
            <div>
              <label htmlFor="phase-name">Phase名:</label>
              <input
                type="text"
                name="phase-name"
                id="phase-name"
                value={phaseName}
                onChange={(e) => {
                  setPhaseName(e.target.value);
                }}
              />
              {phaseNameError && <p role="alert">{phaseNameError}</p>}
              <label htmlFor="phase-memo">メモ:</label>
              <textarea
                name="phase-memo"
                id="phase-memo"
                value={phaseMemo}
                onChange={(e) => {
                  setPhaseMemo(e.target.value);
                }}
              />

              <button
                type="button"
                className="cancel-button"
                onClick={handleAddCancel}
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
