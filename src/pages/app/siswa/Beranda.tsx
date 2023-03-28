import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/beranda.scss";
import { connectionSql } from "@/sqlConnect";
import rupiahConverter from "@/helpers/rupiahConverter";
import { bulanOptions, Pembayaran, Semester, semesterOptions, Siswa } from "@/dataStructure";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import PdfBukti from "@/components/BuktiPembayaran";
import { PDFDownloadLink } from "@react-pdf/renderer";
import generateRandomId from "@/helpers/generateRandomId";
import Select from "react-select";

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
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        semesterOptions[0]
    );

    useEffect(() => {
        const currentPath = location.pathname.split('/');
        if (currentPath.length < 4) {
            navigate("beranda")
        }

        var totalpembayaran = `SELECT detP.bayar FROM pembayaran pmb, detail_pembayaran detP, pengguna p, spp sp WHERE pmb.id_pembayaran = detP.id_pembayaran AND pmb.id_user = p.id_user AND pmb.id_spp = sp.id_spp AND sp.semester = ${bulanOptions[0].value} AND p.id_user = ${user.id_user}`;
        var statusbayar = `SELECT pembayaran.status_bayar FROM pembayaran, pengguna, spp WHERE pembayaran.id_user = pengguna.id_user AND spp.id_spp = pembayaran.id_spp AND spp.semester = ${bulanOptions[0].value} AND pengguna.id_user = ${user.id_user}`;
        var tagihan = "SELECT spp.nominal FROM spp";
        const siswaSt = `SELECT s.nisn, s.nis, s.nama, k.nama_kelas , s.alamat, s.no_telp, sp.status_bayar FROM siswa s, kelas k, pengguna p, pembayaran pmb, spp sp WHERE s.id_kelas = k.id_kelas AND pmb.nisn = s.nisn AND pmb.id_user = p.id_user AND pmb.id_spp = sp.id_spp AND sp.semester = ${bulanOptions[0].value} AND p.id_user = ${user.id_user}`;
        const pembayaranSt = `SELECT pmb.id_pembayaran, pmb.id_pembayaran AS id, pmb.tgl_bayar, sp.semester ,pmb.nama_petugas, p.nama_pengguna, s.nama AS nama_siswa, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, detail_pembayaran detP, spp sp WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND detP.id_pembayaran = pmb.id_pembayaran AND pmb.id_spp = sp.id_spp AND sp.semester = ${bulanOptions[0].value} AND p.id_user = ${user.id_user}`;
        connectionSql.query(`${totalpembayaran}; ${statusbayar}; ${tagihan}; ${siswaSt}; ${pembayaranSt}`, 
        (err, results) => {
            if(err) console.error(err)
            else{
                setTotalPembayaran(results[0][0] === undefined ? 0 : results[0][0].bayar);
                setStatusBayar(results[1][0] === undefined ? "" : results[1][0].status_bayar);
                setTagihan(results[2][0] === undefined ? 0 : results[2][0].nominal);
                setSiswa(results[3][0]);
                setListSiswa(results[3]);
                setPembayaran(results[4][0]);
                setListBayar(results[4]);
            }
        })
    },[])
    
    //Get today date
    let dateNow = new Date().toLocaleDateString("en-US").toString();
    //Date now
    const formatDate = dayjs(dateNow).format("D MMMM YYYY");

    //Get Tagihan
    const tempTagihan = 6 * tagihan;
    const total = tempTagihan - totalPembayaran;

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Beranda Siswa</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="container">
                <div className="berandaHead">
                    <div className="berandaHeadSub">
                        <h2>Beranda</h2>
                        <Select 
                        options={semesterOptions}
                        value={selectedSemester}
                        placeholder="Pilih semester"
                        theme={(theme) => ({
                        ...theme,
                        borderRadius: 5,
                        colors: {
                          ...theme.colors,
                          primary25: '#E5E7EB',
                          primary: '#535bf2',
                        },
                      })}
                    onChange={
                        (value) => {
                            var totalpembayaran = `SELECT detP.bayar FROM pembayaran pmb, detail_pembayaran detP, pengguna p, spp sp WHERE pmb.id_pembayaran = detP.id_pembayaran AND pmb.id_user = p.id_user AND pmb.id_spp = sp.id_spp AND sp.semester = ${value?.value} AND p.id_user = ${user.id_user}`;
                            var statusbayar = `SELECT pembayaran.status_bayar FROM pembayaran, pengguna, spp WHERE pembayaran.id_user = pengguna.id_user AND spp.id_spp = pembayaran.id_spp AND spp.semester = ${value?.value} AND pengguna.id_user = ${user.id_user}`;
                            var tagihan = "SELECT spp.nominal FROM spp";
                            const siswaSt = `SELECT s.nisn, s.nis, s.nama, k.nama_kelas , s.alamat, s.no_telp, sp.status_bayar FROM siswa s, kelas k, pengguna p, pembayaran pmb, spp sp WHERE s.id_kelas = k.id_kelas AND pmb.nisn = s.nisn AND pmb.id_user = p.id_user AND pmb.id_spp = sp.id_spp AND sp.semester = ${value?.value} AND p.id_user = ${user.id_user}`;
                            const pembayaranSt = `SELECT pmb.id_pembayaran, pmb.id_pembayaran AS id, pmb.tgl_bayar, sp.semester ,pmb.nama_petugas, p.nama_pengguna, s.nama AS nama_siswa, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, detail_pembayaran detP, spp sp WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND detP.id_pembayaran = pmb.id_pembayaran AND pmb.id_spp = sp.id_spp AND sp.semester = ${value?.value} AND p.id_user = ${user.id_user}`;
                            connectionSql.query(`${totalpembayaran}; ${statusbayar}; ${tagihan}; ${siswaSt}; ${pembayaranSt}`, 
                            (err, results) => {
                                if(err) console.error(err)
                                else{
                                    setTotalPembayaran(results[0][0] === undefined ? 0 : results[0][0].bayar);
                                    setStatusBayar(results[1][0] === undefined ? "" : results[1][0].status_bayar);
                                    setTagihan(results[2][0] === undefined ? 0 : results[2][0].nominal);
                                    setSiswa(results[3][0])
                                    setListSiswa(results[3]);
                                    setPembayaran(results[4][0]);
                                    setListBayar(results[4]);
                                    setSelectedSemester(value);
                                }
                            })
                        }
                    }/>
                    </div>
                    
                    <div>
                        {pembayaran !== undefined && siswa !== undefined && pembayaran.semester !== null ?
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
                </div>

                <div className="berandaSection1">
                    <div className="berandaSub1">
                        <h5>Total Tagihan:</h5>  
                        <span>
                            <>
                                <>{total === undefined && total >= tempTagihan ? "Tidak ada tagihan" : rupiahConverter(total)}</>   
                            </>
                        </span>
                    </div>
                    <div className="berandaSub1">
                        <span className="berandaSub1Head">
                            <h5>Status Transaksi:</h5>
                        </span>
                        <div>
                            <>
                                {statusBayar === "" ? 
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
                                        <h4>Status Bayar</h4>
                                        <p className="paidStatus">
                                        {s.status_bayar === "Lunas" ? (
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
                                        <h4>Semester</h4>
                                        <p>{p.semester}</p>
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
                                        {`Kamu belum melakukan pembayaran pada ${selectedSemester?.label}, silakan lakukan
                                        pembayaran dengan menghubungi admin😅`}
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