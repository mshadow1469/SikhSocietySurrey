DROP DATABASE IF EXISTS coursework;

CREATE DATABASE coursework;

USE coursework;

-- This is the Course table
 
DROP TABLE IF EXISTS Course;

CREATE TABLE Course (
Crs_Code 	INT UNSIGNED NOT NULL,
Crs_Title 	VARCHAR(255) NOT NULL,
Crs_Enrollment INT UNSIGNED,
PRIMARY KEY (Crs_code));


INSERT INTO Course VALUES 
(100,'BSc Computer Science', 150),
(101,'BSc Computer Information Technology', 20),
(200, 'MSc Data Science', 100),
(201, 'MSc Security', 30),
(210, 'MSc Electrical Engineering', 70),
(211, 'BSc Physics', 100);


-- This is the student table definition


DROP TABLE IF EXISTS Student;

CREATE TABLE Student (
Position INT UNSIGNED NOT NULL,
URN INT UNSIGNED NOT NULL,
Stu_FName 	VARCHAR(255) NOT NULL,
Stu_LName 	VARCHAR(255) NOT NULL,
Stu_DOB 	DATE,
Stu_Email   VARCHAR(255),
Stu_Gender  ENUM('M', 'F'),
Stu_Phone 	VARCHAR(12),
Stu_Course	INT UNSIGNED NOT NULL,
Stu_Type 	ENUM('UG', 'PG'),
PRIMARY KEY (URN),
FOREIGN KEY (Stu_Course) REFERENCES Course (Crs_Code)
ON DELETE RESTRICT);

INSERT INTO Student VALUES
(1, 612345, 'Jaspreet', 'Singh', '2002-06-20', 'jaspreetsingh@mail.com', 'F', '01483112233', 100, 'UG'),
(2, 612346, 'Gurpreet', 'Kaur', '2002-03-12', 'gurpreetkaur@mail.com', 'M', '01483223344', 100, 'UG'),
(3, 612347, 'Harpreet', 'O-Hara', '2001-05-03', 'harpreetohara@mail.com', 'M', '01483334455', 100, 'UG'),
(4, 612348, 'Rajinder', 'Ogunsola', '2002-04-21', 'rajinderogunsola@mail.com', 'M', '01483445566', 100, 'UG'),
(5, 612349, 'Amandeep', 'Sharif', '2001-12-29', 'amandeepsharif@mail.com', 'M', '01483778899', 100, 'UG'),
(6, 612350, 'munpreet', 'Kaur', '2002-06-07', 'munpreetkaur@mail.com', 'F', '01483123456', 100, 'UG'),
(7, 612351, 'Jaswinder', 'Spiliotis', '2002-07-02', 'jaswinderspiliotis@mail.com', 'M', '01483234567', 100, 'UG'),
(8, 612352, 'Amrit', 'Jones', '2001-10-24', 'amritjones@mail.com',  'M', '01483456789', 101, 'UG'),
(9, 612353, 'Harpreet', 'Larson', '2002-08-23', 'harpreetlarson@mail.com', 'M', '01483998877', 101, 'UG'),
(10, 612354, 'Baljeet', 'Kaur', '2002-05-16', 'baljeetkaur@mail.com', 'F', '01483776655', 101, 'UG');

DROP Table IF EXISTS Membership;

Create Table Membership (
Member_Id INT PRIMARY KEY,
Exp_date DATE,
Stu_Email   VARCHAR(255),
URN INT UNSIGNED NOT NULL,
FOREIGN KEY (URN) REFERENCES Student(URN)
ON DELETE CASCADE);

