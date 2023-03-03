import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "./Modal";

function NavbarProfile({ img, user } : { img : any, user: any}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const nav = useNavigate();

    const logoutHandler = () => {
        toast.success("Keluar berhasil!", { autoClose: 1000})
        nav("/")
    }

    return (
        <>
            <Menu className="profileContainer" as="div">
                <div>
                <span className="penggunaRole">
                        {user.level === "admin" ? 
                        <>
                            <h4 className="aTypeT">@{user.username}</h4>
                        </> 
                        : user.level === "petugas"
                        ? 
                        <>
                            <h4 className="pTypeT">@{user.username}</h4>
                        </>
                        : user.level === "siswa"
                        ? 
                        <>
                            <h4 className="sTypeT">@{user.username}</h4>
                        </>
                        : ""
                    }
                    </span>
                    <span className="penggunaRole">
                        {user.level === "admin" ? 
                        <>
                            <p>🧑🏻‍💻</p>
                            <h5 className="aType">{user.level}</h5>
                        </> 
                        : user.level === "petugas"
                        ? 
                        <>
                            <p>🧑🏻‍💼</p>
                            <h5 className="pType">{user.level}</h5>
                        </>
                        : user.level === "siswa"
                        ? 
                        <>
                            <p>🧑🏻‍🎓</p>
                            <h5 className="sType">{user.level}</h5>
                        </>
                        : ""
                    }
                    </span>
                </div>
                <Modal
                open={isOpen} 
                close={setIsOpen} 
                event={logoutHandler} 
                title={`Keluar`}
                desc={`Tindakan ini akan mengeluarkan pengguna dari SPPAY.
                Apakah kamu yakin akan keluar?`}/>

                <Menu.Button className="profileButton">
                    <img src={img} alt="profile img"/>
                </Menu.Button>
                <Menu.Items className="profileItem">
                    <Menu.Item>
                    {({ active }) => (
                        <button
                            className={`${
                                active && "buttonActive"
                            }`}
                            onClick={() => setIsOpen(true)}
                            >
                            <Icon icon="carbon:logout" width="18" />
                            <p>Keluar</p>
                        </button>
                    )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </> 
     );
}

export default NavbarProfile;