import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import "@/style/adminDetail.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Kelas, Siswa, SPP, SPPOptions } from "@/dataStructure";
import { useEffect, useState } from "react";
import { connectionSql } from "@/sqlConnect";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";
import { toast } from "react-toastify";

function NewSiswa() {
    const user = useRecoilValue(userState);
    const { register, handleSubmit } = useForm<Siswa>();
    const navigate = useNavigate();

    const [kelas, setKelas] = useState<Kelas[]>([]);
    const [spp, setSpp] = useState<SPPOptions[]>([]);
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>();
    const [selectedSpp, setSelectedSpp] = useState<SPPOptions | null>();

    useEffect(() => {
        const kelasSt = "SELECT nama_kelas AS label, id_kelas, id_kelas AS value FROM kelas";
        const sppSt = "SELECT id_spp AS label, id_spp AS value FROM spp WHERE status_bayar = 'Belum'";
        connectionSql.query(`${kelasSt}; ${sppSt}`, (err, results, fields) => {
            if(err) console.error(err)
            else{
                setKelas(results[0]);
                setSelectedKelas(results[0][1]);
                setSpp(results[1])
                setSelectedSpp(results[1][0]);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const addSt = `INSERT INTO siswa (nisn, nis, nama, id_kelas, alamat, no_telp, id_spp) VALUES ('${data.nisn}', '${data.nis}', '${data.nama}', '${selectedKelas?.id_kelas}', '${data.alamat}', '${data.no_telp}', '${selectedSpp?.value}')`;
        // console.log(addSt);
        connectionSql.query(addSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Tambah siswa berhasil!", { autoClose: 1000})
                navigate(-1);
            }
        })
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Tambah Siswa Baru</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
                <div className="formTitle">
                    <h2>Tambah Siswa</h2>
                    <div>
                        <Link to="/app/a/siswa" className="btn2Title">
                            <Icon icon="material-symbols:arrow-back-rounded"/>
                            Kembali
                        </Link>
                        <button className="btn1Title">
                            <Icon icon="ic:outline-save-alt"/>
                            Simpan Data
                        </button>
                    </div>
                </div>
                <div className="formContainerDetail">
                    <div className="formSub">
                        <label htmlFor="nisn">NISN</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nisn siswa" 
                        required
                        {...register("nisn")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nis">NIS</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nis siswa" 
                        required
                        {...register("nis")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nama">Nama Siswa</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nama siswa" 
                        required
                        {...register("nama")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nisn">No Telepon</label>
                        <input 
                        type="text"
                        placeholder="Masukkan no telp siswa" 
                        required
                        {...register("no_telp")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="">Kelas</label>
                        <Select
                        maxMenuHeight={150}
                        options={kelas}
                        value={selectedKelas}
                        className="selectInput"
                        onChange={setSelectedKelas}
                        required
                        />
                    </div>
                    <div className="formSub">
                        <label htmlFor="nama">Alamat Siswa</label>
                        <input
                        type="text"
                        placeholder="Masukkan alamat siswa" 
                        className="alamatForm"
                        required
                        {...register("alamat")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="">Id SPP</label>
                        <Select
                        maxMenuHeight={140}
                        menuPlacement="top"
                        options={spp}
                        value={selectedSpp}
                        className="selectInput"
                        onChange={setSelectedSpp}
                        required
                        />
                    </div>
                </div>
            </form>
        </>
     );
}

export default NewSiswa;