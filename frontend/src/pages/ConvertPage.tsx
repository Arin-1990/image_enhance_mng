import React, { useState, useRef } from "react";
import { uploadImage, convertImage } from "../utils/mockApi";
import { useHistory } from "../context/HistoryContext";
import ImageModal from "../components/ImageModal";
import { type ConvertState, type PresetType } from "../types/Types";

const ConvertPage: React.FC = () => {
  const [state, setState] = useState<ConvertState>({
    originalFile: null,
    previewUrl: "",
    converting: false,
    resultUrl: "",
    modalSrc: null,
    originalImageResolution: "",
    convertedImageResolution: "",
    preset: "portrait_clear",
  });

  const { addImageToHistory } = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (src: string) => {
    setState((prev) => ({ ...prev, modalSrc: src }));
  };

  const handleCloseModal = () => {
    setState((prev) => ({ ...prev, modalSrc: null }));
  };

  const getImageResolution = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(`${img.width}x${img.height}`);
      img.onerror = () => resolve("N/A");
      img.src = url;
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      originalFile: file,
      previewUrl: url,
      resultUrl: "",
      convertedImageResolution: "",
    }));

    const resolution = await getImageResolution(url);
    setState((prev) => ({
      ...prev,
      originalImageResolution: resolution,
    }));
  };

  const handleConvert = async () => {
    if (!state.originalFile) return;

    setState((prev) => ({ ...prev, converting: true }));

    try {
      const uploadedImage = await uploadImage(state.originalFile);
      addImageToHistory(uploadedImage);

      const convertedImage = await convertImage(uploadedImage.id, state.preset);

      const convertedResolution = await getImageResolution(
        convertedImage.enhanced_url
      );

      setState((prev) => ({
        ...prev,
        resultUrl: convertedImage.enhanced_url,
        convertedImageResolution: convertedResolution,
        converting: false,
      }));
    } catch (err) {
      console.error("Conversion failed:", err);
      setState((prev) => ({ ...prev, converting: false }));
    }
  };

  const handleClear = () => {
    setState({
      originalFile: null,
      previewUrl: "",
      converting: false,
      resultUrl: "",
      modalSrc: null,
      originalImageResolution: "",
      convertedImageResolution: "",
      preset: "portrait_clear",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2>変換ページ</h2>

      {/* 文件选择 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {state.originalFile && (
          <button
            onClick={handleClear}
            style={{ marginLeft: "20px", padding: "8px 15px" }}
          >
            クリア
          </button>
        )}
      </div>

      {/* Preset 选择 */}
      {state.originalFile && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>
            変換プリセット：
          </label>
          <select
            value={state.preset}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                preset: e.target.value as PresetType,
              }))
            }
          >
            <option value="portrait_soft">人像・自然（保守）</option>
            <option value="portrait_clear">人像・くっきり（おすすめ）</option>
            <option value="portrait_strong">人像・強調（やや激しい）</option>
            <option value="screenshot_ui">スクリーンショット / UI</option>
          </select>
        </div>
      )}

      {/* 图片对比 */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {state.previewUrl && (
          <div style={{ textAlign: "center" }}>
            <h3>元の画像</h3>
            <img
              src={state.previewUrl}
              alt="Preview"
              style={{
                maxWidth: "300px",
                border: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(state.previewUrl)}
            />
            <p>解像度: {state.originalImageResolution}</p>
          </div>
        )}

        {state.previewUrl && state.resultUrl && (
          <span style={{ fontSize: "2em" }}>→</span>
        )}

        {state.resultUrl && (
          <div style={{ textAlign: "center" }}>
            <h3>変換後の画像</h3>
            <img
              src={state.resultUrl}
              alt="Result"
              style={{
                maxWidth: "300px",
                border: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(state.resultUrl)}
            />
            <p>解像度: {state.convertedImageResolution}</p>
          </div>
        )}
      </div>

      {state.modalSrc && (
        <ImageModal
          src={state.modalSrc}
          alt="拡大画像"
          onClose={handleCloseModal}
        />
      )}

      <button
        onClick={handleConvert}
        disabled={!state.originalFile || state.converting}
        style={{ marginTop: "20px" }}
      >
        {state.converting ? "変換中..." : "変換する"}
      </button>
    </div>
  );
};

export default ConvertPage;
