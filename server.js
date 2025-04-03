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
    const courseCode = req.body.coursecode;
    const courseName = req.body.coursename;
    const syllabus = req.body.syllabus;
    const progression = req.body.progression;

    const checkCourseCode = "SELECT * FROM courses WHERE course_code =?";
    connection.query(checkCourseCode, [courseCode], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Någon gick fel vid kontroll av kurskod")
        }
        if (results.length > 0) {
            return res.status(400).send("Den här kurskoden finns redan. Vänligen välj en unik kod.")
        }

        const sql = "INSERT INTO courses (course_code, course_name, course_syllabus, course_progression) VALUES (?, ?, ?, ?)";

        connection.query(sql, [courseCode, courseName, syllabus, progression], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Något gick fel");
            }
            res.send("Kursen har lagts till!");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
