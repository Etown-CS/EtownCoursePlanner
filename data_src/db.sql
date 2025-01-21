CREATE DATABASE course_planner;
USE course_planner;

CREATE TABLE IF NOT EXISTS course (
	id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    prof VARCHAR(255),
    days VARCHAR(255),
    department VARCHAR(255), -- Not null?
    start_time TIME,
    end_time TIME,
    core VARCHAR(255) DEFAULT ("None")
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
    major VARCHAR(255) DEFAULT ("Undecided"), -- img
    minor VARCHAR(255), # Multiple minors?
    advisor_id INT,
    FOREIGN KEY (advisor_id) REFERENCES advisor(id) ON DELETE SET NULL
);

ALTER TABLE user ADD COLUMN password VARCHAR(255) NOT NULL; -- Hashed pwd field

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

CREATE TABLE IF NOT EXISTS schedule ( -- Saved schedules
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedule_course (  -- Array of courses for each schedule
	id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    course_id INT NULL,
    days VARCHAR(255) NOT NULL,
    custom_name VARCHAR(255) NULL,
    custom_start TIME, # Store start time
    custom_end TIME, # Store end time
    color VARCHAR(50) NOT NULL, # Store rgb?
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
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
('EN100', 'PLE First Year Writing', 4, 'Language', 'PLE'); -- 30

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
