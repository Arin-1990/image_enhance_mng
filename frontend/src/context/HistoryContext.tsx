import {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
} from "react";
import type { ImageHistory } from "../types/ImageHistory";
import { fetchImages } from "../utils/mockApi";

interface HistoryContextType {
  historyList: ImageHistory[];
  fetchHistory: () => Promise<void>;
  addImageToHistory: (image: ImageHistory) => void;
  settings: {
    defaultConvertMode: string;
    autoSave: boolean;
    imageQuality: number;
  };
  updateSettings: (newSettings: {
    defaultConvertMode?: string;
    autoSave?: boolean;
    imageQuality?: number;
  }) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: PropsWithChildren) => {
  const [historyList, setHistoryList] = useState<ImageHistory[]>([]);
  const [settings, setSettings] = useState({
    defaultConvertMode: "standard",
    autoSave: true,
    imageQuality: 80,
  });

  const fetchHistory = async () => {
    const data = await fetchImages();
    setHistoryList(data);
  };

  const addImageToHistory = (image: ImageHistory) => {
    setHistoryList((prevList) => [...prevList, image]);
  };

  const updateSettings = (newSettings: {
    defaultConvertMode?: string;
    autoSave?: boolean;
    imageQuality?: number;
  }) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <HistoryContext.Provider
      value={{
        historyList,
        fetchHistory,
        addImageToHistory,
        settings,
        updateSettings,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
