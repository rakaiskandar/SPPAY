import { userState } from "@/atoms/userAtom";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

function SiswaLayout() {
    const user = useRecoilValue(userState);

    return ( 
        <div className="layoutContainer">
            <nav>
                <Sidebar user={user}/>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
     );
}

export default SiswaLayout;