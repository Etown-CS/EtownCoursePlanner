CREATE DATABASE course_planner;
USE course_planner;

CREATE TABLE IF NOT EXISTS course (
	id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    prof VARCHAR(255) DEFAULT ("TBD"), -- Changes so wait for updates
    days VARCHAR(255),
    department VARCHAR(255), -- Not null?
    start_time TIME,
    end_time TIME,
    core VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS advisor (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    office VARCHAR(255), -- .loc
    department VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user (
	id INT AUTO_INCREMENT PRIMARY KEY, -- Add password (hashed)
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    major VARCHAR(255) DEFAULT ("Undecided"), --img
    minor VARCHAR(255), # Multiple minors?
    advisor_id INT,
    FOREIGN KEY (advisor_id) REFERENCES advisor(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prerequisite (
	id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT, -- Main course meal
    prereq_id INT, -- Prereq for said course,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE, -- Delete rows in child table
    FOREIGN KEY (prereq_id) REFERENCES course(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_course (
    user_id INT, -- Primary
    course_id INT,-- Primary
    semester VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    constraint PK_completed_course PRIMARY KEY (user_id, course_id) -- Composite
);


-- Fix
INSERT INTO advisor (name, email, office, department) VALUES
('Dr. Wang', 'wangjingwen@etown.edu', 'Esbenshade 284D', 'Computer Science'),
('Dr. Li', 'lip@etown.edu', 'Esbenshade 284B', 'Computer Science');

INSERT INTO user (username, email, major, advisor_id) VALUES -- Add advisor name?
('student1', 's1@email.com', 'Computer Science', 1),
('student2', 's2@email.com', 'Computer Science', 2);

INSERT INTO course (course_code, name, credits, prof, department, days, start_time, end_time, core) VALUES
('CS121', 'Computer Science 1', 4, 'Dr.Wang', 'CS', 'MWF', '12:30', '1:50', 'None'),
('CS401', 'Capstone Project in Computing 1', 2, 'Dr.Wang', 'CS', 'TH', '12:30', '1:50', 'SLE'),
('CS310', 'Web Development', 4, 'Dr.Wang', 'CS', 'MWF', '11:00', '12:20', 'None'),
('CS341', 'Software Engineering', 4, 'Professor Reddig', 'CS', 'TTH', '08:00', '10:50', 'SLE');

INSERT INTO prerequisite (course_id, prereq_id) VALUES
(2, 4),
(3, 1);

INSERT INTO completed_course (user_id, course_id, semester) VALUES
(1, 1, 'FA2023'),
(1, 3, 'FA2024'),
(2, 1, 'FA2024');
