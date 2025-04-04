const express = require('express')
const app = express();
const PORT = process.env.port || 3000;
const connection = require('./install');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const sql = "SELECT * FROM courses";

    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Något gick fel vid inhämtning av kurser");
        }
        res.render('index', { courses: results });
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

    const checkCourseCode = "SELECT * FROM courses WHERE course_code =?";
    connection.query(checkCourseCode, [coursecode], (err, results) => {
        if (err) {
            console.error(err);
            return res.render("form", { err: "Fel vid kontroll av kurskod." });
        }
        if (results.length > 0) {
            return res.render("form", { err: "Den här kurskoden finns redan. Vänligen välj en unik." });
        }

        const sql = "INSERT INTO courses (course_code, course_name, course_syllabus, course_progression) VALUES (?, ?, ?, ?)";

        connection.query(sql, [coursecode, coursename, syllabus, progression], (err, result) => {
            if (err) {
                console.error(err);
                return res.render("form", { err: "Något gick fel vid sparandet av kursen." });
            }
            res.render("form", { success: "Kursen har lagts till!", err: null });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

