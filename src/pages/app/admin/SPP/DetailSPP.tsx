import { userState } from "@/atoms/userAtom";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { SPP } from "@/dataStructure";
import { inputRupiahFormatted } from "@/helpers/inputRupiahFormatted";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function DetailSPP() {
    const user = useRecoilValue(userState);
    const { id } = useParams();
    const navigate = useNavigate();
    const [sppD, setSppD] = useState<SPP>();

    const { register, handleSubmit} = useForm();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT *, id_spp AS id FROM spp WHERE id_spp = ${id}`;
        connectionSql.query(sqlSt, (err, results) => {
            if(err) console.error(err)
            else{
                const dataReturn: SPP = results[0];
                setSppD(dataReturn);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const convertedNominal = parseInt(data.nominal.length < 4 ? data.nominal : data.nominal.split(".").join(""));
        const updateSt = `UPDATE spp SET nominal = '${convertedNominal}' WHERE id_spp = ${id}`;
        connectionSql.query(updateSt, (err, results) => {
            if(err) console.error(err)
            else{
                console.log("update berhasil");
                console.log(results);
                navigate("/app/a/spp")
            }
        })
    })

    const deleteData = () => {
        const deleteSt = `DELETE FROM spp WHERE id_spp = ${id}`;
        connectionSql.query(deleteSt, (err, results) => {
            if(err) console.error(err)
            else{
                console.log("hapus berhasil");
                console.log(results);
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
                        readOnly
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
                        readOnly
                        defaultValue={sppD?.status_bayar}
                        />
                    </div>
                </div>
            </form>
        </>
     );
}

export default DetailSPP;