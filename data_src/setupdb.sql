-- SQLite3 equivalent for MySQL 'course_planner' database

DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS advisor;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS prerequisite;
DROP TABLE IF EXISTS completed_course;

CREATE TABLE IF NOT EXISTS course (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    prof TEXT DEFAULT "TBD",
    days TEXT,
    department TEXT, 
    start_time TEXT, -- store 'HH:MM' format manually
    end_time TEXT,
    core TEXT NOT NULL
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
('Dr. Li', 'lip@etown.edu', 'Esbenshade 284B', 'Computer Science');

-- Inserting data into user table
INSERT INTO user (username, email, major, advisor_id, password) VALUES
('student1', 's1@email.com', 'Computer Science', 1, 'secretpassword1'),
('student2', 's2@email.com', 'Computer Science', 2, 'moresecretpassword2');

-- Insert data into course table
INSERT INTO course (course_code, name, credits, prof, department, days, start_time, end_time, core) VALUES
('CS121', 'Computer Science 1', 4, 'Dr. Wang', 'CS', 'MWF', '12:30', '13:50', 'None'),
('CS401', 'Capstone Project in Computing 1', 2, 'Dr. Wang', 'CS', 'TH', '12:30', '13:50', 'SLE'),
('CS310', 'Web Development', 4, 'Dr. Wang', 'CS', 'MWF', '11:00', '12:20', 'None'),
('CS341', 'Software Engineering', 4, 'Professor Reddig', 'CS', 'TTH', '08:00', '10:50', 'SLE');

-- Insert data into prerequisite table
INSERT INTO prerequisite (course_id, prereq_id) VALUES
(2, 4),
(3, 1);

-- Insert data into completed_course table
INSERT INTO completed_course (user_id, course_id, semester) VALUES
(1, 1, 'FA2023'),
(1, 3, 'FA2024'),
(2, 1, 'FA2024');
