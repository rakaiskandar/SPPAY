import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

function NavbarProfile({ img } : { img : any}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const nav = useNavigate();

    const logoutHandler = () => {
        nav("/")
    }

    return ( 
        <Menu className="profileContainer" as="div">
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
     );
}

export default NavbarProfile;