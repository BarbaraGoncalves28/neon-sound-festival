import StagesManager from "./StagesManager";
import ScheduleManager from "./ScheduleManager";
import { AdminDashboardReal } from "../../modules/admin/AdminDashboardReal";
import DashboardStats from "./DashboardStats";

export default function AdminDashboard() {

  return (

    <div className="text-white space-y-16">

      {/* Dashboard com métricas */}
      <AdminDashboardReal />

      <DashboardStats/>
    </div>

  );

}