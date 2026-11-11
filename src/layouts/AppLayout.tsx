import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content";

export function AppLayout() {
  return (
    <div>
      <Header />
      <Sidebar />
      <Content />
    </div>
  );
}
