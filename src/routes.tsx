import App from "./App";
import { AppLayout } from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import ExperimentCreate from "./pages/ExperimentCreate";
import ExperimentDetail from "./pages/ExperimentDetails";
import ExperimentList from "./pages/ExperimentList";
import { createBrowserRouter } from "react-router";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "experiments", element: <ExperimentList /> },
          { path: "experiments/create", element: <ExperimentCreate /> },
          { path: "experiments/:id", element: <ExperimentDetail /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
