import logo from "../assets/sppay.png";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Pembayaran, Siswa } from "@/dataStructure";
import dayjs from "dayjs";
import rupiahConverter from "@/helpers/rupiahConverter";

// Create styles
const primaryC = '#5A57EC';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFF',
    fontFamily: 'Helvetica',
    width: 800
  },
  section:{
    margin: 20
  },
  head1: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: 32,
    fontWeight: 'black',
    letterSpacing: 5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: primaryC,
    borderBottom: 2,
    borderBottomColor: primaryC
  },
  head2: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  head3:{
    flexDirection: 'column',
    fontWeight: 'semibold'
  },
  subhead1:{
    marginTop: 20,
    marginBottom: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10
  },
  subhead2:{
    flexDirection: 'column',
    gap: 8
  },
  subhead3:{
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  subhead4:{
    flexDirection: 'column',
    gap: 8
  },
  subhead5:{
    marginTop: 35,
    marginBottom: 45,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 10,
  },
  subhead6:{
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#D5D5D5'
  },
  title:{
    fontSize: 24,
    fontWeight: 'extrabold',
    marginBottom: 5,
    textTransform: 'capitalize',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: primaryC
  },
  total:{
    fontSize: 40,
    fontWeight: 'extrabold',
    marginBottom: 50,
    textTransform: 'capitalize',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  image: {
    width: 150,
  },
  lunas:{
    fontWeight: 'black',
    fontFamily: 'Helvetica-Bold',
    padding: 6,
    color: '#12e632',
  },
  belumLunas:{
    fontWeight: 'black',
    fontFamily: 'Helvetica-Bold',
    padding: 6,
    color: '#e94141',
  }
});

// Create Document Component
const PdfBukti = ({ pembayaran, siswa } : { pembayaran: Pembayaran, siswa: Siswa}) => (
  <Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <View style={styles.head1}>
                <Text>Laporan Pembayaran</Text>
            </View>
            <View style={styles.head2}>
                <View style={styles.head3}>
                    <Text style={styles.title}>Detail Petugas</Text>
                    <Text>Nama Petugas: {pembayaran.nama_petugas}</Text>
                </View>
                <Image src={logo} style={styles.image}/>
            </View>
            <View style={styles.subhead1}>
                <View style={styles.subhead2}>
                    <Text style={styles.title}>Detail Siswa</Text>
                    <Text>NISN  : {siswa.nisn}</Text>
                    <Text>NIS   : {siswa.nis}</Text>
                    <Text>Nama  : {siswa.nama}</Text>
                    <Text>Kelas : {siswa.nama_kelas}</Text>
                    <Text>Alamat: {siswa.alamat}</Text>
                    <Text>Kontak: {siswa.no_telp}</Text>
                </View>
                <View style={styles.subhead2}>
                    <Text style={styles.title}>#{pembayaran.id_pembayaran}</Text>
                    <Text>{dayjs(pembayaran.tgl_bayar).format("D MMMM YYYY")}</Text>
                </View>
            </View>
            <View style={styles.subhead3}>
                <View style={styles.subhead4}>
                    <Text style={styles.title}>Detail Pembayaran</Text>
                    <Text>Id SPP: {pembayaran.id_spp}</Text>
                    <Text>Jumlah Bayar: {pembayaran.jumlah_bayar}x</Text>
                    <Text>Status Bayar: 
                        {pembayaran?.status_bayar === "Lunas" ? (
                            <>
                                <Text style={styles.lunas}> Lunas</Text>
                            </>
                            ) : (
                            <>
                                <Text style={styles.belumLunas}> Belum Lunas</Text>
                            </>
                        )}
                    </Text>
                </View>
            </View>
            <View style={styles.subhead5}>
                <Text>Jumlah Bayar:</Text>
                <Text style={styles.total}>{rupiahConverter(pembayaran.bayar)}</Text>
            </View>
            <View style={styles.subhead6}>
                <Text>Dicetak oleh SPPAY 1.0</Text>
            </View>
        </View>
    </Page>
  </Document>
);

export default PdfBukti;