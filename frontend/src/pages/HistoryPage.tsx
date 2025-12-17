import React, { useState, useEffect } from "react";
import type { ImageHistory } from "../types/Types";
import { useHistory } from "../context/HistoryContext";
import Table, { type Column } from "../components/Table";
import { useNavigate } from "react-router-dom";

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { historyList, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns: Column<ImageHistory>[] = [
    {
      key: "original_name",
      title: "元のファイル名",
    },
    {
      key: "status",
      title: "ステータス",
    },
    {
      key: "created_at",
      title: "作成日時",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2>管理ページ</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setViewMode("grid")}
          style={{ marginRight: "10px" }}
        >
          グリッドビュー
        </button>
        <button onClick={() => setViewMode("table")}>テーブルビュー</button>
      </div>

      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {historyList.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/history/${item.id}`)}
            >
              <img
                src={item.enhanced_url || item.original_url}
                alt={item.original_name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <p>{item.original_name}</p>
              <p>ステータス: {item.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          data={historyList}
          onRowClick={(row) => navigate(`/history/${row.id}`)}
        />
      )}
    </div>
  );
};

export default HistoryPage;
