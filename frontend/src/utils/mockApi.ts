import type { ImageHistory } from "../types/ImageHistory";

const API_BASE_URL = "http://localhost:3001/api/images";

// 画像アップロード
export const uploadImage = async (file: File): Promise<ImageHistory> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }
  return response.json();
};

// 画像変換
export const convertImage = async (
  id: string,
  imageQuality: number
): Promise<ImageHistory> => {
  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, imageQuality }),
  });

  if (!response.ok) {
    throw new Error("Failed to convert image");
  }
  return response.json();
};

// 全履歴取得
export const fetchImages = async (): Promise<ImageHistory[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

// 特定の履歴取得
export const fetchImageById = async (id: string): Promise<ImageHistory> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch image by id");
  }
  return response.json();
};
