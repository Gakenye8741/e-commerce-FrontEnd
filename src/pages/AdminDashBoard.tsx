import Navbar from "../components/Navbar"
import { AdminLayout } from "../Dashboards/dashboardDesigns/AdminLayout"


export const AdminDashBoard = () => {
  return (
    <div className="h-screen mt-20">
      <Navbar />
      <AdminLayout/>        
    </div>
  )
}