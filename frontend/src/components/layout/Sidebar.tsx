import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/">変換ページ</Link>
          </li>
          <li>
            <Link to="/history">管理ページ</Link>
          </li>
          <li>
            <Link to="/guide">使用説明ページ</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
