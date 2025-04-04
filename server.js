const { Client } = require("pg");
const express = require("express");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Activate form data

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

// Routing
app.get("/", async (req, res) => {
    client.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            console.log("Fel viq query");
        } else {
            res.render('index', { courses: result.rows });
        }
    });
});

app.get("/form", async (req, res) => {
    res.render("form", { message: null });
});

app.post("/", async (req, res) => {
    const { coursecode, coursename, syllabus, progression } = req.body;

    // Check for empty strings
    if (!coursecode?.trim() || !coursename?.trim() || !syllabus?.trim() || !progression?.trim()) {
        return res.render("form", {
            message: {
                type: "error",
                text: "Alla fält måste fyllas i."
            }
        });
    }

    try {
        const checkCourseCode = "SELECT * FROM courses WHERE course_code = $1";
        const existing = await client.query(checkCourseCode, [coursecode]);

        if (existing.rows.length > 0) {
            return res.render("form", {
                message: {
                    type: "error",
                    text: "Den här kurskoden finns redan. Vänligen välj en unik."
                }
            });
        }

        const insertCourse = `
            INSERT INTO courses (course_code, course_name, course_syllabus, course_progression)
            VALUES ($1, $2, $3, $4)
        `;
        await client.query(insertCourse, [coursecode, coursename, syllabus, progression]);

        res.render("form", {
            message: {
                type: "success",
                text: "Kursen har lagts till!"
            }
        });
    } catch (err) {
        console.error(err);
        res.render("form", {
            message: {
                type: "error",
                text: "Något gick fel vid sparandet av kursen."
            }
        });
    }
});

app.get("/delete/:id", (req, res) => {
    const courseId = req.params.id;
    console.log(`Course to delete: ${courseId}`);  // Log the ID to ensure it's being passed correctly

    client.query("DELETE FROM courses WHERE id = $1", [courseId], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect("/");
    });
});

app.get("/about", async (req, res) => {
    res.render("about");
});

// Start server
app.listen(process.env.PORT, () => {
    console.log("Servern startad på port: " + process.env.PORT);
});