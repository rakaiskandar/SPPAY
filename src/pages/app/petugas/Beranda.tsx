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

export interface TransaksiDashboard{
    nama: string,
    tgl_bayar: Date
}

function Beranda() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();
  const [totalPembayaran, setTotalPembayaran] = useState<number>(0);
  const [totalTransaksi, setTotalTransaksi] = useState<number>(0);
  const [bayarTerbaru, setBayarTerbaru] = useState<TransaksiDashboard[]>([]);

  useEffect(() => {
    const currentPath = location.pathname.split("/");
    if (currentPath.length < 4) {
      navigate("beranda");
    }

    var totalPembayaran =
      "SELECT SUM(jumlah_bayar) AS total FROM pembayaran WHERE MONTH(tgl_bayar) = MONTH(NOW())";
    var totalTransaksi =
      "SELECT COUNT(*) AS jumlah FROM pembayaran WHERE MONTH(tgl_bayar) = MONTH(NOW())";
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

      <main className="berandaContainer">
        <div className="berandaHead">
          <h2>Beranda</h2>
        </div>

        <div className="berandaSection1">
          <div className="berandaSub1">
            <h5>Total Pembayaran:</h5>
            <h4>{rupiahConverter(totalPembayaran)}</h4>
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
                    Tidak ada pembayaran terbaru di bulan ini
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
