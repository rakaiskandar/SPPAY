import { HelmetProvider } from "react-helmet-async";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AdminLayout from "./pages/app/admin/AdminLayout";
import Beranda from "./pages/app/admin/Beranda";
import DetailKelas from "./pages/app/admin/Kelas/DetailKelas";
import Kelas from "./pages/app/admin/Kelas/Kelas";
import NewKelas from "./pages/app/admin/Kelas/NewKelas";
import DetailPembayaran from "./pages/app/admin/Pembayaran/DetailPembayaran";
import NewPembayaran from "./pages/app/admin/Pembayaran/NewPembayaran";
import Pembayaran from "./pages/app/admin/Pembayaran/Pembayaran";
import DetailPengguna from "./pages/app/admin/Pengguna/DetailPengguna";
import NewPengguna from "./pages/app/admin/Pengguna/NewPengguna";
import Pengguna from "./pages/app/admin/Pengguna/Pengguna";
import UbahPassword from "./pages/app/admin/Pengguna/UbahPassword";
import DetailSiswa from "./pages/app/admin/Siswa/DetailSiswa";
import NewSiswa from "./pages/app/admin/Siswa/NewSiswa";
import Siswa from "./pages/app/admin/Siswa/Siswa";
import Layout from "./pages/app/Layout";
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
                <Route index element={<Beranda />} />
                <Route path="beranda" element={<Beranda />} />
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
                <Route path="pembayaran" element={<Pembayaran />} />
                <Route path="pembayaran/new" element={<NewPembayaran/>}/>
                <Route path="pembayaran/:id" element={<DetailPembayaran/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </HelmetProvider>
  );
}

export default App;
