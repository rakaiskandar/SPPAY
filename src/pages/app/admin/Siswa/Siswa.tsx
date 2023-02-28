import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { SiswaTypeList } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "../../../../style/adminGeneral.scss";

function Siswa() {
    const [siswa, setSiswa] = useState<SiswaTypeList>([]);
    const [filterInput, setFilterInput] = useState<string>("");

    const handleFilterChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || "";
        setFilterInput(value);
    }

    useEffect(() => {
        connectionSql.connect();
        var stateSql = 
        "SELECT siswa.nisn, siswa.nisn AS id,siswa.nis, siswa.nama, kelas.nama_kelas, siswa.alamat, siswa.no_telp, spp.status_bayar FROM siswa, kelas, spp WHERE siswa.id_kelas = kelas.id_kelas AND spp.id_spp = siswa.id_spp";
        connectionSql.query(stateSql, (err, results) => {
            if (err) console.error(err);
            else{
                setSiswa(results);
                // console.log(results);
            }
        })
    }, [])

    const dataMemo = useMemo(() => siswa, [siswa]);
    const columns = useMemo(
        () => [
            {
                Header: "NISN",
                accessor: "id",  
            },
            {
               Header: "NIS",
               accessor: "nis"  
            },
            {
                Header: "Nama Siswa",
                accessor: "nama"  
            },
            {
                Header: "Kelas",
                accessor: "nama_kelas",
                Cell: ({ cell: { value } } : { cell: { value : string }}) => (
                    <span className="kelasT">{value}</span>
                )
            },
            {
                Header: "Alamat",
                accessor: "alamat"
            },
            {
                Header: "No Telp",
                accessor: "no_telp"  
            },
            {
                Header: "Status Bayar",
                accessor: "status_bayar",
                Cell: ({ cell: { value }} : {cell: { value: string}}) => (
                    <span className="paidStatus">
                        {value === "Sudah" ? (
                            <>
                                {/* <Icon icon="material-symbols:check-circle-outline-rounded" color="green" width="20"/> */}
                                <span>😎</span>
                                <p className="lunas">{value}</p>
                            </>
                        ) : (
                            <>
                                {/* <Icon icon="radix-icons:cross-circled" color="red" width="20"/> */}
                                <span>😣</span>
                                <p className="belumLunas">{value}</p>
                            </>
                        )}
                    </span>
                )
            }
        ],
        []
    )

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Siswa</title>
            </Helmet>

            <Navbar/>

            <main className="siswaContainer">
                <div className="siswaHead">
                    <h2>Siswa</h2>
                    <Link to="new">
                        <button>
                            <Icon icon="akar-icons:plus"/>
                            Tambah Siswa
                        </button>
                    </Link>
                </div>

                <div className="filterInput">
                    <input 
                    type="text"
                    placeholder="Cari nama siswa" 
                    value={filterInput}
                    onChange={handleFilterChange}/>
                </div>

                {dataMemo.length ? (
                    <Table
                    columns={columns}
                    data={dataMemo}
                    filterColumn="nama"
                    filterInput={filterInput}
                    />
                ) : (
                    <EmptyTable columns={columns}/>
                )}
                
            </main>
        </>
     );
}

export default Siswa;