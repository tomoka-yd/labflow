import { Link } from "react-router";

export function Header() {
  return (
    <header>
      <h1>
        <Link to="/">LabFlow</Link>
      </h1>
      <nav aria-label="ヘッダーナビ">
        <Link to="/">ダッシュボード</Link>
        <Link to="/experiments">実験管理</Link>
      </nav>
    </header>
  );
}
