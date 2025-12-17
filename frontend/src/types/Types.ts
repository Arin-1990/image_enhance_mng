export interface ImageHistory {
  id: string;
  original_name: string;
  original_url: string;
  enhanced_url: string;
  status: "pending" | "success" | "failed";
  created_at: string;
  updated_at: string;
}

export type PresetType =
  | "portrait_soft"
  | "portrait_clear"
  | "portrait_strong"
  | "screenshot_ui";

export interface ConvertState {
  originalFile: File | null;
  previewUrl: string;
  converting: boolean;
  resultUrl: string;
  modalSrc: string | null;
  originalImageResolution: string;
  convertedImageResolution: string;
  preset: PresetType;
}
