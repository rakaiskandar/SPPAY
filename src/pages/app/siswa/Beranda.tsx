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
import { Icon } from "@iconify/react";
import PdfBukti from "@/components/BuktiPembayaran";
import { PDFDownloadLink } from "@react-pdf/renderer";
import generateRandomId from "@/helpers/generateRandomId";

function Beranda() {
    const user = useRecoilValue(userState);
    const location = useLocation();
    const navigate = useNavigate();

    const [statusBayar, setStatusBayar] = useState<string | any>("");
    const [totalPembayaran, setTotalPembayaran] = useState<number | any>(0);
    const [tagihan, setTagihan] = useState<number | any>(0);
    const [siswa, setSiswa] = useState<Siswa>();
    const [pembayaran, setPembayaran] = useState<Pembayaran>();
    const [listSiswa, setListSiswa] = useState<Siswa[]>([]);
    const [listBayar, setListBayar] = useState<Pembayaran[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const currentPath = location.pathname.split('/');
        if (currentPath.length < 4) {
            navigate("beranda")
        }

        var totalpembayaran = `SELECT detP.bayar FROM pembayaran pmb, detail_pembayaran detP, pengguna p WHERE pmb.id_pembayaran = detP.id_pembayaran AND pmb.id_user = p.id_user AND p.id_user = ${user.id_user}`;
        var statusbayar = `SELECT pembayaran.status_bayar FROM pembayaran, pengguna WHERE pembayaran.id_user = pengguna.id_user AND pengguna.id_user = ${user.id_user}`;
        var tagihan = "SELECT spp.nominal FROM spp";
        const siswaSt = `SELECT s.nisn, s.nis, s.nama, s.id_spp, k.nama_kelas , s.alamat, s.no_telp, s.id_spp FROM siswa s, kelas k, pengguna p, pembayaran pmb WHERE s.id_kelas = k.id_kelas AND pmb.nisn = s.nisn AND pmb.id_user = p.id_user AND p.id_user = ${user.id_user}`;
        const pembayaranSt = `SELECT pmb.id_pembayaran, pmb.id_pembayaran AS id, pmb.tgl_bayar, pmb.id_spp, pmb.nama_petugas, p.nama_pengguna, s.nama AS nama_siswa, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, detail_pembayaran detP WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND detP.id_pembayaran = pmb.id_pembayaran AND p.id_user = ${user.id_user}`;
        connectionSql.query(`${totalpembayaran}; ${statusbayar}; ${tagihan}; ${siswaSt}; ${pembayaranSt}`, 
        (err, results) => {
            if(err) console.error(err)
            else{
                setTotalPembayaran(results[0][0]);
                setStatusBayar(results[1][0].status_bayar);
                setTagihan(results[2][0].nominal);
                setSiswa(results[3][0]);
                setListSiswa(results[3]);
                setPembayaran(results[4][0]);
                setListBayar(results[4]);
                setLoading(false)
            }
        })
    },[])
    
    //Get today date
    let dateNow = new Date().toLocaleDateString("en-US").toString();
    //Date now
    const formatDate = dayjs(dateNow).format("D MMMM YYYY");

    //Get Tagihan
    const tempTagihan = 6 * tagihan;
    const total = tempTagihan - totalPembayaran.bayar;

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Beranda Siswa</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="container">
                <div className="berandaHead">
                    <h2>Beranda</h2>
                    {pembayaran !== undefined && siswa !== undefined ?
                    <PDFDownloadLink document={<PdfBukti pembayaran={pembayaran!} siswa={siswa!}/>} fileName={`Bukti Pembayaran-${generateRandomId(5)}-${formatDate}`}>
                    {({loading}) => (loading ? 
                        <button className="btnDownload loading">
                            <Icon icon="ic:round-save-alt"/>
                            Unduh Bukti Transaksi
                        </button> : 
                        <button className="btnDownload">
                            <Icon icon="ic:round-save-alt"/>
                            Unduh Bukti Transaksi
                        </button>) }
                    </PDFDownloadLink>
                    :
                    <></>
                    }
                </div>

                <div className="berandaSection1">
                    <div className="berandaSub1">
                        <h5>Total Tagihan:</h5>  
                        <span>
                            <>
                                {total !== undefined ?
                                    <>{rupiahConverter(total)}</>
                                : 
                                    <>Tidak ada tagihan</> 
                            }
                            </>
                        </span>
                    </div>
                    <div className="berandaSub1">
                        <h5>Status Transaksi:</h5>
                        <div>
                            <>
                                {statusBayar === undefined ? 
                                    <h4 className="statTidak">Belum ada status</h4>
                                    :
                                statusBayar === "Lunas" ?  
                                    <h4 className="stat1">{statusBayar}</h4>
                                    : 
                                    <h4 className="stat2">{statusBayar}</h4>
                                }
                            </>
                        </div>
                    </div>
                </div>

                <div className="berandaSection2">
                    <div className="berandaSub2 berandaSub2List">
                        <h4>🎓Detail Siswa:</h4>
                        <div className="berandaSub2ListItem">
                        {listSiswa.length > 0 ? (
                                listSiswa.map((s, i) => (
                                    <div className="berandaSub2ListItemDetailSiswa">
                                        <div>
                                            <h4>NISN</h4>
                                            <p>{s.nisn}</p>    
                                        </div>
                                        <div>
                                            <h4>NIS</h4>
                                            <p>{s.nis}</p>
                                        </div>
                                        <div>
                                            <h4>Nama Siswa</h4>
                                            <p>{s.nama}</p>
                                        </div>
                                        <div>
                                            <h4>Kelas</h4>
                                            <p>{s.nama_kelas}</p>
                                        </div>
                                        <div>
                                            <h4>Alamat</h4>
                                            <p>{s.alamat}</p>
                                        </div>
                                        <div>
                                            <h4>Kontak</h4>
                                            <p>{s.no_telp}</p>
                                        </div>
                                        <div>
                                            <h4>Id Spp</h4>
                                            <p>{s.id_spp}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="beranda2Stat">
                                    <h4 className="tidakAdaDataSiswa">
                                        Data kamu sebagai siswa tidak akan ditampilkan, silakan lakukan<br/>
                                        pembayaran dengan menghubungi admin😣
                                    </h4>
                                </div>
                            )
                        }
                        </div>
                    </div>

                    <div className="berandaSub2 berandaSub2List">
                        <h4>💸Detail Pembayaran:</h4>
                        <div className="berandaSub2ListItem">
                        {listBayar.length > 0 ? (
                            listBayar.map((p, i) => (
                                <div className="berandaSub2ListItemDetailSiswa">
                                    <div>
                                        <h4>Id Pembayaran</h4>
                                        <p>#{p.id_pembayaran}</p>  
                                    </div>
                                    <div>
                                        <h4>Tanggal Bayar</h4>
                                        <p>{dayjs(p.tgl_bayar).format("D MMMM YYYY")}</p>
                                    </div>
                                    <div>
                                        <h4>Nama Petugas</h4>
                                        <p>{p.nama_petugas}</p>
                                    </div>
                                    <div>
                                        <h4>Nama Siswa</h4>
                                        <p>{p.nama_siswa}</p>
                                    </div>
                                    <div>
                                        <h4>Status Bayar</h4>
                                        <p className="paidStatus">
                                        {p.status_bayar === "Lunas" ? (
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
                                    <div>
                                        <h4>Jumlah Bayar</h4>
                                        <p>{p.jumlah_bayar}x</p>
                                    </div>
                                    <div>
                                        <h4>Bayar</h4>
                                        <p>{rupiahConverter(p.bayar)}</p>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <div className="beranda2Stat">
                                    <h4 className="tidakAdaDataSiswa">
                                        Kamu belum melakukan pembayaran, silakan lakukan<br/>
                                        pembayaran dengan menghubungi admin😅
                                    </h4>
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Beranda;