import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import "@/style/adminDetail.scss";
import { useForm } from "react-hook-form";
import { Level, levelOptions, Pengguna } from "@/dataStructure";
import { useEffect, useState } from "react";
import Select from "react-select";
import { connectionSql } from "@/sqlConnect";
import sha1 from "sha1";
import { Icon } from "@iconify/react";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";
import { toast } from "react-toastify";

function NewPengguna() {
    const user = useRecoilValue(userState);
    const { register, formState: { errors }, handleSubmit } = useForm<Pengguna>();
    const navigate = useNavigate();

    const [lastId, setLastId] = useState<number>(0);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(
        levelOptions[0]
    );
    
    useEffect(() => {
        const lastId = "SELECT id_user FROM pengguna ORDER BY id_user DESC LIMIT 1";
        connectionSql.query(lastId, (err, results, fields) => {
            if (err) console.error(err)
            else{
                setLastId(results[0].id_user);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const addSt = `INSERT INTO pengguna (id_user, username, password, nama_pengguna, level) VALUES ('${lastId + 1}', '${data.username}', '${sha1(data.password)}', '${data.nama_pengguna}', '${selectedLevel!.value}')`;
        // console.log(addSt);
        connectionSql.query(addSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Tambah pengguna berhasil!", { autoClose: 1000})
                navigate(-1);
            }
        })
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Tambah Pengguna Baru</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
                <div className="formTitle">
                    <h2>Tambah Pengguna</h2>
                    <div>
                        <Link to="/app/a/pengguna" className="btn2Title">
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
                        <label htmlFor="username">Username</label>
                        <input 
                        type="text" 
                        placeholder="Masukkan username pengguna"
                        {...register("username", { required: true })}
                        />
                        {errors.username && <p className="error">Username harus dimasukkan</p>}
                    </div>
                    <div className="formSub">
                        <label htmlFor="password">Password</label>
                        <input 
                        type="password" 
                        placeholder="Masukkan password untuk pengguna"
                        {...register("password", { required: true, minLength: 6})}
                        />
                        {errors.password && <p className="error">Kata sandi minimal 6 karakter</p>}
                    </div>
                    <div className="formSub">
                        <label htmlFor="nama_pengguna">Nama Pengguna</label>
                        <input 
                        type="text" 
                        placeholder="Masukkan nama pengguna"
                        {...register("nama_pengguna", { required: true})}/>
                        {errors.nama_pengguna && <p className="error">Nama pengguna harus dimasukkan</p>}
                    </div>
                    <div className="formSub">
                        <label htmlFor="level">Pilih Level</label>
                        <Select
                        options={levelOptions}
                        value={selectedLevel}
                        className="selectInput"
                        onChange={setSelectedLevel}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: '#E5E7EB',
                              primary: '#535bf2',
                            },
                          })}
                        required
                        />
                    </div>
                </div>
            </form>
        </>
     );
}

export default NewPengguna;