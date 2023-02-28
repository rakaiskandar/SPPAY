import { userState } from '@/atoms/userAtom';
import Sidebar from '@/components/Sidebar';
import '@/style/layout.scss';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

function PetugasLayout() {
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

export default PetugasLayout;