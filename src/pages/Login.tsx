import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/sppayLogo2.svg";
import ilustration from "@/assets/ilustration-sppay.svg";
import "../style/login.scss";
import sha1 from "sha1";
import { connectionSql } from "@/sqlConnect";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const nav = useNavigate();

  const submitHandler = (ev : any) => {
    ev.preventDefault();

    const sha1Pass = sha1(password);
    connectionSql.connect();
    var stateSql = "SELECT * from `pengguna` WHERE username='" +
    username +
    "' AND password='" +
    sha1Pass +
    "'";
  
    connectionSql.query(stateSql, function (err, results) {
      if (err) console.error(err);
      else {
        if (results.length) {
          nav("/app/a/beranda");
          console.log("ada user");
        }
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>SPPAY - Sistem Pembayaran SPP</title>
      </Helmet>

      <div className="loginContainer">
        <main className="main1">
          <img src={ilustration} alt="ilustration image" />
        </main>
        <main className="main2">
          <div className="mainSub">
            <nav className="nav">
              <img src={logo} alt="" />
            </nav>
            <div className="loginTitle">
              <h2>Masuk ke sppay yuk🤗</h2>
              <h3>Beri kemudahan untuk kamu yang mau bayar SPP!</h3>
            </div>
            <form className="formContainer" onSubmit={submitHandler}>
              <div className="inputGroup">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  className="inputStyle"
                  onChange={(ev) => setUsername(ev.target.value)}
                />
              </div>

              <div className="inputGroup">
                <label htmlFor="password">Kata Sandi</label>
                <input
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  className="inputStyle"
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </div>

              <button type="submit" className="btnMasuk">
                Masuk
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;