const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;


const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false
      }
});


client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    const sql = "SELECT * FROM courses";

    client.query(sql)
        .then(results => {
            res.render('index', { courses: results.rows });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Något gick fel vid inhämtning av kurser");
        });
});


app.get('/form', (req, res) => {
    res.render('form', { name: "Julia" });
});

app.get('/about', (req, res) => {
    res.render('about', { name: "Julia" });
});


app.post("/", (req, res) => {
    const { coursecode, coursename, syllabus, progression } = req.body;

    const checkCourseCode = "SELECT * FROM courses WHERE course_code = $1";
    client.query(checkCourseCode, [coursecode])
        .then(results => {
            if (results.rows.length > 0) {
                return res.render("form", { err: "Den här kurskoden finns redan. Vänligen välj en unik." });
            }

            const insertCourse = "INSERT INTO courses (course_code, course_name, course_syllabus, course_progression) VALUES ($1, $2, $3, $4)";
            return client.query(insertCourse, [coursecode, coursename, syllabus, progression]);
        })
        .then(() => {
            res.render("form", { success: "Kursen har lagts till!", err: null });
        })
        .catch(err => {
            console.error(err);
            res.render("form", { err: "Något gick fel vid sparandet av kursen." });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});