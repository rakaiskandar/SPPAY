import EmptyTable from "@/components/EmptyTable";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { Bulan, bulanOptions, PembayaranTypeList } from "@/dataStructure";
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
import { CSVLink } from "react-csv";
import getHeaderCsv from "@/helpers/getHeaderCsv";
import generateRandomId from "@/helpers/generateRandomId";
import Select from "react-select";

function Pembayaran() {
  const user = useRecoilValue(userState);

  //Get Month
  let monthNow = new Date().getMonth();
  const [pembayaran, setPembayaran] = useState<PembayaranTypeList>([]);
  const [selectedBulan, setSelectedBulan] = useState<Bulan | null>(
    bulanOptions[monthNow]
  );

  const [filterInput, setFilterInput] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false);

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
  const columns = 
  isFilter !== true ? 
  useMemo(
    () => [
      {
        Header: "Id Pembayaran",
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
  ) : 
  useMemo(
    () => [
      {
        Header: "Id Pembayaran",
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
  
  //Get today date
  let dateNow = new Date().toLocaleDateString("en-US").toString();
  //Date now
  const formatDate = dayjs(dateNow).format("D MMMM YYYY");
  
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
            <CSVLink className="btnLaporan" data={dataMemo} filename={`Laporan Pembayaran SPP-${generateRandomId(5)}-${formatDate}`} headers={getHeaderCsv(columns)}>
              <Icon icon="material-symbols:print-outline-rounded"/>
              Unduh Laporan Pembayaran
            </CSVLink>
          </div>
        </div>

        <div className="filterInput">
          <input
            type="text"
            placeholder="Cari tanggal pembayaran"
            value={filterInput}
            onChange={handleFilterChange}
          />
          <Select
          options={bulanOptions}
          value={selectedBulan}
          placeholder="Pilih bulan"
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
                `SELECT pmb.id_pembayaran AS id, pmb.tgl_bayar, pmb.nama_petugas, s.nama AS nama_siswa, k.nama_kelas AS nama_kelas, pmb.status_bayar, pmb.jumlah_bayar, detP.bayar FROM pembayaran pmb, siswa s, pengguna p, kelas k, detail_pembayaran detP WHERE pmb.id_user = p.id_user AND pmb.nisn = s.nisn AND s.id_kelas = k.id_kelas AND detP.id_pembayaran = pmb.id_pembayaran AND MONTH(pmb.tgl_bayar) = ${value?.value}`;
              connectionSql.query(stateSql, (err, results) => {
                  if (err) console.error(err);
                  else{
                      setPembayaran(results);
                      setIsFilter(true)
                      setSelectedBulan(value);
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
            filterColumn="tgl_bayar"
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
