import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import { Home } from "./components/Home";
import { LineupPage } from "./components/LineupPage";
import { TicketsPage } from "./components/TicketsPage";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import MyTickets from "./components/MyTickets";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminSidebar from "./modules/admin/AdminSidebar";

import { Toaster } from "react-hot-toast";
import React from "react";
import StagesManager from "./components/admin/StagesManager";
import ScheduleManager from "./components/admin/ScheduleManager";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route element={<Layout />}>

          {/* Rotas normais */}
          <Route path="/" element={<Home />} />
          <Route path="/lineup" element={<LineupPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/meus-ingressos" element={<MyTickets />} />
          <Route path="/ingressos" element={<TicketsPage />} />

          {/* Admin agora usa Layout também */}
          <Route path="/admin" element={<AdminSidebar />}>
            <Route index element={<AdminDashboard />} />
            <Route path="palcos" element={<StagesManager/>}/>
            <Route path="programacao" element={<ScheduleManager />}/>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;