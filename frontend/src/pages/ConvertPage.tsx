import React, { useState, useRef, useEffect } from "react";
import { uploadImage, convertImage } from "../utils/mockApi";
import { useHistory } from "../context/HistoryContext";
import type { ImageHistory } from "../types/ImageHistory";

import ImageModal from "../components/ImageModal";
import { log } from "console";

interface ConvertState {
  originalFile: File | null;
  previewUrl: string;
  converting: boolean;
  resultUrl: string;
  modalSrc: string | null;
  originalImageResolution: string;
  convertedImageResolution: string;
}

const ConvertPage: React.FC = () => {
  const [state, setState] = useState<ConvertState>({
    originalFile: null,
    previewUrl: "",
    converting: false,
    resultUrl: "",
    modalSrc: null,
    originalImageResolution: "",
    convertedImageResolution: "",
  });
  const { addImageToHistory, settings } = useHistory();

  const handleImageClick = (src: string) => {
    setState({ ...state, modalSrc: src });
  };

  const handleCloseModal = () => {
    setState({ ...state, modalSrc: null });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageResolution = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
      };
      img.onerror = () => {
        resolve("N/A");
      };
      img.src = url;
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState({
        ...state,
        originalFile: file,
        previewUrl: url,
        resultUrl: "",
        convertedImageResolution: "", // Reset converted resolution
      });
      const resolution = await getImageResolution(url);
      setState((prevState) => ({
        ...prevState,
        originalImageResolution: resolution,
      }));
    }
  };

  const handleConvert = async () => {
    if (state.originalFile) {
      setState({ ...state, converting: true });
      try {
        const uploadedImage = await uploadImage(state.originalFile);
        addImageToHistory(uploadedImage);
        const convertedImage = await convertImage(
          uploadedImage.id,
          settings.imageQuality
        );
        setState({
          ...state,
          resultUrl: convertedImage.enhanced_url,
          converting: false,
        });

        // Get resolution of converted image
        const convertedResolution = await getImageResolution(
          convertedImage.enhanced_url
        );
        setState((prevState) => ({
          ...prevState,
          convertedImageResolution: convertedResolution,
        }));
      } catch (error) {
        console.error("Conversion failed:", error);
        setState({ ...state, converting: false });
      }
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
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2>変換ページ</h2>
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
