import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { Semester, semesterOptions } from "@/dataStructure";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatted";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";

function NewSPP() {
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    
    const { register, handleSubmit } = useForm();
    const [lastId, setLastId] = useState<number>(0);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        semesterOptions[0]
    );

    useEffect(() => {
        const lastId = "SELECT id_spp FROM spp ORDER BY id_spp DESC LIMIT 1";
        connectionSql.query(lastId, (err, results) => {
            if(err) console.error(err);
            else{
                setLastId(results[0].id_spp)
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const convertedNominal = parseInt(data.nominal.length < 4 ? data.nominal : data.nominal.split(".").join(""))
        const addSt = `INSERT INTO spp (id_spp, semester, nominal, status_bayar) VALUES('${lastId + 1}', ${selectedSemester?.value}, '${convertedNominal}', 'Belum')`;
        connectionSql.query(addSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Tambah spp berhasil!", { autoClose: 1000})
                navigate(-1);
            }
        })
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Tambah SPP Baru</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
                <div className="formTitle">
                    <h2>Tambah SPP</h2>
                    <div>
                        <Link to="/app/a/spp" className="btn2Title">
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
                        <label htmlFor="nominal">Nominal</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nominal spp siswa" 
                        required
                        {...register("nominal")}
                        onKeyUp={(ev) => inputRupiahFormatted(ev.target)}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="semester">Pilih semester</label>
                        <Select 
                        options={semesterOptions}
                        value={selectedSemester}
                        placeholder="Pilih semester"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                            ...theme.colors,
                            primary25: '#E5E7EB',
                            primary: '#535bf2',
                            },
                        })}
                        onChange={
                            setSelectedSemester
                        }/>
                    </div>
                </div>
            </form>
        </>
     );
}

export default NewSPP;