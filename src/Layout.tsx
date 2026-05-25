import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import React from "react";

const Layout: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/forgot-password"].some((route) => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && !isAuthRoute && <Navbar />}

      <main className={isAuthRoute ? "min-h-screen" : "flex-1"}>
        <Outlet />
      </main>

      {!isAuthRoute && <Footer />}
    </div>
  );
};

export default Layout;