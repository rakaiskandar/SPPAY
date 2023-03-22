import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import "@/style/adminDetail.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pembayaran, Pengguna, PenggunaTypeList, Siswa, SiswaTypeList, SPP, SPPTypeList } from "@/dataStructure";
import { useForm } from "react-hook-form";
import { connectionSql } from "@/sqlConnect";
import Select from "react-select";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";

interface PembayaranNewProps extends Siswa, Pembayaran, Pengguna, SPP {}

function NewPembayaran() {
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm<PembayaranNewProps>();

    const [siswa, setSiswa] = useState<SiswaTypeList>();
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
    const [pengguna, setPengguna] = useState<Pengguna>();
    const [penggunaD, setPenggunaD] = useState<PenggunaTypeList>();
    const [selectedPengguna, setSelectedPengguna] = useState<Pengguna | null>(null);
    const [spp, setSpp] = useState<SPPTypeList>();
    const [selectedSpp, setSelectedSpp] = useState<SPP | null>(null);
    const [lastId, setLastId] = useState<number>(0);

    const getAllData = () => {
        const sisSql = "SELECT *, nama AS label, nisn AS value, nama_kelas FROM siswa, kelas, spp WHERE siswa.id_kelas = kelas.id_kelas AND spp.id_spp = siswa.id_spp AND spp.status_bayar = 'Belum' ";
        const userSql = `SELECT *, nama_pengguna AS label, id_user AS value FROM pengguna WHERE level IN ('admin','petugas') AND id_user = ${user.id_user}`;
        const sppSql = "SELECT *, id_spp AS label, id_spp AS value FROM spp WHERE spp.status_bayar = 'Belum'";
        const selectedPenggunaSt = "SELECT *, nama_pengguna AS label, id_user AS value FROM pengguna WHERE level IN ('siswa')";
        const lastId = "SELECT id_pembayaran FROM pembayaran ORDER BY id_pembayaran DESC LIMIT 1";
        const allSql = `${sisSql}; ${userSql}; ${sppSql}; ${selectedPenggunaSt}; ${lastId}`;
        connectionSql.query(allSql, (err, results) => {
            if(err) console.error(err)
            else{
                setSiswa(results[0]);
                setPengguna(results[1][0]);
                setSpp(results[2]);
                setPenggunaD(results[3])
                setSelectedPengguna(results[3][0])
                setLastId(results[4][0].id_pembayaran);
            }
        })
    }

    useEffect(() => {
        getAllData();
    },[])

    //Get today date
    let dateNow = new Date().toLocaleDateString("en-US").toString();
    //Date now
    const formatDate = dayjs(dateNow).format("D MMMM YYYY");
    //Month now
    const monthDate = dayjs(dateNow).format("MMMM");

    const changeSiswaHandler = (data: Siswa | null) => {
        if(data == null){
            console.log("ini hapus");
            setValue("nisn", "");
            setValue("nis", "");
            setValue("nama", "");
            setValue("nama_kelas", "");
            setValue("alamat", "");
            setValue("no_telp", "");
            setValue("id_spp", 0);
            setSelectedSiswa(null);
        }else{
            setValue("nisn", data.nisn);
            setValue("nis", data.nis);
            setValue("nama", data.nama);
            setValue("nama_kelas", data.nama_kelas);
            setValue("alamat", data.alamat);
            setValue("id_spp", data.id_spp);
            setValue("no_telp", data.no_telp);
            setSelectedSiswa(data)
        }
    }

    const changeSppHandler = (data: SPP | null) => {
        if (data == null) {
            console.log("ini hapus");
            setValue("id_spp", 0);
            setValue("nominal", "");
            setSelectedSpp(data)
        }else{
            setValue("id_spp", data.id_spp);
            setValue("nominal", data.nominal);
            setSelectedSpp(data);
        }
    }

    const submitHandler = handleSubmit(async (data) => {
        //Get status 
        const jumlah_bayar = data.jumlah_bayar
        const intNominal = parseInt(selectedSpp?.nominal as string);
        if (jumlah_bayar < 6) {
            const addTxnSql = `INSERT INTO pembayaran (id_pembayaran, id_user, nama_petugas, nisn, tgl_bayar, bulan_dibayar, tahun_dibayar, id_spp, jumlah_bayar, status_bayar)
            VALUES ('${lastId + 1}', '${selectedPengguna?.value}', '${pengguna?.nama_pengguna}',  '${selectedSiswa?.nisn}', current_timestamp(), '${monthDate}', YEAR(current_timestamp()), '${selectedSpp?.id_spp}', '${jumlah_bayar}', 'Belum Lunas')`;
            const addTxnDet = `INSERT INTO detail_pembayaran (id_detail, id_pembayaran, bayar) VALUES('${lastId + 1}', '${lastId + 1}', '${jumlah_bayar * intNominal}')`;
            connectionSql.query(`${addTxnSql}; ${addTxnDet}`, (err) => {
                if(err) console.error(err)
                else{
                    toast.success("Tambah pembayaran berhasil!", { autoClose: 1000})
                    navigate(-1);
                }
            })
        }else{
            const addTxnSql = `INSERT INTO pembayaran (id_pembayaran, id_user, nama_petugas, nisn, tgl_bayar, bulan_dibayar, tahun_dibayar, id_spp, jumlah_bayar, status_bayar)
            VALUES ('${lastId + 1}', '${selectedPengguna?.value}', '${pengguna?.nama_pengguna}', '${selectedSiswa?.nisn}', current_timestamp(), '${monthDate}', YEAR(current_timestamp()), '${selectedSpp?.id_spp}', '${jumlah_bayar}', 'Lunas')`;
            const addTxnDet = `INSERT INTO detail_pembayaran (id_detail, id_pembayaran, bayar) VALUES('${lastId + 1}', '${lastId + 1}', '${jumlah_bayar * intNominal}')`;
            connectionSql.query(`${addTxnSql}; ${addTxnDet}`, (err) => {
                if(err) console.error(err)
                else{
                    toast.success("Tambah pembayaran berhasil!", { autoClose: 1000})
                    navigate(-1);
                }
            })
        }
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Tambah Pembayaran Baru</title>
            </Helmet>

            <Navbar user={user}/>

            <div className="container">
                <div className="formTitle">
                    <h2>Tambah Pembayaran</h2>
                    <div>
                        <Link to="/app/a/pembayaran" className="btn2Title">
                            <Icon icon="material-symbols:arrow-back-rounded"/>
                            Kembali
                        </Link>
                    </div>
                </div>
                <form className="pNewContainer" onSubmit={submitHandler}>
                    <div className="pNewL">
                        <div className="sisSec">
                            <div className="sisSecTitle">
                                <h4 className="primaryC">Informasi Siswa</h4>
                                {/* <button>Pilih Siswa</button> */}
                                <Select
                                maxMenuHeight={140}
                                options={siswa}
                                value={selectedSiswa}
                                isClearable={true}
                                placeholder="Pilih siswa"
                                onChange={changeSiswaHandler}
                                className="selectInput"
                                />
                            </div>
                            <div className="pFormContainer">
                                <div className="formSub">
                                    <h5>NISN</h5>
                                    <input 
                                    type="text"
                                    required 
                                    {...register("nisn")}
                                    disabled={selectedSiswa !== null}
                                    />
                                </div>
                                <div className="formSub">
                                    <h5>NIS</h5>
                                    <input 
                                    type="text"
                                    required 
                                    {...register("nis")}
                                    disabled={selectedSiswa !== null}
                                    />
                                </div>
                                <div className="formSub">
                                    <h5>Nama Siswa</h5>
                                    <input 
                                    type="text"
                                    required 
                                    {...register("nama")}
                                    disabled={selectedSiswa !== null}
                                    />
                                </div>
                                <div className="formSub">
                                    <h5>Nama Kelas</h5>
                                    <input 
                                    type="text"
                                    {...register("nama_kelas")}
                                    disabled={selectedSiswa !== null}
                                    required />
                                </div>
                                <div className="formSub">
                                    <h5>Alamat</h5>
                                    <input 
                                    type="text"
                                    {...register("alamat")}
                                    disabled={selectedSiswa !== null}
                                    required />
                                </div>
                                <div className="formSub">
                                    <h5>Kontak</h5>
                                    <input 
                                    type="text"
                                    required 
                                    {...register("no_telp")}
                                    disabled={selectedSiswa !== null}
                                    />
                                </div>
                                <div className="formSub">
                                    <h5>Id SPP</h5>
                                    <input 
                                    type="text"
                                    required 
                                    {...register("id_spp")}
                                    disabled={selectedSiswa !== null}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sisSec">
                            <div className="sisSecTitle">
                                <h4 className="primaryC">Informasi SPP</h4>
                                <Select
                                maxMenuHeight={140}
                                options={spp}
                                value={selectedSpp}
                                isClearable={true}
                                placeholder="Pilih id spp"
                                onChange={changeSppHandler}
                                className="selectInput"
                                />
                            </div>
                            <div className="pFormContainer">
                                <div className="formSub">
                                    <h5>Id SPP</h5>
                                    <input 
                                    type="text"
                                    {...register("id_spp")}
                                    disabled={selectedSpp !== null}
                                    required />
                                </div>
                                <div className="formSub">
                                    <h5>Nominal</h5>
                                    <input 
                                    type="text"
                                    {...register("nominal")}
                                    disabled={selectedSiswa !== null}
                                    required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pNewR">
                        <div className="sisSec">
                            <div className="sisSecTitle">
                                <h4 className="primaryC">Rincian Pembayaran</h4>
                                <Select
                                maxMenuHeight={140}
                                options={penggunaD}
                                value={selectedPengguna}
                                isClearable={true}
                                placeholder="Pilih id user"
                                onChange={setSelectedPengguna}
                                className="selectInput"
                                />
                            </div>
                            <div className="rincianContainer">
                                <div className="formSub">
                                    <h5>Tanggal Dibuat</h5>
                                    <p>{formatDate}</p>
                                </div>
                                <div className="formSub">
                                    <h5>Jumlah Bayar</h5>
                                    <input 
                                    type="number"
                                    {...register("jumlah_bayar")} 
                                    required
                                    />
                                </div>
                                <button>Tambah Pembayaran</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
     );
}

export default NewPembayaran;