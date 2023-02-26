import dayjs from "dayjs";
import { useEffect, useState } from "react";
import image from "../assets/astronaut.png";
import NavbarProfile from "./NavbarProfile";

function Navbar() {
  let dateNow = new Date().toLocaleDateString("en-US").toString();
  const formatDate = dayjs(dateNow).format("dddd, D MMMM YYYY");
  
  const [greeting, setGreeting] = useState<any>("");

  useEffect(() => {
    const now = new Date().getHours();

    if (4 <= now && now <= 11) {
      setGreeting({
        emoji: "🌄",
        greet: "Selamat Pagi, ",
      });
    } else if (12 <= now && now <= 14) {
      setGreeting({
        emoji: "🌞",
        greet: "Selamat Siang, ",
      });
    } else if (15 <= now && now <= 18) {
      setGreeting({
        emoji: "🌆",
        greet: "Selamat Sore, ",
      });
    } else {
      setGreeting({
        emoji: "🌃",
        greet: "Selamat Malam, ",
      });
    }
  }, []);

  return (
    <nav className="navContainer">
      <h4>{formatDate}</h4>
      <div className="nav-body">
        <h2 className="nav-text">
          <span>{greeting.emoji}</span>
          {greeting.greet}
          <span>Admin!</span>
        </h2>
        <div>
          <NavbarProfile img={image}/>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
