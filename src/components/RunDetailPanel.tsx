import type { Run } from "@/types/experiment";

type RunDetailPanelProps = {
  run: Run;
  onClose: () => void;
};

export function RunDetailPanel({ run, onClose }: RunDetailPanelProps) {
  return (
    <div>
      <button
        type="button"
        className="overlay fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-label="詳細を閉じる"
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-lg h-dvh bg-surface z-50 shadow-xl overflow-y-auto">
        <div className="panel_inner flex items-start justify-between gap-8">
          <div>
            <p>{run.name}</p>
            <p>{run.memo}</p>
          </div>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
