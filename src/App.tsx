import { useState } from "react";
import { initialExperiments } from "./data/experiments";
import type { Experiment, ExperimentStatus } from "./types/experiment";
import ConfirmDialog from "./components/ConfirmDialog";
import { Outlet, useNavigate } from "react-router";
import { ExperimentContext } from "./contexts/ExperimentContext";

// 変更申請ボックスに入れられる型
type PendingStatusChange = {
  experimentId: string;
  newStatus: ExperimentStatus;
};

function App() {
  // 実験データ
  const [experiments, setExperiments] =
    useState<Experiment[]>(initialExperiments);
  // 実験一覧の選択中タブ
  const [activeStatusTab, setActiveStatusTab] =
    useState<ExperimentStatus>("planned");
  // 変更待ちの実験IDとそのステータス
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PendingStatusChange | null>(null);
  // 確認待ちの変更内容
  const pendingExperiment = experiments.find(
    (experiment) => experiment.id === pendingStatusChange?.experimentId,
  );
  // 画面遷移用関数の呼び込み
  const navigate = useNavigate();

  // 【Dashboardのカードから実験一覧へ移動】
  function openExperimentTab(tab: ExperimentStatus) {
    // クリックしたステータスタブを選択、stateに保存
    setActiveStatusTab(tab);
    // Experiments画面へ移動
    navigate("/experiments");
  }

  // 【実験一覧を開く】
  function openExperimentList() {
    navigate("/experiments");
  }

  // 【指定したIDの実験だけステータスを変更した新しい配列を作る】
  function updateExperimentStatus(id: string, status: ExperimentStatus) {
    const updateExperiments = experiments.map((experiment) =>
      experiment.id === id ? { ...experiment, status } : experiment,
    );
    setExperiments(updateExperiments);
  }

  // 【選択した実験の詳細画面を開く】
  function openExperimentDetail(id: string) {
    navigate(`/experiments/${id}`);
  }

  // 【新規登録画面を開く】
  function openExperimentCreate() {
    navigate("/experiments/create");
  }

  // 【新規登録する】
  function addExperiment(newExperiment: Experiment) {
    // 既存のexperimentsにnewExperimentを追加した新しい配列を作る
    // setExperimentsでstateを更新する
    setExperiments((prev) => [...prev, newExperiment]);

    // 実験一覧へ戻る
    navigate("/experiments");
  }

  // 【変更申請受付】
  function requestStatusChange(id: string, status: ExperimentStatus) {
    setPendingStatusChange({ experimentId: id, newStatus: status });
    console.log("Appに届いた！", id, status);
  }

  // 【確認待ちの変更内容を破棄する】
  function cancelStatusChange() {
    setPendingStatusChange(null);
  }

  // 【確認待ちの変更を確定する】
  function confirmStatusChange() {
    // ① 確認待ちの変更内容がなければ何もしない
    if (pendingStatusChange === null) return;
    // ② updateExperimentStatus() で更新する
    updateExperimentStatus(
      pendingStatusChange.experimentId,
      pendingStatusChange.newStatus,
    );
    // ③ 確認待ちの情報を破棄する
    setPendingStatusChange(null);
  }

  console.log("pendingStatusChange:", pendingStatusChange);
  console.log("pendingExperiment:", pendingExperiment);

  // 【画面表示】
  return (
    <ExperimentContext
      value={{
        experiments,
        activeStatusTab,
        setActiveStatusTab,
        openExperimentTab,
        openExperimentList,
        openExperimentDetail,
        openExperimentCreate,
        addExperiment,
        updateExperimentStatus,
        requestStatusChange,
      }}
    >
      <div className="min-h-screen bg-background">
        <Outlet />

        {pendingStatusChange !== null && pendingExperiment !== undefined && (
          <ConfirmDialog
            experimentName={pendingExperiment.name}
            currentStatus={pendingExperiment.status}
            newStatus={pendingStatusChange.newStatus}
            onConfirm={confirmStatusChange}
            onCancel={cancelStatusChange}
          />
        )}
      </div>
    </ExperimentContext>
  );
}

export default App;
