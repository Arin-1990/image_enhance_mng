import React, { type ReactNode } from "react";

export type Column<T> = {
  key: keyof T;
  title: string;
  render?: (row: T) => ReactNode;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const Table = <T extends { id: string }>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                textAlign: "left",
              }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            {columns.map((column) => (
              <td
                key={String(column.key)}
                style={{ border: "1px solid #ccc", padding: "8px" }}
              >
                {column.render ? column.render(row) : String(row[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
