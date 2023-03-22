import { atom } from "recoil";

export type userProps = {
    id_user: number;
    username: string;
    password: string;
    nama_pengguna: string;
    level: "admin" | "petugas" | "siswa";
    label: string;
    value: number;
}

export const userState = atom<userProps & {}>({
    key: "userState",
    default: {
        id_user: 1,
        username: "",
        password: "",
        nama_pengguna: "", 
        level: "admin",
        label: "",
        value: 1,
    },
})