import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export const AppLayout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="body">
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
