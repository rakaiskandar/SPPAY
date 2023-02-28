import Navbar from "@/components/Navbar";
import { Kelas, KompetensiKeahlian, kompetensiOptions } from "@/dataStructure";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";

function DetailKelas() {
    const { id } = useParams();
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [kelasD, setKelasD] = useState<Kelas>();
    const [selectedKompetensi, setSelectedKompetensi] = useState(kompetensiOptions[0]);

    const { register, handleSubmit } = useForm<Kelas>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT *, id_kelas AS id FROM kelas WHERE id_kelas = ${id}`;
        connectionSql.query(`${sqlSt}`, (err, results) => {
            if (err) console.error(err);
            else{
                const dataReturn: Kelas = results[0];
                const selectedKompetensi = kompetensiOptions.filter(
                    (obj: KompetensiKeahlian) => obj.value == dataReturn.kompetensi_keahlian
                )[0];
                setSelectedKompetensi(selectedKompetensi);
                setKelasD(dataReturn);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const updateSt = `UPDATE kelas SET nama_kelas = '${data.nama_kelas}', kompetensi_keahlian = '${selectedKompetensi.value}' WHERE id_kelas = ${id}`;
        connectionSql.query(updateSt, (err, results) => {
            if (err) console.error(err)
            else{
                console.log("update berhasil");
                console.log(results);
            }
        });
    });

    const deleteData = () => {
        const deleteSt = `DELETE FROM kelas WHERE id_kelas = ${id}`;
        connectionSql.query(deleteSt, (err, results) => {
            if(err) console.error(err)
            else{
                console.log("hapus berhasil");
                console.log(results);
                navigate("/app/a/kelas");
            }
        })
    }

    if(loading) {
        return (
            <>
                <Navbar user={user}/>

                <div className="kelasContainer">
                    <div className="kelasHead">
                        <h4>Loading...</h4>
                    </div>
                </div>
            </>
        )
    }

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Detail Kelas</title>
            </Helmet>

            <Navbar user={user}/> 

            <form className="kelasContainer" onSubmit={submitHandler}>

                { /*Modal for Delete*/}
                <Modal
                open={isOpen} 
                close={setIsOpen} 
                event={deleteData} 
                title={`Hapus Data`}
                desc={`Tindakan ini akan menghapus data secara permanen.
                Apakah kamu yakin akan menghapus data ini?`}/>

                <div className="formTitle">
                    <h2>Ubah Kelas</h2>
                    <div>
                        <Link to="/app/a/kelas" className="btn2Title">
                            <Icon icon="material-symbols:arrow-back-rounded"/>
                            Kembali
                        </Link>
                        <button className="btn1Title">
                            <Icon icon="ic:outline-save-alt"/>
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div className="hapusContainer">
                    <div className="hapusBtn" onClick={() => setIsOpen(true)}>
                        <Icon icon="ion:trash-outline"/>
                        Hapus Data
                    </div>
                </div>
                <div className="formContainerDetail">
                    <div className="formSub">
                        <label htmlFor="nama_kelas">Nama Kelas</label>
                        <input 
                        type="text"
                        defaultValue={kelasD?.nama_kelas}
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

export default DetailKelas;