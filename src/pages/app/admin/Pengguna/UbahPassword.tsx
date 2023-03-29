import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import Navbar from "@/components/Navbar";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import sha1 from "sha1";
import { toast } from "react-toastify";
import { Pengguna } from "@/dataStructure";

function UbahPassword() {
    const user = useRecoilValue(userState);
    let { id } = useParams();
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit } = useForm<Pengguna>();
    
    const submitHandler = handleSubmit((data) => {
        let pass = data.password
        let confirmPass = data.confirm_pass;

        if (pass == confirmPass) {
            const updateSt = `UPDATE pengguna SET password = '${sha1(data.password)}' WHERE id_user = ${id}`;
            connectionSql.query(updateSt, (err) => {
                if(err) console.error(err)
                else{
                    toast.success("Ubah kata sandi pengguna berhasil!", { autoClose: 1000})
                    navigate("/app/a/pengguna")
                }
            })
        }else{
            toast.error("Kata sandi tidak sama", { autoClose: 1000})
        }
    })

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Ubah Password Pengguna</title>
            </Helmet>

            <Navbar user={user}/>

            <form className="container" onSubmit={submitHandler}>
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
                        {...register("password", { required: true, minLength: 6})}
                        />
                        {errors.username && <p className="error">Kata sandi minimal 6 karakter</p>}
                    </div>
                    <div className="formSub">
                        <label htmlFor="password">Konfirmasi Password</label>
                        <input 
                        type="password"
                        placeholder="Konfirmasi password"
                        {...register("confirm_pass", { required: true})}
                        />
                        {errors.confirm_pass && <p className="error">Kata sandi tidak terkonfirmasi</p>}
                    </div>
                </div>
            </form>
        </>
     );
}

export default UbahPassword;