import { userState } from "@/atoms/userAtom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import "@/style/beranda.scss";
import { connectionSql } from "@/sqlConnect";
import rupiahConverter from "@/helpers/rupiahConverter";
import dayjs from "dayjs";
import { Bulan, bulanOptions } from "@/dataStructure";
import Select from "react-select";

export interface TransaksiDashboard{
    nama: string,
    tgl_bayar: Date
}

function Beranda() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  //Get month
  let dateNow = new Date().getMonth();
  const [totalPembayaran, setTotalPembayaran] = useState<number>(0);
  const [totalTransaksi, setTotalTransaksi] = useState<number>(0);
  const [bayarTerbaru, setBayarTerbaru] = useState<TransaksiDashboard[]>([]);
  const [selectedBulan, setSelectedBulan] = useState<Bulan | null>(
    bulanOptions[dateNow]
  );

  useEffect(() => {
    const currentPath = location.pathname.split("/");
    if (currentPath.length < 4) {
      navigate("beranda");
    }

    var totalPembayaran =
      "SELECT SUM(bayar) AS total FROM detail_pembayaran, pembayaran WHERE detail_pembayaran.id_pembayaran = pembayaran.id_pembayaran";
    var totalTransaksi =
      "SELECT COUNT(*) AS jumlah FROM pembayaran";
    var pembayaranTerbaru =
      "SELECT siswa.nama, pembayaran.tgl_bayar FROM siswa, pembayaran WHERE MONTH(pembayaran.tgl_bayar) = MONTH(now()) AND pembayaran.nisn = siswa.nisn ORDER BY pembayaran.tgl_bayar DESC LIMIT 4";
    connectionSql.query(
      `${totalPembayaran}; ${totalTransaksi}; ${pembayaranTerbaru}`,
      (err, results) => {
        if (err) console.error(err);
        else {
          setTotalPembayaran(results[0][0].total);
          setTotalTransaksi(results[1][0].jumlah);
          setBayarTerbaru(results[2])
        }
      }
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>SPPAY - Beranda Petugas</title>
      </Helmet>

      <Navbar user={user} />

      <main className="container">
        <div className="berandaHead">
          <h2>Beranda</h2>
          <Select
            options={bulanOptions}
            className="selectInput"
            value={selectedBulan}
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
                var pembayaranTerbaru =
                `SELECT siswa.nama, pembayaran.tgl_bayar FROM siswa, pembayaran WHERE MONTH(pembayaran.tgl_bayar) = ${value?.value} AND pembayaran.nisn = siswa.nisn ORDER BY pembayaran.tgl_bayar DESC LIMIT 4`;
                
                connectionSql.query(
                  `${totalpembayaran}; ${totaltransaksi}; ${pembayaranTerbaru}`,
                  (err, results) => {
                    if (err) console.error('err',err);
                    else {
                      setTotalPembayaran(results[0][0].total === null ? 0 : results[0][0].total);
                      setTotalTransaksi(results[1][0].jumlah === null ? 0 : results[1][0].jumlah);
                      setBayarTerbaru(results[2] === null ? <></> : results[2]);
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
              {bayarTerbaru.length > 0 ? (
                bayarTerbaru.map((p, i) => (
                  <div className="berandaSub2ListItemDetail">
                    <p>{i + 1}</p>
                    <p>|</p>
                    <h5>{p.nama}</h5>
                    <h4>{dayjs(p.tgl_bayar).format("D MMMM YYYY")}</h4>
                  </div>
                ))
              ) : (
                <div className="beranda2Stat">
                  <h4 className="tidakAdaData">
                    {`Tidak ada pembayaran terbaru di bulan ${selectedBulan?.label}`}
                  </h4>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/app/p/pembayaran")}>
              Lihat Pembayaran Lainnya
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Beranda;
