import { Outlet } from "react-router";

export function Content() {
  return (
    <main className="bg-surface p-6">
      <Outlet />
    </main>
  );
}
