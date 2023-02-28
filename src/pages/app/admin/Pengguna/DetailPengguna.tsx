import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { Level, levelOptions, Pengguna } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

function DetailPengguna() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [penggunaD, setPenggunaD] = useState<Pengguna>();
    const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);

    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT *, id_user AS id FROM pengguna WHERE id_user = ${id}`;
        connectionSql.query(`${sqlSt}`, (err, results, fields) => {
            if(err) console.error(err)
            else{
                const dataReturn: Pengguna = results[0];
                const selectedLevel = levelOptions.filter(
                    (obj : Level) => obj.value == dataReturn.level
                )
                setSelectedLevel(selectedLevel[0]);
                setPenggunaD(dataReturn);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const updateSt = `UPDATE pengguna SET username = '${data.username}', nama_pengguna = '${data.nama_pengguna}', level = '${selectedLevel.value}' WHERE id_user = ${id}`;
        //console.log(updateSt);
        connectionSql.query(updateSt, (err, results) => {
            if(err) console.error(err)
            else{
                console.log("update berhasil");
                console.log(results);
            }
        })
    })

    const deleteData = () => {
        const deleteSt = `DELETE FROM pengguna WHERE id_user = ${id}`;
        connectionSql.query(deleteSt, (err, results) => {
            if(err) console.error(err)
            else{
                console.log("hapus berhasil");
                console.log(results);
                navigate("/app/a/pengguna");
            }
        })
    }

    if(loading) {
        return (
            <>
                <Navbar/>

                <div className="penggunaContainer">
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
                <title>SPPAY - Detail Pengguna</title>
            </Helmet>

            <Navbar/>

            <form className="penggunaContainer" onSubmit={submitHandler}>

                { /*Modal for Delete*/}
                <Modal
                open={isOpen} 
                close={setIsOpen} 
                event={deleteData} 
                title={`Hapus Data`}
                desc={`Tindakan ini akan menghapus data secara permanen.
                Apakah kamu yakin akan menghapus data ini?`}/>

                <div className="formTitle">
                    <h2>Ubah Pengguna</h2>
                    <div>
                        <Link to="ubah-pass" className="btn2Title">
                            <span>
                                <Icon icon="carbon:password"/>
                                Ubah Password Pengguna
                            </span>
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
                        <label htmlFor="username">Username</label>
                        <input 
                        type="text" 
                        placeholder="Masukkan username pengguna"
                        defaultValue={penggunaD?.username}
                        required
                        {...register("username")}
                        />
                    </div>
                    <div className="formSub">
                        <label htmlFor="nama_pengguna">Nama Pengguna</label>
                        <input 
                        type="text" 
                        placeholder="Masukkan nama pengguna"
                        defaultValue={penggunaD?.nama_pengguna}
                        required
                        {...register("nama_pengguna")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="level">Pilih Level</label>
                        <Select
                        options={levelOptions}
                        value={selectedLevel}
                        className="selectInput"
                        onChange={setSelectedLevel}
                        required
                        />
                    </div>
                </div>
            </form>
        </>
     );
}

export default DetailPengguna;