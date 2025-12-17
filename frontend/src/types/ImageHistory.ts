export interface ImageHistory {
  id: string;
  original_name: string;
  original_url: string;
  enhanced_url: string;
  status: "pending" | "success" | "failed";
  created_at: string;
  updated_at: string;
}
