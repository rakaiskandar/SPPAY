export interface Kelas{
    id_kelas: number,
    nama_kelas: string,
    kompetensi_keahlian: string,
    jumlah_siswa: number
}

export type KelasTypeList = Kelas[];

export interface KompetensiKeahlian{
    label: "RPL" | "MM" | "TKJ" | "TAV" | "TITL" | "TOI"
    value: "Rekayasa Perangkat Lunak" | "Multimedia" | 
    "Teknik Komputer Jaringan" | "Teknik Audio Video" | "Teknik Instalasi Tenaga Listrik" | "Teknik Otomasi Industri"
}

export const kompetensiOptions : KompetensiKeahlian[] = [
    { label: "RPL", value:"Rekayasa Perangkat Lunak" },
    { label: "MM", value: "Multimedia" },
    { label: "TKJ", value:"Teknik Komputer Jaringan" },
    { label: "TAV", value:"Teknik Audio Video" },
    { label: "TITL", value:"Teknik Instalasi Tenaga Listrik" },
    { label: "TOI", value:"Teknik Otomasi Industri" },
];

export interface Siswa{
    nisn: string,
    nis: string,
    nama: string,
    id_kelas: number,
    nama_kelas: string, 
    alamat: string,
    no_telp: string,
    id_spp: number,
    sudah_bayar: "Belum" | "Sudah"
}

export type SiswaTypeList = Siswa[];

export interface Pengguna{
    id_user: string,
    username: string,
    password: string,
    nama_pengguna: string,
    level: string
}

export interface Level{
    label:  "siswa" | "petugas"
    value:  "siswa" | "petugas"
}

export const levelOptions: Level[] = [
    { label: "petugas", value:"petugas" },
    { label: "siswa", value: "siswa"}
];

export type PenggunaTypeList = Pengguna[];

export interface Pembayaran{
    id_pembayaran: number,
    id_user: string,
    nama_pengguna: string,
    nama_siswa: string,
    nama_petugas: string,
    nisn: string,
    tgl_bayar: Date,
    bulan_bayar: string,
    tahun_bayar: string,
    id_spp: number,
    jumlah_bayar: string,
    status_bayar: "Belum Lunas" | "Lunas"
}

export type PembayaranTypeList = Pembayaran[];

export interface SPP{
    id_spp: number,
    tahun: string,
    nominal: string 
}

export type SPPTypeList = SPP[];

export interface SPPOptions{
    label: number,
    value: number
}

