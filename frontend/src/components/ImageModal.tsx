import React from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          cursor: "pointer",
        }}
        onClick={(e) => e.stopPropagation()} // モーダルのクリックイベントが伝播しないようにする
      />
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "1.5em",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default ImageModal;
