import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { Icon } from "@iconify/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/adminGeneral.scss";
import { useEffect, useMemo, useState } from "react";
import { connectionSql } from "@/sqlConnect";
import { SPPTypeList } from "@/dataStructure";
import rupiahConverter from "@/helpers/rupiahConverter";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";

function SPP() {
    const user = useRecoilValue(userState);
    const [spp, setSpp] = useState<SPPTypeList>([]);
    const [filterInput, setFilterInput] = useState<string>("");
    
    const handleFilterChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || "";
        setFilterInput(value);
    }

    useEffect(() => {
        connectionSql.connect();
        var stateSql = "SELECT *, id_spp, id_spp AS id FROM spp";
        connectionSql.query(stateSql, (err, results) => {   
            if(err) console.error(err)
            else{
                setSpp(results);
            }
        })
    },[])

    const dataMemo = useMemo(() => spp, [spp]);
    const columns = useMemo(
        () => [
            {
                Header: "Id SPP",
                accessor: "id_spp", 
                Cell: ({ cell: { value } } : { cell: { value : number }}) => (
                    <span>#{value}</span>
                ) 
            },
            {
               Header: "Semester",
               accessor: "semester"  
            },
            {
                Header: "Nominal",
                accessor: "nominal",
                Cell: ({ cell: { value } } : { cell: { value : number }}) => (
                    <>{rupiahConverter(value)}</>
                )  
            },
        ],
        []
    );

    return ( 
        <>
            <Helmet>
                <title>SPPAY - SPP</title>
            </Helmet>

            <Navbar user={user}/>

            <main className="container">
                <div className="sppHead">
                <h2>SPP</h2>
                    <Link to="new">
                        <button>
                            <Icon icon="akar-icons:plus"/>
                            Tambah SPP
                        </button>
                    </Link>
                </div>

                <div className="filterInput">
                    <input 
                    type="text"
                    placeholder="Cari id spp" 
                    value={filterInput}
                    onChange={handleFilterChange}/>
                </div>
                
                {dataMemo.length ? (
                    <Table 
                    columns={columns} 
                    data={dataMemo} 
                    filterColumn="semester"
                    filterInput={filterInput}/>
                ) : (
                    <EmptyTable columns={columns}/>
                )}
            </main>
        </>
     );
}

export default SPP;