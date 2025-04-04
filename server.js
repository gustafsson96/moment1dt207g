// Import modules
const { Client } = require("pg");
const express = require("express");
require("dotenv").config();

// Create an express application
const app = express();

// Set up EJS for rendering HTML code
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Handle form data
app.use(express.urlencoded({ extended: true }));

// Connect to a Postgres database
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

// Establish database connection
client.connect((err) => {
    if (err) {
        console.log("Fel vid anslutning" + err);
    } else {
        console.log("Ansluten till databasen...")
    }
});

// Routing

app.get("/", async (req, res) => {
    // Query to get all courses from the database
    client.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            console.log("Fel viq query");
        } else {
            res.render('index', { courses: result.rows });
        }
    });
});

// Routing for the add course form page
app.get("/form", async (req, res) => {
    res.render("form", { message: null }); // Render the form with no message initially
});

// Handle form submission
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
        // Query to check if a course code already exists
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

        // Query to insert new course into database
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

// Delete a course based on course id
app.get("/delete/:id", (req, res) => {
    const courseId = req.params.id;
    console.log(`Course to delete: ${courseId}`);  // Log the ID to ensure it's being passed correctly

    // Query to delete course from database by its ID
    client.query("DELETE FROM courses WHERE id = $1", [courseId], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect("/");
    });
});

// Routing for the about page
app.get("/about", async (req, res) => {
    res.render("about");
});

// Start server
app.listen(process.env.PORT, () => {
    console.log("Servern startad på port: " + process.env.PORT);
});