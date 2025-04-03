const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false
});


connection.connect((err) => {
    if (err) {
        console.log ("Fel vid anslutning: " + err);
    } else {
        console.log("Ansluten till databasen...")
    }
});