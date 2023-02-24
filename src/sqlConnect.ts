import mysql from "mysql";

export const connectionSql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: undefined,
    database: "pembayaran_spp",
    multipleStatements: true
});
