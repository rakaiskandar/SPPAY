import { userState } from "@/atoms/userAtom";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { Semester, semesterOptions, SPP } from "@/dataStructure";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatted";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";

function DetailSPP() {
    const user = useRecoilValue(userState);
    const { id } = useParams();
    const navigate = useNavigate();
    const [sppD, setSppD] = useState<SPP>();
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        semesterOptions[0]
    );

    const { register, handleSubmit} = useForm();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT *, id_spp AS id FROM spp WHERE id_spp = ${id}`;
        connectionSql.query(sqlSt, (err, results) => {
            if(err) console.error(err)
            else{
                const dataReturn: SPP = results[0];
                const selectedSemester = semesterOptions.filter(
                    (obj: Semester) => obj.value.toString() === dataReturn.semester
                )[0];
                setSelectedSemester(selectedSemester)
                setSppD(dataReturn);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const convertedNominal = parseInt(data.nominal.length < 4 ? data.nominal : data.nominal.split(".").join(""));
        const updateSt = `UPDATE spp SET nominal = '${convertedNominal}', semester = '${selectedSemester?.value}' WHERE id_spp = ${id}`;
        connectionSql.query(updateSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Tambah spp berhasil!", { autoClose: 1000})
                navigate("/app/a/spp")
            }
        })
    })

    const deleteData = () => {
        const deleteSt = `DELETE FROM spp WHERE id_spp = ${id}`;
        connectionSql.query(deleteSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Hapus spp berhasil!", { autoClose: 1000})
                navigate("/app/a/spp")
            }
        })
    }

    if(loading) {
        return (
            <>
                <Navbar user={user}/>

                <div className="container">
                    <div className="sppHead">
                        <h4>Loading...</h4>
                    </div>
                </div>
            </>
        )
    }

    return ( 
        <>  
            <Helmet>
                <title>SPPAY - Detail SPP</title>
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
                    <h2>Ubah SPP</h2>
                    <div>
                        <Link to="/app/a/spp" className="btn2Title">
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
                        <label htmlFor="nominal">Id SPP</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nominal spp siswa" 
                        disabled
                        defaultValue={sppD?.id_spp}
                        />
                    </div>
                    <div className="formSub">
                        <label htmlFor="nominal">Nominal</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nominal spp siswa" 
                        required
                        {...register("nominal")}
                        defaultValue={sppD?.nominal}
                        onKeyUp={(ev) => inputRupiahFormatted(ev.target)}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nominal">Status Bayar</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nominal spp siswa" 
                        disabled
                        defaultValue={sppD?.status_bayar}
                        />
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

export default DetailSPP;