import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import "@/style/adminDetail.scss";
import { useForm } from "react-hook-form";
import { Kelas, KompetensiKeahlian, kompetensiOptions } from "@/dataStructure";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";

function NewKelas() {
    const user = useRecoilValue(userState);
    const { register, handleSubmit } = useForm<Kelas>();
    const navigate = useNavigate();

    const [lastId, setLastId] = useState<number>(0);
    const [selectedKompetensi, setSelectedKompetensi] = useState<KompetensiKeahlian>(
        kompetensiOptions[0]
    );

    useEffect(() => {
        const lastId = "SELECT id_kelas FROM kelas ORDER BY id_kelas DESC LIMIT 1";
        connectionSql.query(lastId, (err, results, fields) => {
            if (err) console.error(err);
            else{
                setLastId(results[0].id_kelas)
            }
        })
    })

    const submitHandler = handleSubmit((data) => {
        const addSt = `INSERT INTO kelas (id_kelas, nama_kelas, kompetensi_keahlian, jumlah_siswa) VALUES ('${lastId + 1}', '${data.nama_kelas}', '${selectedKompetensi.value}', 0)`;
        connectionSql.query(addSt, (err) => {
            if (err) console.error(err)
            else{
                toast.success("Tambah kelas berhasil!", { autoClose: 1000})
                navigate(-1);
            }
        })
    })
    
    return ( 
        <>
            <Helmet>
                <title>SPPAY - Tambah Kelas Baru</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
                <div className="formTitle">
                    <h2>Tambah Kelas</h2>
                    <div>
                        <Link to="/app/a/kelas" className="btn2Title">
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
                        <label htmlFor="nama_kelas">Nama Kelas</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nama kelas" 
                        required
                        {...register("nama_kelas")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="kompetensi_keahlian">Kompetensi Keahlian</label>
                        <Select
                            maxMenuHeight={170}
                            options={kompetensiOptions}
                            value={selectedKompetensi}
                            className="selectInput"
                            onChange={setSelectedKompetensi}
                            required
                        />
                    </div>
                </div>
            </form>
        </>
     );
}

export default NewKelas;