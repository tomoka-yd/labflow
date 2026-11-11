import { Link } from "react-router";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-2 px-4 py-3 text-sm text-primary">
      <h2>EXPERIMENTS</h2>
      <nav className="flex flex-col gap-2 px-4 py-3" aria-label="サイドナビ">
        <Link to="/experiments">実験管理</Link>
        {/* TODO: タイムライン実装後にリンク先を変更 */}
        <Link to="/">タイムライン</Link>
      </nav>
    </aside>
  );
}
