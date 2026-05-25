import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import React from "react";

const Layout: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar some apenas no admin */}
      {!isAdminPage && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer SEMPRE aparece */}
      <Footer />

    </div>
  );
};

export default Layout;