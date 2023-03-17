import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { KelasTypeList } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "@/style/adminGeneral.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";

function Kelas() {
    const user = useRecoilValue(userState)
    const [kelas, setKelas] = useState<KelasTypeList>([]);
    const [filterInput, setFilterInput] = useState<string>("");

    const handleFilterChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || "";
        setFilterInput(value);
    }

    useEffect(() => {
        connectionSql.connect();
        var stateSql = "SELECT *, id_kelas AS id FROM `kelas`";
        connectionSql.query(stateSql, (err, results) => {
            if (err) console.error(err);
            else{
                setKelas(results);
            }
        })
    }, [])

    const dataMemo = useMemo(() => kelas, [kelas]);
    const columns = useMemo(
        () => [
            {
                Header: "Id Kelas",
                accessor: "id",
                Cell: ({ cell: { value }} : { cell: { value: number}}) => (
                    <span>#{value}</span>
                )  
            },
            {
               Header: "Nama Kelas",
               accessor: "nama_kelas"  
            },
            {
                Header: "Jumlah Siswa",
                accessor: "jumlah_siswa"  
            },
            {
                Header: "Kompetensi Keahlian",
                accessor: "kompetensi_keahlian",  
                Cell: ({ cell: { value } } : { cell: { value: string}} ) => (
                    <span 
                    className="kelasKompetensi">
                        {value === "Rekayasa Perangkat Lunak" ? 
                        <>
                            <p className="rpl">💻</p>
                            <h5 className="rplType">{value}</h5>
                        </>
                        : value === "Teknik Komputer Jaringan" ?
                        <>
                            <p className="tkj">📡</p>
                            <h5 className="tkjType">{value}</h5>
                        </>
                        : value === "Multimedia" ?
                        <>
                            <p className="mm">🎨</p>
                            <h5 className="mmType">{value}</h5>
                        </>
                        : value === "Teknik Audio Video" ?
                        <>
                            <p className="tav">🔊</p>
                            <h5 className="tavType">{value}</h5>
                        </>
                        : value === "Teknik Instalasi Tenaga Listrik" ?
                        <>
                            <p className="titl">⚡</p>
                            <h5 className="titlType">{value}</h5>
                        </>
                        : value === "Teknik Otomasi Industri" ?
                        <>
                            <p className="toi">🏭</p>
                            <h5 className="toiType">{value}</h5>
                        </>
                        : ""
                    }
                    </span>
                )
            },
        ],
        []
    )

    return ( 
        <>
            <Helmet>
                <title>SPPAY - Kelas</title>
            </Helmet>

            <Navbar user={user}/>
            
            <main className="container">
                <div className="kelasHead">
                    <h2>Kelas</h2>
                    <Link to="new">
                        <button>
                            <Icon icon="akar-icons:plus"/>
                            Tambah Kelas
                        </button>
                    </Link>
                </div>

                <div className="filterInput">
                    <input 
                    type="text"
                    placeholder="Cari nama kelas"
                    value={filterInput}
                    onChange={handleFilterChange} />
                </div>

                {dataMemo.length ? (
                    <Table 
                    columns={columns}
                    data={dataMemo}
                    filterColumn="nama_kelas"
                    filterInput={filterInput} />
                ) : (
                    <EmptyTable columns={columns}/>
                )}
                
            </main>
        </>
     );
}

export default Kelas;