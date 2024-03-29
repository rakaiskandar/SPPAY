import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import "@/style/layout.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";

function AdminLayout() {
    const user =  useRecoilValue(userState);

    return ( 
        <div className="layoutContainer">
            <nav>
                <Sidebar user={user}/>
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