import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HistoryProvider } from "./context/HistoryContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
  >
    <HistoryProvider>
      <App />
    </HistoryProvider>
  </BrowserRouter>
);
