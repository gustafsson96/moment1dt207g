# Moment 1 - DT207G

This website is my contribution to the first assignment for the course "Backend-baserad webbutveckling (DT207G)" at Mittuniversitet. 

## Overview
This project is a course management system built using Node.js, Express, EJS, dotenv and PostgreSQL. It allows users to: 

* View a list of available courses.
* Add new courses by filling out a form.
* Delete existing courses from the list.
* Read about the assignment (in Swedish). 

## Features 
* **View courses:** Display courses from the database in a table on the home page. 
* **Add a course:** Add a new course with a course code, course name, syllabus and progression.
* **Form validation:** User input is validated to ensure that the fields are filled out 
and that the course code is unique before saving to the database. If not, a feedback message is displayed.
* **Delete courses:** Delete a course using a button that is based on course id. 

## Technologies Used
* Node.js
* Express
* (MySQL - replaced by PostgreSQL)
* PostgreSQL
* EJS
* dotenv
* nodemon (in development)

## Installation

### .env
The structure for the enviroment variables is:

PORT=desired-port-number
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name

### Routes
The routes in the server file are: 

* get /: homepage that displays list of courses. 
* get /form: displays form for adding a new course. 
* post /: submits the form to add a new course.
* get / delete/:id: deletes a course by its id. 
* get /about: contains information about the assignment.

### Table
The database table is created by running the install.js file.

### Render
[Render](https://render.com) has been used both to created the Postgres database and to publish the website. 
