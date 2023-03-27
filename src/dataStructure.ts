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
    semester: string, 
    status_bayar: string
}

export type SiswaTypeList = Siswa[];

export interface Pengguna{
    id_user: number;
    username: string;
    password: string;
    nama_pengguna: string;
    level: "admin" | "petugas" | "siswa";
    label: string;
    value: number;
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
    id_user: number,
    nama_pengguna: string,
    nama_siswa: string,
    nama_petugas: string,
    nisn: string,
    tgl_bayar: Date,
    bulan_bayar: string,
    tahun_bayar: string,
    id_spp: number,
    jumlah_bayar: number,
    status_bayar: string,
    bayar: number,
    semester: string
}

export type PembayaranTypeList = Pembayaran[];

export interface SPP{
    id_spp: number,
    tahun: string,
    nominal: string,
    status_bayar: string, 
}

export type SPPTypeList = SPP[];

export interface SPPOptions{
    label: number,
    value: number
}

export interface Bulan{
    label: "Januari" | "Februari" | "Maret" | "April" | "Mei" | "Juni" | "Juli" | "Agustus" | "September" | "Oktober" | "November" | "Desember"
    value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export const bulanOptions : Bulan[] = [
  { label: "Januari", value:1 },
  { label: "Februari", value:2 },
  { label: "Maret", value:3 },
  { label: "April", value:4 },
  { label: "Mei", value:5 },
  { label: "Juni", value:6 },
  { label: "Juli", value:7 },
  { label: "Agustus", value:8 },
  { label: "September", value:9 },
  { label: "Oktober", value:10 },
  { label: "November", value:11 },
  { label: "Desember", value:12 },
];

export interface Semester{
    label: "Semester 1" | "Semester 2" | "Semester 3" | "Semester 4"| "Semester 5" | "Semester 6"
    value: 1 | 2 | 3 | 4 | 5 | 6
}

export const semesterOptions: Semester[] = [
    {label: "Semester 1", value: 1},
    {label: "Semester 2", value: 2},
    {label: "Semester 3", value: 3},
    {label: "Semester 4", value: 4},
    {label: "Semester 5", value: 5},
    {label: "Semester 6", value: 6},    
]; 

