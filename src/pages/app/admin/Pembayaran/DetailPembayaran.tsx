import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { Pembayaran, Pengguna, Siswa, SPP } from "@/dataStructure";
import rupiahConverter from "@/helpers/rupiahConverter";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function DetailPembayaran() {
    const { id } = useParams();
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [siswaD, setSiswaD] = useState<Siswa>();
    const [sppD, setSppD] = useState<SPP>();
    const [penggunaD, setPenggunaD] = useState<Pengguna>();
    const [pembayaran, setPembayaran] = useState<Pembayaran>();

    const { register, handleSubmit } = useForm<Pembayaran>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT * FROM pembayaran WHERE id_pembayaran = ${id}`;
        var pembayaranSt = `SELECT pmb.id_pembayaran, pmb.id_pembayaran AS id, pmb.tgl_bayar, pmb.id_spp, pmb.nama_petugas, p.nama_pengguna, s.nama AS nama_siswa, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, detail_pembayaran detP WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND detP.id_pembayaran = pmb.id_pembayaran AND pmb.id_pembayaran = ${id}`;
        const siswaSt = `SELECT p.id_pembayaran, s.nisn, s.nisn AS id, s.nis, s.nama, s.id_spp, k.nama_kelas , s.alamat, s.no_telp FROM siswa s, kelas k, pembayaran p WHERE s.id_kelas = k.id_kelas AND p.nisn = s.nisn AND p.id_pembayaran = ${id}`;
        const penggunaSt = `SELECT png.nama_pengguna FROM pengguna png, pembayaran pmb WHERE png.id_user = pmb.id_user AND pmb.id_pembayaran = ${id}`;
        const sppSt = `SELECT *, spp.nominal FROM spp WHERE id_spp = ${id}`;
        connectionSql.query(`${sqlSt}; ${pembayaranSt}; ${siswaSt}; ${penggunaSt}; ${sppSt}`, (err, results) => {
            if(err) console.error(err)
            else{
                setPembayaran(results[1][0]);
                setSiswaD(results[2][0]);
                setPenggunaD(results[3][0]);
                setSppD(results[4][0]);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const jumlah_bayar = data.jumlah_bayar
        const intNominal = parseInt(sppD?.nominal as string);     
        if (jumlah_bayar >= 6) {
            const updateSt = `UPDATE pembayaran SET status_bayar = 'Lunas', jumlah_bayar = '${jumlah_bayar}' WHERE id_pembayaran = ${id}`;
            const detPembayaran = `UPDATE detail_pembayaran SET bayar = ${jumlah_bayar * intNominal} WHERE id_pembayaran = ${id}`;
            connectionSql.query(`${updateSt}; ${detPembayaran}`, (err) => {
                if (err) console.error(err)
                else{
                    toast.success("Ubah pembayaran berhasil!", { autoClose: 1000})
                    navigate("/app/a/pembayaran");
                }
            })
        }else{
            const updateSt = `UPDATE pembayaran SET status_bayar = 'Belum Lunas', jumlah_bayar = '${jumlah_bayar}' WHERE id_pembayaran = ${id}`;
            const detPembayaran = `UPDATE detail_pembayaran SET bayar = ${jumlah_bayar * intNominal} WHERE id_pembayaran = ${id}`;
            connectionSql.query(`${updateSt}; ${detPembayaran}`, (err) => {
                if (err) console.error(err)
                else{
                    toast.success("Ubah pembayaran berhasil!", { autoClose: 1000})
                    navigate("/app/a/pembayaran");
                }
            })
        }
    })

    const deleteData = () => {
        const deleteSt = `DELETE FROM pembayaran WHERE id_pembayaran = ${id}`;
        //Set status bayar in spp
        const sppUpd = `UPDATE spp SET status_bayar = 'Belum' WHERE id_spp = ${pembayaran?.id_spp}`;
        const allSql = `${deleteSt}; ${sppUpd}`;
        connectionSql.query(allSql, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Hapus pembayaran berhasil!", { autoClose: 1000})
                navigate("/app/a/pembayaran");
            }
        })
    }

    if(loading) {
        return (
            <>
                <Navbar user={user}/>

                <div className="container">
                    <div className="penggunaHead">
                        <h4>Loading...</h4>
                    </div>
                </div>
            </>
        )
    }

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Detail Pembayaran</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
                { /*Modal for Delete*/}
                <Modal
                open={isOpen} 
                close={setIsOpen} 
                event={deleteData} 
                title={`Hapus Data`}
                desc={`Tindakan ini akan menghapus data secara permanen.
                Apakah kamu yakin akan menghapus data ini?`}/>

                <div className="formTitle">
                    <h2>Detail Pembayaran</h2>
                    <div>
                        <button className="btn2Title">
                            <Icon icon="material-symbols:edit-document-outline-sharp"/>
                            Edit
                        </button>
                        <Link to="/app/a/pembayaran">
                            <button className="btn1Title">
                                <Icon icon="material-symbols:print-outline-rounded"/>
                                Cetak Laporan
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="hapusContainer">
                    <div className="hapusBtnPmb" onClick={() => setIsOpen(true)}>
                        <Icon icon="ion:trash-outline"/>
                        Hapus Data
                    </div>
                </div>
                <div className="detailHead">
                    <div>
                        <h3>#{pembayaran?.id_pembayaran}</h3>
                        <p>{dayjs(pembayaran?.tgl_bayar).format("D MMMM YYYY")}</p>
                    </div>
                    <div className="detailHeadSub">
                        <p className="primaryC">{rupiahConverter(pembayaran?.bayar)}</p>
                        <p className={`stat ${
                            pembayaran?.status_bayar === "Lunas"
                            ? "sType"
                            : pembayaran?.status_bayar === "Belum Lunas"
                            ? "tkjType"
                            : ""
                        }
                        `}>
                            {pembayaran?.status_bayar}
                        </p>
                    </div>
                </div>

                <div className="detailBody">
                    <div className="detailSub">
                        <div className="detailSubH">
                            <h5>Detail Pembayaran</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Id Pembayaran</p>
                            <h5>#{pembayaran?.id_pembayaran}</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Tanggal Pembayaran</p>
                            <h5>{dayjs(pembayaran?.tgl_bayar).format("D MMMM YYYY")}</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Nama Petugas</p>
                            <h5>{pembayaran?.nama_petugas}</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Nama Siswa</p>
                            <h5>{pembayaran?.nama_siswa}</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Id SPP</p>
                            <h5>{pembayaran?.id_spp}</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Status Bayar</p>
                            <h5 className="paidStatus">
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
                            </h5>
                        </div>
                        <div className="detailSubB">
                            <p>Jumlah Bayar</p>
                            <input 
                            type="text"
                            defaultValue={pembayaran?.jumlah_bayar}
                            {...register("jumlah_bayar")}
                            required
                             />
                        </div>
                    </div>

                    <div className="detailSub2">
                        <div className="detailSub">
                            <div className="detailSubH">
                                <h5>Detail Siswa</h5>
                            </div>
                            <div className="detailSubB">
                                <p>NISN</p>
                                <h5>{siswaD?.nisn}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>NIS</p>
                                <h5>{siswaD?.nis}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>Nama</p>
                                <h5>{siswaD?.nama}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>Kelas</p>
                                <h5>{siswaD?.nama_kelas}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>Alamat</p>
                                <h5>{siswaD?.alamat}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>Kontak</p>
                                <h5>{siswaD?.no_telp}</h5>
                            </div>
                            <div className="detailSubB">
                                <p>Id SPP</p>
                            <h5>{siswaD?.id_spp}</h5>
                        </div>
                        </div>
                    </div>
                    <div className="detailSub">
                        <div className="detailSubH">
                            <h5>Detail Petugas</h5>
                        </div>
                        <div className="detailSubB">
                            <p>Nama Petugas</p>
                            <h5>{pembayaran?.nama_petugas}</h5>
                        </div>
                    </div>
                </div>
            </form>
        </>
     );
}

export default DetailPembayaran;