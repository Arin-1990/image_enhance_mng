import {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
} from "react";
import type { ImageHistory } from "../types/Types";
import { fetchImages } from "../utils/mockApi";

interface HistoryContextType {
  historyList: ImageHistory[];
  fetchHistory: () => Promise<void>;
  addImageToHistory: (image: ImageHistory) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: PropsWithChildren) => {
  const [historyList, setHistoryList] = useState<ImageHistory[]>([]);

  const fetchHistory = async () => {
    const data = await fetchImages();
    setHistoryList(data);
  };

  const addImageToHistory = (image: ImageHistory) => {
    setHistoryList((prevList) => [...prevList, image]);
  };

  return (
    <HistoryContext.Provider
      value={{
        historyList,
        fetchHistory,
        addImageToHistory,
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
