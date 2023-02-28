import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import Navbar from "@/components/Navbar";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import sha1 from "sha1";

function UbahPassword() {
    const user = useRecoilValue(userState);
    let { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    
    const submitHandler = handleSubmit((data) => {
        let pass = data.password
        let confirmPass = data.confirm_pass;

        if (pass == confirmPass) {
            const updateSt = `UPDATE pengguna SET password = '${sha1(data.password)}' WHERE id_user = ${id}`;
            connectionSql.query(updateSt, (err, results) => {
                if(err) console.error(err)
                else{
                    console.log(results);
                    navigate("/app/a/pengguna")
                }
            })
        }else{
            console.log("password salah")
        }
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Ubah Password Pengguna</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="penggunaContainer" onSubmit={submitHandler}>
                <div className="formTitle">
                    <h2>Ubah Password</h2>
                    <div>
                        <Link to="/app/a/pengguna" className="btn2Title">
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
                        <label htmlFor="password">Password Sekarang</label>
                        <input 
                        type="password"
                        placeholder="Masukkan password baru"
                        {...register("password")}
                        required />
                    </div>
                    <div className="formSub">
                        <label htmlFor="password">Konfirmasi Password</label>
                        <input 
                        type="password"
                        placeholder="Konfirmasi password"
                        {...register("confirm_pass")}
                        required />
                    </div>
                </div>
            </form>
        </>
     );
}

export default UbahPassword;