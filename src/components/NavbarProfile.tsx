import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

function NavbarProfile({ img } : { img : any}) {
    const nav = useNavigate();

    const logoutHandler = () => {
        nav("/")
    }

    return ( 
        <Menu className="profileContainer" as="div">
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
                        onClick={logoutHandler}
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