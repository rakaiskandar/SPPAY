import logo from "../assets/sppayLogo2.svg";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    path: "/app/a/beranda",
    name: "Beranda",
  },
  {
    path: "/app/a/pengguna",
    name: "Pengguna",
  },
  {
    path: "/app/a/kelas",
    name: "Kelas",
  },
  {
    path: "/app/a/siswa",
    name: "Siswa",
  },
];

const sidebarItemsAdmin = [
  {
    path: "/app/a/pembayaran",
    name: "Pembayaran",
  },
  {
    path: "/app/a/spp",
    name: "SPP"
  }
];

const sidebarItemsPetugas = [
  {
    path: "/app/p/beranda",
    name: "Beranda"
  },
  {
    path: "/app/p/pembayaran",
    name: "Pembayaran",
  },
];

const sidebarItemsSiswa = [
  {
    path: "/app/s/beranda",
    name: "Beranda"
  },
];


const getSidebarIcon = (name: string) => {
  if (name == "Beranda") return <Icon icon="ant-design:home-outlined" />;
  else if (name == "Pengguna") return <Icon icon="ic:baseline-people-outline" />;
  else if (name == "Kelas") return <Icon icon="ic:outline-class" />;
  else if (name == "Siswa") return <Icon icon="ph:student-duotone"/>
  else if (name == "Pembayaran") return <Icon icon="icon-park-outline:transaction" />;
  else if(name == "SPP") return <Icon icon="material-symbols:payments-sharp"/>
};

function Sidebar({ user } : { user : any}) {
  const location = useLocation();
  
  const extractLocation = () => {
    const ar = location.pathname.split("/");
    if (ar[3] === "beranda") return "Beranda";
    else if (ar[3] === "pengguna") return "Pengguna";
    else if (ar[3] === "kelas") return "Kelas";
    else if (ar[3] === "siswa") return "Siswa"; 
    else if (ar[3] === "pembayaran") return "Pembayaran";
    else if (ar[3] === "spp") return "SPP";
  };

  return (
    <nav className="sidebarContainer">
      <div className="sidebarHead">
        <img src={logo} alt="logo sppay" />
      </div>
      {user?.level === "admin" ? 
      <>
        <div className="sidebarList">
          {sidebarItems.map((item, i) => (
            <Link
              to={item.path}
              className={`sidebarItems ${
                extractLocation() === item.name ? "sidebarItemsActive" : ""
              }`}
              key={i}
            >
              {getSidebarIcon(item.name)}
              <p>{item.name}</p>
            </Link>
          ))}
          <div className="divide"></div>
          {sidebarItemsAdmin.map((item, i) => (
            <Link
            to={item.path}
            className={`sidebarItems ${
              extractLocation() === item.name ? "sidebarItemsActive" : ""
            }`}
            key={i}
            >
            {getSidebarIcon(item.name)}
            <p>{item.name}</p>
            </Link>
          ))}
        </div>
      </>
      : user?.level === "petugas" ?
      <>
        <div className="sidebarList">
          {sidebarItemsPetugas.map((item, i) => (
            <Link
              to={item.path}
              className={`sidebarItems ${
                extractLocation() === item.name ? "sidebarItemsActive" : ""
              }`}
              key={i}
            >
              {getSidebarIcon(item.name)}
              <p>{item.name}</p>
            </Link>
          ))}
        </div>
      </>
      : user?.level === "siswa" ?
      <>
        <div className="sidebarList">
          {sidebarItemsSiswa.map((item, i) => (
            <Link
              to={item.path}
              className={`sidebarItems ${
                extractLocation() === item.name ? "sidebarItemsActive" : ""
              }`}
              key={i}
            >
              {getSidebarIcon(item.name)}
              <p>{item.name}</p>
            </Link>
          ))}
        </div>
      </>
      : "gaada"
      }
    </nav>
  );
}

export default Sidebar;
