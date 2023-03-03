import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/beranda.scss";
import { connectionSql } from "@/sqlConnect";
import rupiahConverter from "@/helpers/rupiahConverter";
import { Pembayaran, Siswa } from "@/dataStructure";
import dayjs from "dayjs";

function Beranda() {
    const user = useRecoilValue(userState);
    const location = useLocation();
    const navigate = useNavigate();

    const [statusBayar, setStatusBayar] = useState<string>("");
    const [totalPembayaran, setTotalPembayaran] = useState<number>(0);
    const [tagihan, setTagihan] = useState<number>(0);
    const [siswa, setSiswa] = useState<Siswa>();
    const [pembayaran, setPembayaran] = useState<Pembayaran>();

    useEffect(() => {
        const currentPath = location.pathname.split('/');
        if (currentPath.length < 4) {
            navigate("beranda")
        }

        var totalPembayaran = `SELECT detP.bayar FROM pembayaran pmb, detail_pembayaran detP, pengguna p WHERE pmb.id_pembayaran = detP.id_pembayaran AND pmb.id_user = p.id_user AND p.id_user = ${user.id_user}`;
        var statusBayar = `SELECT pembayaran.status_bayar FROM pembayaran, pengguna WHERE pembayaran.id_user = pengguna.id_user AND pengguna.id_user = ${user.id_user}`;
        var tagihan = "SELECT spp.nominal FROM spp";
        const siswaSt = `SELECT s.nisn, s.nis, s.nama, s.id_spp, k.nama_kelas , s.alamat, s.no_telp, s.id_spp FROM siswa s, kelas k, pengguna p, pembayaran pmb WHERE s.id_kelas = k.id_kelas AND pmb.nisn = s.nisn AND pmb.id_user = p.id_user AND p.id_user = ${user.id_user}`;
        const pembayaranSt = `SELECT pmb.id_pembayaran, pmb.tgl_bayar, pmb.nama_petugas, s.nama AS nama_siswa, k.nama_kelas AS nama_kelas, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, kelas k, detail_pembayaran detP WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND s.id_kelas = k.id_kelas AND detP.id_pembayaran = pmb.id_pembayaran AND p.id_user = ${user.id_user}`;
        connectionSql.query(`${totalPembayaran}; ${statusBayar}; ${tagihan}; ${siswaSt}; ${pembayaranSt}`, (err, results) => {
            if(err) console.error(err)
            else{
                setTotalPembayaran(results[0][0].bayar);
                setStatusBayar(results[1][0].status_bayar);
                setTagihan(results[2][0].nominal);
                setSiswa(results[3][0]);
                setPembayaran(results[4][0]);
            }
        })
    },[])

    //Get Tagihan
    const tempTagihan = 6 * tagihan
    const total = tempTagihan - totalPembayaran;

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Beranda Siswa</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="container">
                <div className="berandaHead">
                    <h2>Beranda</h2>
                </div>

                <div className="berandaSection1">
                    <div className="berandaSub1">
                        <h5>Total Tagihan:</h5>  
                        <span>{rupiahConverter(total)}</span>
                    </div>
                    <div className="berandaSub1">
                        <h5>Status Transaksi:</h5>
                        <div>
                            <>
                                {statusBayar === "Lunas" ? 
                                <h4 className="stat1">{statusBayar}</h4>
                                : 
                                <h4 className="stat2">Belum Lunas</h4>
                                }
                            </>
                        </div>
                    </div>
                </div>

                <div className="berandaSection2">
                    <div className="berandaSub2 berandaSub2List">
                        <h4>🧑‍🎓Detail Siswa:</h4>
                        <div className="berandaSub2ListItem">
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>NISN</h4>
                                <p>{siswa?.nisn}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>NIS</h4>
                                <p>{siswa?.nis}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Nama</h4>
                                <p>{siswa?.nama}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Kelas</h4>
                                <p>{siswa?.nama_kelas}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Alamat</h4>
                                <p>{siswa?.alamat}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>No Telp</h4>
                                <p>{siswa?.no_telp}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Id Spp</h4>
                                <p>#{siswa?.id_spp}</p>
                            </div>
                        </div>
                    </div>

                    <div className="berandaSub2 berandaSub2List">
                        <h4>💸Detail Pembayaran:</h4>
                        <div className="berandaSub2ListItem">
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Id Pembayaran</h4>
                                <p>#{pembayaran?.id_pembayaran}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Tanggal Bayar</h4>
                                <p>{dayjs(pembayaran?.tgl_bayar).format("D MMMM YYYY")}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Nama Petugas</h4>
                                <p>{pembayaran?.nama_petugas}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Nama Siswa</h4>
                                <p>{pembayaran?.nama_siswa}</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Status Bayar</h4>
                                <p className="paidStatus">
                                {pembayaran?.status_bayar === "Lunas" ? (
                                    <>
                                        <span>🥳</span>
                                        <p className="lunas">Lunas</p>
                                    </>
                                ) : (
                                    <>
                                        <span>😢</span>
                                        <p className="belumLunas">Belum Lunas</p>
                                    </>
                                )}
                                </p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Jumlah Bayar</h4>
                                <p>{pembayaran?.jumlah_bayar}x</p>
                            </div>
                            <div className="berandaSub2ListItemDetailSiswa">
                                <h4>Bayar</h4>
                                <p>{rupiahConverter(pembayaran?.bayar)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Beranda;