INSERT INTO Membership VALUES
(213, '2023-12-31', 'jaspreetsingh@mail.com', 612345),
(214, '2023-11-30', 'gurpreetkaur@mail.com', 612346),
(215, '2024-01-15', 'harpreetohara@mail.com', 612347),
(216, '2023-10-31', 'rajinderogunsola@mail.com', 612348),
(217, '2023-09-30', 'amandeepsharif@mail.com', 612349),
(218, '2023-08-27', 'munpreetkaur@mail.com', 612350),
(219, '2023-07-22', 'jaswinderspiliotis@mail.com', 612351),
(220, '2024-06-12', 'amritjones@mail.com', 612352),
(221, '2023-05-01', 'harpreetlarson@mail.com', 612353),
(222, '2023-04-04', 'baljeetkaur@mail.com', 612354);


DROP TABLE IF EXISTS Undergraduate;

CREATE TABLE Undergraduate (
UG_URN 	INT UNSIGNED NOT NULL,
UG_Credits   INT NOT NULL,
CONSTRAINT CHK_UG_Credits CHECK (UG_Credits BETWEEN 60 AND 150),
PRIMARY KEY (UG_URN),
FOREIGN KEY (UG_URN) REFERENCES Student(URN)
ON DELETE CASCADE);

INSERT INTO Undergraduate VALUES
(612345, 120),
(612346, 90),
(612347, 150),
(612348, 120),
(612349, 120),
(612350, 60),
(612351, 60),
(612352, 90),
(612353, 120),
(612354, 90);

DROP TABLE IF EXISTS Postgraduate;

CREATE TABLE Postgraduate (
PG_URN 	INT UNSIGNED NOT NULL,
Thesis  VARCHAR(512) NOT NULL,
PRIMARY KEY (PG_URN),
FOREIGN KEY (PG_URN) REFERENCES Student(URN)
ON DELETE CASCADE);

CREATE TABLE Hobbies (
    Hob_Code INT PRIMARY KEY,
    Hob_Name VARCHAR(255)
);

INSERT INTO Hobbies VALUES
(1, 'Reading'),
(2, 'hiking'),
(3, 'chess'),
(4, 'Taichi'),
(5, 'Ballroom dancing'),
(6, 'football'),
(7, 'Tennis'),
(8, 'Rugby'),
(9, 'climbing'),
(10, 'Rowing');


CREATE TABLE Student_Hobbies (
    URN INT UNSIGNED NOT NULL,
    Hob_Code INT,
    PRIMARY KEY (URN, Hob_Code),
    FOREIGN KEY (URN) REFERENCES Student(URN) ON DELETE CASCADE,
    FOREIGN KEY (Hob_Code) REFERENCES Hobbies(Hob_Code) ON DELETE CASCADE
);

INSERT INTO Student_Hobbies VALUES
(612345, 1),
(612346, 4),
(612347, 2),
(612348, 3),
(612349, 1),
(612350, 5),
(612351, 9),
(612352, 7),
(612353, 8),
(612354, 10);

CREATE TABLE Events (
    Eve_Code INT PRIMARY KEY,
    Eve_Name varchar(255),
    Eve_time TIME,
    Eve_date DATE
);

INSERT INTO Events VALUES
(1, 'japji sahib', '18:00:00', '2023-12-15'),
(2, 'jaap sahib', '14:30:00', '2023-11-20'),
(3, 'ardas', '20:15:00', '2024-01-05'),
(4, 'chaupai sahib', '12:00:00', '2023-10-10'),
(5, 'anannd sahib', '16:45:00', '2023-09-25');

CREATE TABLE Student_Events (
    URN INT UNSIGNED NOT NULL,
    Eve_Code INT,
    PRIMARY KEY (URN, Eve_Code),
    FOREIGN KEY (URN) REFERENCES Student(URN) ON DELETE CASCADE,
    FOREIGN KEY (Eve_Code) REFERENCES Events(Eve_Code) ON DELETE CASCADE
);

INSERT INTO Student_Events VALUES
(612345, 1),
(612346, 2),
(612347, 3),
(612348, 4),
(612349, 5),
(612350, 1),
(612351, 2),
(612352, 3),
(612353, 4),
(612354, 5);



