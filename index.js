const express = require('express');
const mysql = require('mysql');
const util = require('util');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { assert } = require('console');


const PORT = 8000;
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_NAME = 'coursework';
const DB_PORT = 3306;

var connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});
connection.query = util.promisify(connection.query).bind(connection);

connection.connect((err) => {
    if(err){
        console.error(`could not connect to database
        ${err}
        `);
        return;
    }
    console.log('boom, you are connected');
});

const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', async (req, res) => {

    const studentCount = await connection.query('SELECT COUNT(*) as count FROM student');
    const courseCount = await connection.query('SELECT COUNT(*) as count FROM course')
    const membershipCount = await connection.query('SELECT COUNT(*) as count FROM membership')
    const hobbiesCount = await connection.query('SELECT COUNT(*) as count FROM hobbies')
    const eventsCount = await connection.query('SELECT COUNT(*) as count FROM events')
    res.render('index', {
        studentCount: studentCount[0].count,
        courseCount: courseCount[0].count,
        membershipCount: membershipCount[0].count,
        hobbiesCount: courseCount[0].count,
        eventsCount: courseCount[0].count


    });
});
app.get('/students', async (req, res) => {
    const students = await connection.query(`SELECT
    s.*,
    m.Member_Id,
    h.Hob_Name,
    events.Eve_Name,
    c.Crs_Title
FROM
    Student s
    INNER JOIN Membership m ON s.URN = m.URN
    INNER JOIN Student_Hobbies sh ON s.URN = sh.URN
    INNER JOIN Hobbies h ON sh.Hob_Code = h.Hob_Code
    INNER JOIN Student_Events se ON s.URN = se.URN
    INNER JOIN Events events ON se.Eve_Code = events.Eve_Code
    INNER JOIN Course c ON s.Stu_Course = c.Crs_Code;`);
    res.render('students', {students: students});
});
app.get('/students/edit/:id', async (req, res) => {
    const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course')
    const student = await connection.query('SELECT * from student INNER JOIN course on student.Stu_Course = course.Crs_Code WHERE URN = ?',
    [req.params.id]);
    res.render('student_edit', {student: student[0], courses: courses, message: ''});

});
app.post('/students/edit/:id', async (req, res) => {

    const updatedStudent = req.body;

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(updatedStudent.Stu_FName) || !nameRegex.test(updatedStudent.Stu_LName)) {
        const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course');
        const student = await connection.query('SELECT * from student INNER JOIN course on student.Stu_Course = course.Crs_Code WHERE URN = ?',
            [req.params.id]);
        res.render('student_edit', { student: student[0], courses: courses, message: 'Invalid first name or last name (should contain only letters)' });
        return;
    }


    if (isNaN(updatedStudent.Stu_Phone) || updatedStudent.Stu_Phone.length != 11){
        const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course')
        const student = await connection.query('SELECT * from student INNER JOIN course on student.Stu_Course = course.Crs_Code WHERE URN = ?',
        [req.params.id]);
        res.render('student_edit', {student: student[0], courses: courses, message: 'student not updated, invalid phone number'});
        return;
    }
    await connection.query('UPDATE STUDENT SET ? WHERE URN = ?', [updatedStudent, req.params.id]);
    const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course')
    const student = await connection.query('SELECT * from student INNER JOIN course on student.Stu_Course = course.Crs_Code WHERE URN = ?',
    [req.params.id]);
    res.render('student_edit', {student: student[0], courses: courses, message: 'student updated'});

});
app.get('/students/view/:id', async(req, res) => {
    const student = await connection.query(`SELECT
    s.*,
    m.Member_Id,
    h.Hob_Name,
    events.Eve_Name,
    c.Crs_Title
FROM
    Student s
    INNER JOIN Membership m ON s.URN = m.URN
    INNER JOIN Student_Hobbies sh ON s.URN = sh.URN
    INNER JOIN Hobbies h ON sh.Hob_Code = h.Hob_Code
    INNER JOIN Student_Events se ON s.URN = se.URN
    INNER JOIN Events events ON se.Eve_Code = events.Eve_Code
    INNER JOIN Course c ON s.Stu_Course = c.Crs_Code
    WHERE
    s.URN = ?;
`, [req.params.id]);
    res.render('student_view', {student: student[0]});
});

