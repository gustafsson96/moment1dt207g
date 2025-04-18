const { Client } = require("pg");
require("dotenv").config();

// Connect to database
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    }
});

client.connect((err) => {
    if (err) {
        console.log("Fel vid anslutning" + err);
    } else {
        console.log("Ansluten till databasen...")
    }
});

// Create course table
client.query(`
    CREATE TABLE courses(
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) NOT NULL UNIQUE,
        course_name VARCHAR(200) NOT NULL,
        course_progression VARCHAR(10) NOT NULL,
        course_syllabus VARCHAR(500),
        course_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);