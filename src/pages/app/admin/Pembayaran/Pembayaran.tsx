import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { PembayaranTypeList } from "@/dataStructure";
import rupiahConverter from "@/helpers/rupiahConverter";
import { connectionSql } from "@/sqlConnect";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import "@/style/adminGeneral.scss";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";

function Pembayaran() {
  const user = useRecoilValue(userState);
  const [pembayaran, setPembayaran] = useState<PembayaranTypeList>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  useEffect(() => {
    connectionSql.connect();
    var stateSql =
      "SELECT pmb.id_pembayaran AS id, pmb.tgl_bayar, pmb.nama_petugas, s.nama AS nama_siswa, k.nama_kelas AS nama_kelas, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, kelas k, detail_pembayaran detP WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND s.id_kelas = k.id_kelas AND detP.id_pembayaran = pmb.id_pembayaran";
    connectionSql.query(stateSql, (err, results) => {
        if (err) console.error(err);
        else{
            setPembayaran(results)
        }
    })
  }, []);

  const dataMemo = useMemo(() => pembayaran, [pembayaran]);
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
            <>#{value}</>
        ),
      },
      {
        Header: "Tanggal Bayar",
        accessor: "tgl_bayar",
        Cell: ({ cell: { value } } : { cell: { value: Date}}) => (
            <span>{dayjs(value).format("D MMMM YYYY")}</span>
        ) 
      },
      {
        Header: "Petugas",
        accessor: "nama_petugas",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <span>{value}</span>
        ),
      },
      {
        Header: "Nama Siswa",
        accessor: "nama_siswa",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <span>{value}</span>
        ),
      },
      {
        Header: "Kelas",
        accessor: "nama_kelas",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <span>{value}</span>
        ),
      },
      {
        Header: "Jumlah Bayar",
        accessor: "jumlah_bayar",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
            <>{value}</>
        ),
      },
      {
        Header: "Bayar",
        accessor: "bayar",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
            <>{rupiahConverter(value)}</>
        ),
      },
      {
        Header: "Status Bayar",
        accessor: "status_bayar",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <span className="paidStatus">
              {value === "Lunas" ? (
                <>
                  {/* <Icon icon="material-symbols:check-circle-outline-rounded" color="green" width="20"/> */}
                  <span>🥳</span>
                  <p className="lunas">{value}</p>
                </>
              ) : (
                <>
                  {/* <Icon icon="radix-icons:cross-circled" color="red" width="20"/> */}
                  <span>😢</span>
                  <p className="belumLunas">{value}</p>
                </>
              )}
            </span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Helmet>
        <title>SPPAY - Pembayaran</title>
      </Helmet>

      <Navbar user={user}/>

      <main className="container">
        <div className="pembayaranHead">
          <h2>Pembayaran</h2>
          <div>
            <Link to="new">
              <button>
                <Icon icon="akar-icons:plus" />
                Tambah Pembayaran
              </button>
            </Link>
            <button className="btnLaporan">
              <Icon icon="material-symbols:print-outline-rounded"/>
              Generate Laporan
            </button>
          </div>
        </div>

        <div className="filterInput">
          <input
            type="text"
            placeholder="Cari tanggal pembayaran"
            value={filterInput}
            onChange={handleFilterChange}
          />
        </div>

        {dataMemo.length ? (
            <Table
            columns={columns}
            data={dataMemo}
            filterColumn="nama_siswa"
            filterInput={filterInput}
            />
        ) : (
            <EmptyTable columns={columns} />
        )}
       
      </main>
    </>
  );
}

export default Pembayaran;
