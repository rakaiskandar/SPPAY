import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { Kelas, KelasTypeList, Siswa, SPPOptions } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

function DetailSiswa() {
    const { id } = useParams();
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [siswaD, setSiswaD] = useState<Siswa>();
    const [kelas, setKelas] = useState<KelasTypeList>([]);
    const [spp, setSpp] = useState<SPPOptions[]>([]);
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>();
    const [selectedSpp, setSelectedSpp] = useState<SPPOptions | null>();

    const { register, handleSubmit } = useForm<Siswa>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const sqlSt = `SELECT *, nisn AS id FROM siswa WHERE nisn = ${id}`;
        const kelasSt = "SELECT nama_kelas AS label, id_kelas, id_kelas AS value FROM kelas";
        const sppSt = "SELECT id_spp AS label, id_spp AS value FROM spp";
        connectionSql.query(`${sqlSt}; ${kelasSt}; ${sppSt}`, (err, results, fields) => {
            if(err) console.error(err);
            else{
                const dataReturn: Siswa = results[0][0];
                const kelasReturn = results[1];
                const sppReturn = results[2];
                const selectedKelas = kelasReturn.filter(
                    (obj: Kelas) => obj.id_kelas == dataReturn.id_kelas
                )
                const selectedSpp = sppReturn.filter(
                    (obj: SPPOptions) => obj.value == dataReturn.id_spp
                )
                setSiswaD(dataReturn);
                setKelas(kelasReturn);
                setSpp(sppReturn);
                setSelectedKelas(selectedKelas);
                setSelectedSpp(selectedSpp);
                setLoading(false);
            }
        })
    }, [])

    const submitHandler = handleSubmit((data) => {
        const updateSt = `UPDATE siswa SET nisn = '${data.nisn}', 
        nis = '${data.nis}', nama = '${data.nama}', 
        id_kelas = '${selectedKelas?.id_kelas}', 
        alamat = '${data.alamat}', no_telp = '${data.no_telp}' WHERE nisn = '${id}'`;
        // console.log(updateSt);
        connectionSql.query(updateSt, (err) => {
            if (err) console.error(err)
            else{
                toast.success("Ubah siswa berhasil!", { autoClose: 1000})
                navigate("/app/a/siswa")
            }
        });
    });

    const deleteData = () => {
        const deleteSt = `DELETE FROM siswa WHERE nisn = ${id}`;
        connectionSql.query(deleteSt, (err) => {
            if(err) console.error(err)
            else{
                toast.success("Hapus siswa berhasil!", { autoClose: 1000})
                navigate("/app/a/siswa")
            }
        })
    }

    if(loading) {
        return (
            <>
                <Navbar user={user}/>

                <div className="container">
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
                <title>SPPAY - Detail Siswa</title>
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
                    <h2>Detail Siswa</h2>
                    <div>
                        <Link to="/app/a/siswa" className="btn2Title">
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
                        <label htmlFor="nisn">NISN</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nisn siswa" 
                        defaultValue={siswaD?.nisn}
                        required
                        {...register("nisn")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nis">NIS</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nis siswa" 
                        defaultValue={siswaD?.nis}
                        required
                        {...register("nis")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nama">Nama Siswa</label>
                        <input 
                        type="text"
                        placeholder="Masukkan nama siswa" 
                        defaultValue={siswaD?.nama}
                        required
                        {...register("nama")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="nisn">No Telepon</label>
                        <input 
                        type="text"
                        placeholder="Masukkan no telp siswa" 
                        defaultValue={siswaD?.no_telp}
                        required
                        {...register("no_telp")}/>
                    </div>
                    <div className="formSub">
                        <label htmlFor="">Kelas</label>
                        <Select
                        maxMenuHeight={100}
                        options={kelas}
                        value={selectedKelas}
                        className="selectInput"
                        onChange={setSelectedKelas}
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
                    <div className="formSub">
                        <label htmlFor="nama">Alamat Siswa</label>
                        <input
                        type="text"
                        placeholder="Masukkan alamat siswa" 
                        defaultValue={siswaD?.alamat}
                        required
                        {...register("alamat")}/>
                    </div>
                </div>
            </form>
        </>
     );
}

export default DetailSiswa;