const mysql = require("mysql");

const db = mysql.createPool({
    // ssl: process.env.SSL,
    //port: process.env.MYSQLPORT,
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000 * 60,
    acquireTimeout: 60 * 60 * 1000 * 60,
    timeout: 60 * 60 * 1000 * 60,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = { db }