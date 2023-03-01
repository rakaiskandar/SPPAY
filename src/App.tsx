import { HelmetProvider } from "react-helmet-async";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AdminLayout from "./pages/app/admin/AdminLayout";
import BerandaAdmin from "./pages/app/admin/Beranda";
import DetailKelas from "./pages/app/admin/Kelas/DetailKelas";
import Kelas from "./pages/app/admin/Kelas/Kelas";
import NewKelas from "./pages/app/admin/Kelas/NewKelas";
import DetailPembayaranAdmin from "./pages/app/admin/Pembayaran/DetailPembayaran";
import NewPembayaranAdmin from "./pages/app/admin/Pembayaran/NewPembayaran";
import PembayaranAdmin from "./pages/app/admin/Pembayaran/Pembayaran";
import DetailPengguna from "./pages/app/admin/Pengguna/DetailPengguna";
import NewPengguna from "./pages/app/admin/Pengguna/NewPengguna";
import Pengguna from "./pages/app/admin/Pengguna/Pengguna";
import UbahPassword from "./pages/app/admin/Pengguna/UbahPassword";
import DetailSiswa from "./pages/app/admin/Siswa/DetailSiswa";
import NewSiswa from "./pages/app/admin/Siswa/NewSiswa";
import Siswa from "./pages/app/admin/Siswa/Siswa";
import DetailSPP from "./pages/app/admin/SPP/DetailSPP";
import NewSPP from "./pages/app/admin/SPP/NewSPP";
import SPP from "./pages/app/admin/SPP/SPP";
import Layout from "./pages/app/Layout";
import BerandaPetugas from "./pages/app/petugas/Beranda";
import DetailPembayaranPetugas from "./pages/app/petugas/Pembayaran/DetailPembayaran";
import NewPembayaranPetugas from "./pages/app/petugas/Pembayaran/NewPembayaran";
import PembayaranPetugas from "./pages/app/petugas/Pembayaran/Pembayaran";
import PetugasLayout from "./pages/app/petugas/PetugasLayout";
import BerandaSiswa from "./pages/app/siswa/Beranda";
import SiswaLayout from "./pages/app/siswa/SiswaLayout";
import Login from "./pages/Login";

function App() {
  return (
    <HelmetProvider>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app" element={<Layout />}>
              <Route path="a" element={<AdminLayout />}>
                <Route index element={<BerandaAdmin />} />
                <Route path="beranda" element={<BerandaAdmin />} />
                <Route path="pengguna" element={<Pengguna />} />
                <Route path="pengguna/new" element={<NewPengguna/>}/>
                <Route path="pengguna/:id" element={<DetailPengguna/>}/>
                <Route path="pengguna/:id/ubah-pass" element={<UbahPassword/>}/>
                <Route path="kelas" element={<Kelas />} />
                <Route path="kelas/new" element={<NewKelas/>}/>
                <Route path="kelas/:id" element={<DetailKelas/>}/>
                <Route path="siswa" element={<Siswa/>}/>
                <Route path="siswa/new" element={<NewSiswa/>}/>
                <Route path="siswa/:id" element={<DetailSiswa/>}/>
                <Route path="pembayaran" element={<PembayaranAdmin />} />
                <Route path="pembayaran/new" element={<NewPembayaranAdmin/>}/>
                <Route path="pembayaran/:id" element={<DetailPembayaranAdmin/>}/>
                <Route path="spp" element={<SPP/>}/>
                <Route path="spp/new" element={<NewSPP/>}/>
                <Route path="spp/:id" element={<DetailSPP/>}/>
                <Route/>
              </Route>
              <Route path="p" element={<PetugasLayout/>}>
                <Route index element={<BerandaPetugas/>}/>
                <Route path="beranda" element={<BerandaPetugas/>}/>
                <Route path="pembayaran" element={<PembayaranPetugas/>}/>
                <Route path="pembayaran/new" element={<NewPembayaranPetugas/>}/>
                <Route path="pembayaran/:id" element={<DetailPembayaranPetugas/>}/>
              </Route>
              <Route path="s" element={<SiswaLayout/>}>
                <Route index element={<BerandaSiswa/>}/>
                <Route path="beranda" element={<BerandaSiswa/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </HelmetProvider>
  );
}

export default App;
