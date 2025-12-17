import React, { useState, useEffect } from "react";
import { useHistory } from "../context/HistoryContext";

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useHistory();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const updatedValue =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [name]: updatedValue,
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert("設定が保存されました！");
  };

  return (
    <div>
      <h2>システム設定</h2>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px",
        }}
      >
        <div>
          <label
            htmlFor="defaultConvertMode"
            style={{ display: "block", marginBottom: "5px" }}
          >
            デフォルト変換モード:
          </label>
          <select
            id="defaultConvertMode"
            name="defaultConvertMode"
            value={localSettings.defaultConvertMode}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="standard">標準</option>
            <option value="high-res">高解像度</option>
            <option value="fast">高速</option>
          </select>
        </div>

        <div>
          <input
            type="checkbox"
            id="autoSave"
            name="autoSave"
            checked={localSettings.autoSave}
            onChange={handleChange}
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="autoSave">自動保存</label>
        </div>

        <div>
          <label
            htmlFor="imageQuality"
            style={{ display: "block", marginBottom: "5px" }}
          >
            画像品質 ({localSettings.imageQuality}%):
          </label>
          <input
            type="range"
            id="imageQuality"
            name="imageQuality"
            min="1"
            max="100"
            value={localSettings.imageQuality}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          設定を保存
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
