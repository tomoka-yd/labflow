import { statusLabels } from "@/constants/experiment";
import type { ExperimentStatus } from "../types/experiment";
import { isExperimentStatus } from "../types/experiment";
import { useExperiment } from "@/hooks/useExperiment";

function ExperimentList() {
  // Contextから共有データを取得
  const {
    experiments,
    activeStatusTab,
    setActiveStatusTab,
    openExperimentDetail,
    openExperimentCreate,
    requestStatusChange,
  } = useExperiment();

  const tabs: ExperimentStatus[] = [
    "planned",
    "inProgress",
    "waitingForData",
    "paused",
    "cancelled",
    "completed",
  ];

  // 現在のタブ名
  const currentTabLabel = statusLabels[activeStatusTab];

  // 実験を絞り込む
  const filteredExperiments = experiments.filter(
    (experiment) => experiment.status === activeStatusTab,
  );

  const statusOptions: {
    value: ExperimentStatus;
    label: string;
  }[] = Object.entries(statusLabels).map(([value, label]) => ({
    value: value as ExperimentStatus,
    label,
  }));

  // タブと実験一覧を表示
  return (
    <div>
      <div className="status-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveStatusTab(tab)}
            className={tab === activeStatusTab ? "active" : ""}
          >
            {statusLabels[tab]}
          </button>
        ))}
      </div>

      <h2>実験一覧：{currentTabLabel}</h2>

      <button type="button" onClick={openExperimentCreate}>
        ＋ 新規実験登録
      </button>

      {filteredExperiments.length === 0 ? (
        <p>該当する実験はありません。</p>
      ) : (
        <ul>
          {filteredExperiments.map((experiment) => (
            <li key={experiment.id}>
              <button
                type="button"
                onClick={() => openExperimentDetail(experiment.id)}
              >
                {experiment.name}
              </button>
              <select
                value={experiment.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  // newStatusが有効なExperimentStatusか、現在のステータスと異なるか確認
                  if (
                    isExperimentStatus(newStatus) &&
                    newStatus !== experiment.status
                  ) {
                    console.log("変更された！", e.target.value);
                    requestStatusChange(experiment.id, newStatus);
                  }
                }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExperimentList;
