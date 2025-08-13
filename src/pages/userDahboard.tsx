import Navbar from "../components/Navbar"
import { UserLayout } from "../Dashboards/dashboardDesigns/userLayout"

export const UserDashboard = () => {
  return (
    <div className="h-screen mt-20">
        <Navbar/>
        <UserLayout/>
    </div>
  )
}
