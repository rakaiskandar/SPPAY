import SidebarAdmin from "@/components/SidebarAdmin";
import { Outlet } from "react-router-dom";
import "../../../style/layout.scss";

function AdminLayout() {
    return ( 
        <div className="layoutContainer">
            <nav>
                <SidebarAdmin/>
            </nav>
            <main>
                <div>
                    <Outlet/>
                </div>
            </main>
        </div>
     );
}

export default AdminLayout;