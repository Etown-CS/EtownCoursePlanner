-- SQLite3 equivalent for MySQL 'course_planner' database

DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS advisor;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS prerequisite;
DROP TABLE IF EXISTS completed_course;

CREATE TABLE IF NOT EXISTS course (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    prof TEXT,
    days TEXT,
    department TEXT, 
    start_time TEXT, -- store 'HH:MM' format manually
    end_time TEXT,
    core TEXT DEFAULT "None"
);

CREATE TABLE IF NOT EXISTS advisor (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    office TEXT,
    department TEXT
);

CREATE TABLE IF NOT EXISTS user (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    major TEXT DEFAULT "Undecided",
    minor TEXT,
    advisor_id INTEGER,
    password TEXT NOT NULL, -- Assume hashed password as TEXT
    FOREIGN KEY (advisor_id) REFERENCES advisor(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prerequisite (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    prereq_id INTEGER,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_id) REFERENCES course(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_course (
    user_id INTEGER,
    course_id INTEGER,
    semester TEXT,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Insert data into advisor table
INSERT INTO advisor (name, email, office, department) VALUES
('Dr. Wang', 'wangjingwen@etown.edu', 'Esbenshade 284D', 'Computer Science'),
('Dr. Li', 'lip@etown.edu', 'Esbenshade 284B', 'Computer Science'),
('Dr. Leap', 'leap@etown.edu', 'Esbenshade 284A', 'Computer Science');

-- Inserting data into user table
INSERT INTO user (username, email, major, advisor_id, password) VALUES
('student1', 's1@email.com', 'Computer Science', 1, 'secretpassword1'),
('student2', 's2@email.com', 'Computer Science', 2, 'moresecretpassword2');

-- Insert data into course table
INSERT INTO course (course_code, name, credits, department, core) VALUES
('CS121', 'Computer Science I', 4, 'Computer Science', 'None'), -- 1
('CS122', 'Computer Science II', 4, 'Computer Science', 'None'), -- 2 
('CS209', 'Database Systems', 4, 'Computer Science', 'None'), -- 3
('CS205', 'Introduction to Information Systems', 2, 'Computer Science', 'None'), -- 4
('CS261', 'Ethical Hacking', 2, 'Computer Science', 'None'), -- 5
('CS262', 'Digital Forensics', 2, 'Computer Science', 'None'), -- 6
('CS230', 'Computer Architecture', 4, 'Computer Science', 'None'), -- 7
('CS250', 'Foundations of AI & Data Science', 4, 'Computer Science', 'None'), -- 8
('CS310', 'Web Development', 4, 'Computer Science', 'None'), -- 9
('CS341', 'Software Engineering', 4, 'Computer Science', 'SLE'), -- 10
('CS342', 'Computer Networking', 4, 'Computer Science', 'None'), -- 11
('CS296', 'Professional Development Seminar', 1, 'Computer Science', 'None'), -- 12
('CS396', 'Industry and Special Topics Seminar', 1, 'Computer Science', 'None'), -- 13
('CS401', 'Capstone Project in Computing I', 2, 'Computer Science', 'SLE'), -- 14
('CS402', 'Capstone Project in Computing II', 2, 'Computer Science', 'SLE'), -- 15
('CS409', 'Database Cloud Computing', 4, 'Computer Science', 'None'), -- 16
('MA251', 'Probability & Statistics', 4, 'Mathematics', 'MA'), -- 17
('MA250', 'Sports Analytics', 4, 'Mathematics', 'MA'), -- 18
('PH263', 'Societal Impacts of Computing, Artificial Intelligence, and Robotics', 4, 'Philosophy', 'HUM'), -- 19
('EC101', 'Principles of Macroeconomics', 4, 'Economics', 'SSC'), -- 20
('MA121', 'Calculus I', 4, 'Mathematics', 'MA'), -- 21
('MA135', 'Applied Discrete Mathematics', 4, 'Mathematics', 'None'), -- 22
('CS222', 'Systems Programming', 4, 'Computer Science', 'None'), -- 23
('CS322', 'Algorithms', 4, 'Computer Science', 'None'), -- 24
('CS421', 'Programming Language Design and Implementation', 4, 'Computer Science', 'None'), -- 25
('CS422', 'Operating Systems', 4, 'Computer Science', 'None'), -- 26
('CS363', 'Computer Security', 4, 'Computer Science', 'None'), -- 27
('CS364', 'Network Security', 4, 'Computer Science', 'None'), -- 28
('CS113', 'The Power and Beauty of Computing', 4, 'Computer Science', 'NPS'), -- 29
('EN100', 'PLE First Year Writing', 4, 'Language', 'PLE'), -- 30
('CS221', 'Data Structures', 4, 'Computer Science', 'None'); -- 31


-- Insert data into prerequisite table
INSERT INTO prerequisite (course_id, prereq_id) VALUES
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(8, 21),
(8, 22),
(8, 17),
(9, 2),
(10, 2),
(11, 2),
(14, 10),
(15, 14),
(16, 3);

-- Insert data into completed_course table
INSERT INTO completed_course (user_id, course_id, semester) VALUES
(1, 1, 'FA2023'),
(1, 2, 'SP2024'),
(1, 29, 'SP2024'),
(1, 30, 'SP2024'),
(1, 3, 'FA2024'),
(1, 19, 'FA2024'),
(1, 21, 'FA2024'),
(2, 1, 'FA2024');
