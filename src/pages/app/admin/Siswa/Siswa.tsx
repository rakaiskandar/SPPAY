import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { Semester, semesterOptions, SiswaTypeList } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "@/style/adminGeneral.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";
import Select from "react-select";

function Siswa() {
    const user = useRecoilValue(userState);
    const [siswa, setSiswa] = useState<SiswaTypeList>([]);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        semesterOptions[0]
    )
    const [filterInput, setFilterInput] = useState<string>("");
    const [isFilter, setIsFilter] = useState<boolean>(false);

    const handleFilterChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || "";
        setFilterInput(value);
    }

    useEffect(() => {
        connectionSql.connect();
        var stateSql = 
        "SELECT siswa.nisn, siswa.nisn AS id,siswa.nis, siswa.nama, kelas.nama_kelas, siswa.alamat, siswa.no_telp FROM siswa, kelas WHERE siswa.id_kelas = kelas.id_kelas";
        connectionSql.query(stateSql, (err, results) => {
            if (err) console.error(err);
            else{
                setSiswa(results);
            }
        })
    }, [])

    const dataMemo = useMemo(() => siswa, [siswa]);
    const columns = 
    isFilter !== true ?
        useMemo(
        () =>[ {
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
                        <>-</>
                    )}
                </span>
            )
        } ],
        []
    ) :
    useMemo(
        () =>[ {
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
       ],
        []
    ) 

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Siswa</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="container">
                <div className="siswaHead">
                    <div className="siswaHeadSub">
                        <h2>Siswa</h2>
                    </div>
                    
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
                    <Select
                    options={semesterOptions}
                    value={selectedSemester}
                    placeholder="Pilih semester"
                    className="selectInput"
                    theme={(theme) => ({
                            ...theme,
                            borderRadius: 5,
                            colors: {
                              ...theme.colors,
                              primary25: '#E5E7EB',
                              primary: '#535bf2',
                            },
                    })}
                    onChange={
                            (value) => {
                                var stateSql = 
                                `SELECT siswa.nisn, siswa.nisn AS id,siswa.nis, siswa.nama, kelas.nama_kelas, siswa.alamat, siswa.no_telp, spp.status_bayar FROM siswa, kelas, spp, pembayaran WHERE siswa.id_kelas = kelas.id_kelas AND pembayaran.nisn = siswa.nisn AND pembayaran.id_spp = spp.id_spp AND spp.semester = ${value?.value}`;
                                connectionSql.query(stateSql, (err, results) => {
                                    if (err) console.error(err);
                                    else{
                                        setSiswa(results);
                                        setSelectedSemester(value);
                                        setIsFilter(true);
                                    }
                                })  
                            }
                        }
                    />
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