app.get('/students/add', async(req, res) => {
    const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course')
    const hobbies = await connection.query('SELECT Hob_Code, Hob_Name FROM Hobbies');
    const events = await connection.query('SELECT Eve_Code, Eve_Name FROM Events');

    res.render('student_add', { courses, hobbies, events, addMessage: '' });
});


app.post('/students/add', async (req, res) => {
    const courses = await connection.query('SELECT Crs_Code, Crs_Title FROM Course')
    const hobbies = await connection.query('SELECT Hob_Code, Hob_Name FROM Hobbies');
    const events = await connection.query('SELECT Eve_Code, Eve_Name FROM Events');
    const newStudent = req.body;
    const result = await connection.query('SELECT COUNT(*) as count FROM Student');
    const studentCount = result[0].count;
    const newCount = studentCount + 1;

    if (isNaN(newStudent.URN) || newStudent.URN.length != 6){
        res.render('student_add', {courses, hobbies, events, addMessage: 'student not added, invalid Phone number'});
        return;
    }
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(newStudent.Stu_FName) || !nameRegex.test(newStudent.Stu_LName)) {
        res.render('student_add', {courses, hobbies, events, addMessage: 'Invalid first name or last name (should contain only letters)'});
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.Stu_Email)) {
        res.render('student_add', { courses, hobbies, events, addMessage: 'Invalid Email' });
        return;
    }
    if (isNaN(newStudent.Stu_Phone) || newStudent.Stu_Phone.length != 11){
        res.render('student_add', {courses, hobbies, events, addMessage: 'student not added, invalid Phone number'});
        return;
    }
    if (isNaN(newStudent.Member_Id) || newStudent.Member_Id.length != 3){
        res.render('student_add', {courses, hobbies, events, addMessage: 'student not added, invalid Member Id'});
        return;
    }


    await connection.query('INSERT INTO Student SET ?', {
    Position: newCount,
     URN: newStudent.URN,
     Stu_FName: newStudent.Stu_FName,
     Stu_LName: newStudent.Stu_LName,
     Stu_DOB: newStudent.Stu_DOB,
     Stu_Email: newStudent.Stu_Email,
     Stu_Gender: newStudent.Stu_Gender,
     Stu_Phone: newStudent.Stu_Phone,
     Stu_Course: newStudent.Stu_Course,
     Stu_Type: newStudent.Stu_Type
    });

    await connection.query('INSERT INTO Membership SET ?', {
        Member_Id: newStudent.Member_Id,
        Exp_date: newStudent.Exp_date,
        URN: newStudent.URN
    });
    await connection.query('INSERT INTO Student_Hobbies SET ?', {
        URN: newStudent.URN,
        Hob_Code: newStudent.Hob_Code
    });

    await connection.query('INSERT INTO Student_Events SET ?', {
        URN: newStudent.URN,
        Eve_Code: newStudent.Eve_Code
    });
    res.render('student_add', {courses, hobbies, events, addMessage: 'student added'});
});



app.get('/students/removeRecent', async (req, res) => {
    const result = await connection.query('SELECT COUNT(*) as count FROM Student');
    const studentCount = result[0];
    if (studentCount.count === 0) {
        res.redirect('/students');
    } else {
    const recentStudent = await connection.query('SELECT URN FROM Student ORDER BY Position DESC LIMIT 1');
    if (recentStudent.length > 0) {
        const recentStudentURN = recentStudent[0].URN;
        await connection.query('DELETE FROM Student WHERE URN = ?', [recentStudentURN]);
        await connection.query('DELETE FROM Membership WHERE URN = ?', [recentStudentURN]);
        await connection.query('DELETE FROM Student_Hobbies WHERE URN = ?', [recentStudentURN]);
        await connection.query('DELETE FROM Student_Events WHERE URN = ?', [recentStudentURN]);
        res.redirect('/students');
    } else {
        res.redirect('/students');
    }
}
});

app.listen(PORT, () => {
console.log(`
application listening on http://localhost:${PORT}
`)
});