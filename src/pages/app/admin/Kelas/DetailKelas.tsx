import Navbar from "@/components/Navbar";
import { Kelas, KompetensiKeahlian, kompetensiOptions } from "@/dataStructure";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";

function DetailKelas() {
    const { id } = useParams();
    const [kelasD, setKelasD] = useState<Kelas>();
    const [selectedKompetensi, setSelectedKompetensi] = useState(kompetensiOptions[0]);

    const { register, handleSubmit } = useForm<Kelas>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const sqlSt = `SELECT *, id_kelas AS id FROM kelas WHERE id_kelas = ${id}`;
        connectionSql.query(`${sqlSt}`, (err, results, fields) => {
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
        connectionSql.query(updateSt, (err, results, fields) => {
            if (err) console.error(err)
            else{
                console.log(results);
            }
        });
    });

    if(loading) {
        return (
            <>
                <Navbar/>

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

            <Navbar/> 

            <form className="kelasContainer" onSubmit={submitHandler}>
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