import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/beranda.scss";

function Beranda() {
    const user = useRecoilValue(userState);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname.split('/');
        if (currentPath.length < 4) {
            navigate("beranda")
        }
    },[])

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Beranda Siswa</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="berandaContainer">
                <div className="berandaHead">
                    <h2>Beranda</h2>
                </div>

                <div className="berandaSection1">
                    <div className="berandaSub1">
                        <h5>Status Pembayaran:</h5>
                        <div>
                            <h4 className="stat1">Sudah Bayar</h4>
                        </div>
                    </div>
                    <div className="berandaSub1">
                        <h5>Status Transaksi:</h5>
                        <div>
                            <h4 className="stat1">Lunas</h4>
                        </div>
                    </div>
                </div>

                <div className="berandaSection2">
                    <div className="berandaSub2 beranda2SubList">
                        <h4>🧑‍🎓Detail Siswa:</h4>
                    </div>

                    <div className="berandaSub2 beranda2SubList">
                        <h4>💸Detail Pembayaran:</h4>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Beranda;