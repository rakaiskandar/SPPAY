import Navbar from "@/components/Navbar";
import rupiahConverter from "@/helpers/rupiahConverter";
import { connectionSql } from "@/sqlConnect";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/beranda.scss";
import { userState } from "@/atoms/userAtom";
import { Bulan, bulanOptions } from "@/dataStructure";
import Select from "react-select";

export interface SiswaDashboard {
  nama: string,
  nama_kelas: string,
  status_bayar: string
}

export interface TransaksiDashboard {
  nama: string,
  tgl_bayar: Date
}

function Beranda() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  //Get month
  let dateNow = new Date().getMonth();
  const [totalPembayaran, setTotalPembayaran] = useState<number | null>(0);
  const [totalTransaksi, setTotalTransaksi] = useState<number | null>(0);
  const [statusBayar, setStatusBayar] = useState<SiswaDashboard[] | null>([]);
  const [bayarTerbaru, setBayarTerbaru] = useState<TransaksiDashboard[] | null>([]);
  const [selectedBulan, setSelectedBulan] = useState<Bulan | null>(
    bulanOptions[dateNow]
  );

  useEffect(() => {
    const currentPath = location.pathname.split("/");
    if (currentPath.length < 4) {
      navigate("beranda");
    }

    const totalpembayaran = `SELECT SUM(bayar) AS total FROM detail_pembayaran, pembayaran WHERE pembayaran.id_pembayaran = detail_pembayaran.id_pembayaran`;
    const totaltransaksi = `SELECT COUNT(*) AS jumlah FROM pembayaran`;
    var statusBayar = `SELECT siswa.nama, kelas.nama_kelas, pembayaran.status_bayar FROM siswa, kelas, spp, pembayaran WHERE siswa.id_kelas = kelas.id_kelas AND spp.id_spp = pembayaran.id_spp AND pembayaran.nisn = siswa.nisn AND MONTH(tgl_bayar) = MONTH(now()) AND spp.status_bayar = 'Sudah' ORDER BY tgl_bayar DESC LIMIT 4`;
    var pembayaranTerbaru = "SELECT siswa.nama, pembayaran.tgl_bayar FROM siswa, pembayaran WHERE MONTH(pembayaran.tgl_bayar) = MONTH(now()) AND pembayaran.nisn = siswa.nisn ORDER BY pembayaran.tgl_bayar DESC LIMIT 4";

    connectionSql.query(
      `${totalpembayaran}; ${totaltransaksi}; ${statusBayar}; ${pembayaranTerbaru}`,
      (err, results) => {
        if (err) console.error(err);
        else {
          setTotalPembayaran(results[0][0].total);
          setTotalTransaksi(results[1][0].jumlah);
          setStatusBayar(results[2]);
          setBayarTerbaru(results[3]);
        }
      }
    )
  }, [])

  return (
    <>
      <Helmet>
        <title>SPPAY - Beranda Admin</title>
      </Helmet>

      <Navbar user={user} />

      <main className="container">
        <div className="berandaHead">
          <h2>Beranda</h2>
          <Select
            options={bulanOptions}
            value={selectedBulan}
            className="selectInput"
            placeholder="Pilih Bulan"
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
                const totalpembayaran = `SELECT SUM(bayar) AS total FROM detail_pembayaran, pembayaran WHERE pembayaran.id_pembayaran = detail_pembayaran.id_pembayaran AND MONTH(tgl_bayar) = ${value?.value}`;
                const totaltransaksi = `SELECT COUNT(*) AS jumlah FROM pembayaran WHERE MONTH(tgl_bayar) = ${value?.value}`;
                var statusBayar = `SELECT siswa.nama, kelas.nama_kelas, pembayaran.status_bayar FROM siswa, kelas, spp, pembayaran WHERE siswa.id_kelas = kelas.id_kelas AND spp.id_spp = pembayaran.id_spp AND pembayaran.nisn = siswa.nisn AND MONTH(tgl_bayar) = ${value?.value} AND spp.status_bayar = 'Sudah' ORDER BY tgl_bayar DESC LIMIT 4`;
                var pembayaranTerbaru = `SELECT siswa.nama, pembayaran.tgl_bayar FROM siswa, pembayaran WHERE MONTH(pembayaran.tgl_bayar) = ${value?.value} AND pembayaran.nisn = siswa.nisn ORDER BY pembayaran.tgl_bayar DESC LIMIT 4`;

                connectionSql.query(
                  `${totalpembayaran}; ${totaltransaksi}; ${statusBayar}; ${pembayaranTerbaru}`,
                  (err, results) => {
                    if (err) console.error('err',err);
                    else {
                      setTotalPembayaran(results[0][0].total === null ? 0 : results[0][0].total);
                      setTotalTransaksi(results[1][0].jumlah === null ? 0 : results[1][0].jumlah);
                      setStatusBayar(results[2]);
                      setBayarTerbaru(results[3] === null ? <></> : results[3]);
                      setSelectedBulan(value)
                    }
                  }
                )
              }
            } />
        </div>

        <div className="berandaSection1">
          <div className="berandaSub1">
            <h5>Total Pembayaran:</h5>
            <>{totalPembayaran !== null ? (
              <h4>{rupiahConverter(totalPembayaran)}</h4>
            ) : (
              <h4>{rupiahConverter(0)}</h4>
            )}
            </>
          </div>
          <div className="berandaSub1">
            <h5>Jumlah Transaksi:</h5>
            <h4>{totalTransaksi}</h4>
          </div>
        </div>

        <div className="berandaSection2">
          <div className="berandaSub2 berandaSub2List">
            <h4>😁Pembayaran Terbaru:</h4>
            <div className="berandaSub2ListItem">
              {bayarTerbaru!.length > 0 ? (
                bayarTerbaru!.map((p, i) => (
                  <div className="berandaSub2ListItemDetail">
                    <p>{i + 1}</p>
                    <p>|</p>
                    <h5>{p.nama}</h5>
                    <h4>{dayjs(p.tgl_bayar).format("D MMMM YYYY")}</h4>
                  </div>
                ))
              ) : (
                <div className="beranda2Stat">
                  <h4 className="tidakAdaData">{`Tidak ada pembayaran terbaru di bulan ${selectedBulan?.label}`}</h4>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/app/a/pembayaran")}>Lihat Pembayaran Lainnya</button>
          </div>

          <div className="berandaSub2 berandaSub2List">
            <h4>🤩Status Pembayaran Siswa:</h4>
            <div className="berandaSub2ListItem">
              {statusBayar!.length > 0 ? (
                statusBayar!.map((p, i) => (
                  <div className="berandaSub2ListItemDetail">
                    <p>{i + 1}</p>
                    <p>|</p>
                    <h5>{p.nama}</h5>
                    <p className="paidStatus">{p.status_bayar === "Lunas" ?
                      <p className="lunas">{p.status_bayar}</p>
                      : 
                      <p className="belumLunas">{p.status_bayar}</p>
                    }</p>
                  </div>
                ))
              ) : (
                <div className="beranda2Stat">
                  <h4 className="tidakAdaData">Tidak ada status bayar yang ditampilkan</h4>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/app/a/siswa")}>Lihat Siswa Lainnya</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Beranda;
