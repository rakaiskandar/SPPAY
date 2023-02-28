import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { PenggunaTypeList } from "@/dataStructure";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "@/style/adminGeneral.scss";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";

function Pengguna() {
    const user = useRecoilValue(userState)
    const [pengguna, setPengguna] = useState<PenggunaTypeList>([]);
    const [filterInput, setFilterInput] = useState<string>("");

    const handleFilterChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || "";
        setFilterInput(value);
    }

    useEffect(() => {
        connectionSql.connect();
        var stateSql = "SELECT *, `pengguna`.id_user AS id FROM `pengguna` WHERE `pengguna`.level != 'admin'";
        connectionSql.query(stateSql, (err, results) => {
            if (err) console.error(err);
            else{
                setPengguna(results);
            }
        })
    }, [])

    const dataMemo = useMemo(() => pengguna, [pengguna]);
    const columns = useMemo(
        () => [
            {
                Header: "ID User",
                accessor: "id",
                Cell: ({ cell: { value }} : { cell: { value: number}}) => (
                    <span>#{value}</span>
                )   
             },
            {
               Header: "Username",
               accessor: "username"  
            },
            {
                Header: "Nama Pengguna",
                accessor: "nama_pengguna"  
            },
            {
                Header: "Level",
                accessor: "level",
                Cell: ({ cell: { value } } : { cell: { value: string}}) => (
                    <span className="penggunaRole">
                        {value === "admin" ? 
                        <>
                            <p>🧑🏻‍💻</p>
                            <h5 className="aType">{value}</h5>
                        </> 
                        : value === "siswa"
                        ? 
                        <>
                            <p>🧑🏻‍💼</p>
                            <h5 className="sType">{value}</h5>
                        </>
                        : value === "petugas"
                        ? 
                        <>
                            <p>🧑🏻‍🎓</p>
                            <h5 className="pType">{value}</h5>
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
                <title>SPPAY - Pengguna</title>
            </Helmet>

            <Navbar user={user}/>
            
            <main className="penggunaContainer">
                <div className="penggunaHead">
                    <h2>Pengguna</h2>
                    <Link to="new">
                        <button>
                            <Icon icon="akar-icons:plus"/>
                            Tambah Pengguna
                        </button>
                    </Link>
                </div>

                <div className="filterInput">
                    <input 
                    type="text"
                    placeholder="Cari nama pengguna" 
                    value={filterInput}
                    onChange={handleFilterChange}/>
                </div>
                
                {dataMemo.length ? (
                    <Table
                    columns={columns}
                    data={dataMemo}
                    filterColumn="username"
                    filterInput={filterInput}
                    />
                ) : (
                    <EmptyTable columns={columns}/>
                )}
                
            </main>
        </>
     );
}

export default Pengguna;