import StatusCard from "../components/StatusCard";
import type { ExperimentStatus } from "@/types/experiment";
import { useExperiment } from "@/hooks/useExperiment";
import { statusLabels } from "@/constants/experiment";

function Dashboard() {
  // Contextから共有データを取得
  const { experiments, openExperimentTab } = useExperiment();

  const statusCards = Object.entries(statusLabels).map(([tab, label]) => ({
    tab: tab as ExperimentStatus,
    label,
  }));

  // カードに表示するデータ
  type DashboardCard = {
    tab: ExperimentStatus;
    label: string;
    count: number;
  };

  // ステータス別に件数を集計し、新しい配列を作成
  const dashboardCards: DashboardCard[] = statusCards.map((card) => ({
    ...card,
    count: experiments.filter((experiment) => experiment.status === card.tab)
      .length,
  }));

  // カードを表示
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="status-cards">
        {dashboardCards.map((card) => (
          <StatusCard
            key={card.tab}
            label={card.label}
            count={card.count}
            onClick={() => openExperimentTab(card.tab)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
