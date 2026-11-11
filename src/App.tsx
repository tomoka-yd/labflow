import { Outlet } from "react-router";
import { ExperimentProvider } from "./contexts/ExperimentProvider";

function App() {
  // 【画面表示】
  return (
    <ExperimentProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </ExperimentProvider>
  );
}

export default App;
