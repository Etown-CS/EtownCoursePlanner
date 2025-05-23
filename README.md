# EtownCoursePlanner

![Static Badge](https://img.shields.io/badge/etown-capstone-blue)

Elizabethtown College | Computer Science Department | Capstone Projects 

The Etown Course Planner aims to help students and professors with course planning. This tool will aim to be able to help students plan one specific semester, or be able to plan a yearly schedule. This will ease some of the responsibilities of advisors and mentors during the course selection process.

## External Requirements

In order to build this project locally you first have to install:

-   [Node.js](https://nodejs.org/en/) <br>
To install packages from the public node project manager (npm) registry or a private npm registry, you must install Node.js and the npm command line interface using either a Node version manager or a Node installer. We strongly recommend using a Node version manager like nvm to install Node.js and npm.<br>
Once you have the nvm installed. Start a new Terminal/PowerShell Administrator mode. Then run nvm -v to confirm the installation.<br>
To install the latest version of Node, run nvm install [version_number].<br>
Node.js version 18 is the recommended version for most of the users.<br>
To use a specific version of Node, run: nvm use version-number.

-   [Nodemon] <br>
Description: <br> nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected. Nodemon does not require any additional changes to your code or method of development. nodemon is a replacement wrapper for node. <br> 
<br> To load the server instance use the commands 'npm install' and 'npx nodemon server.js'. The terminal will produce a port that can be copied and pasted into the search engine of your choice. You will then be able to view our website with ease. <be>
- OpenAI <br>
  To use the OpenAI API with Node.js, you first need to install Node.js and npm (Node Package Manager), preferably through a version manager like nvm, which allows you to easily switch between Node versions. To begin, install nvm following the instructions on its official GitHub page. After installation, open a new terminal or PowerShell window (in Administrator mode on Windows) and confirm nvm is installed by running nvm -v. Then, install the recommended version of Node.js (version 18) by running nvm install 18, and activate it with nvm use 18. Next, create a new Node project by running npm init -y inside your project folder. To use the OpenAI API, install the official OpenAI Node.js client with npm install openai. In your code, you can initialize the API with your key (preferably stored securely in a .env file) and use the openai.chat.completions.create() method to send messages and receive responses. For example, after setting up your environment and writing your script, running it will return a chatbot-like response. If you're using environment variables, install the dotenv package to manage your API keys securely. This setup provides a streamlined and secure way to interact with OpenAI’s models from a Node.js environment.<br>

- PDF-parse <br>
To parse PDF files in Node.js, you need to install Node.js and npm, preferably using a version manager like nvm. After installing nvm, verify the installation by running nvm -v and install Node.js version 18 using nvm install 18, followed by nvm use 18. Once your environment is ready, initialize a new project using npm init -y. To extract text or data from PDF files, one of the most popular libraries is pdf-parse, which can be installed using npm install pdf-parse. After installation, you can use it in your script by requiring the package and reading a PDF file using the fs module. The pdf-parse library processes the file buffer and returns the extracted text and metadata in a promise. This makes it easy to access PDF content and use it in applications such as text analysis, data extraction, or content display. This method is efficient for simple text-based PDFs and is commonly used in Node.js workflows that require reading and handling PDF content.<br>

<br> 


# Setup

<!---
Here you list all the one-time things the developer needs to do after cloning
your repo. Sometimes there is no need for this section, but some apps require
some first-time configuration from the developer, for example: setting up a
database for running your webapp locally. -->


## Running

Now that everything's running and in its proper place, you can open the website locally. Enter the URL below into your browser, and the index page should load. <br>
http://localhost/etowncourseplanner/web_src/

## Database (Cloud SQL)
Using your appropriate google account, navigate to the SQL tab in the GCP Console. Create an instance using MySQL and choose the appropriate settings and pricing options for your database. Once created, you can open the cloud shell, connect to your database, and run the commands in data_src/db.sql or connect to the database via MySQL Workbench using your database name, password, and its public IP address and run the script there. If you choose to use MySQL Workbench, be sure to allow your own IP address in Connections->Networking under Authorized Networks in GCP. When testing or deploying, be sure to keep the database running and enable the Cloud SQL API.

## Deployment

To officially deploy the page, you must have access to the Google Cloud Platform. We'll assume that's taken care of for these instructions.<br>
Open up a terminal in VSC, then run the following command: <br>
gcloud app deploy <br>
Once you run this, a prompt will appear asking for a Y or a N. Type Y and hit enter, then wait for the command to finish.<br><br>
Once this is completed, you can use the following command to open the deployed website in your browser: <br>
gcloud app browse <br>
To offically launch LiveServer to receive live updates on your webpages, locate the "Go Live" button on the bottom right hand corner 
of your VSCode window. This will open an external window with the website. 

# APIs

<b>`Register API`</b>
-  POST Request
-  Endpoint URL: /register
-  Expected Parameters: username, email, major, advisor, password
-  Response & Error Handling Examples:
   - message: "Account created successfully." - Status 200 JSON Response
   - message: "Missing required field." - Status 400 JSON Response
   - message: "Invalid Username! Username include first and last name, and start with uppercase." - Status 400 JSON Response
   - message: "Invalid etown.edu email: ${email}" - Status 400 JSON Response
   - message: "Invalid password! Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." - Status 400 Error Response
   - message: "Email already in use, try again." - Status 400 JSON Response
   - message: "Error." - Status 500 JSON Response

<b>`Login API`</b>
-  POST Request
-  Endpoint URL: /login
-  Expected Parameters: email, password
-  Response & Error Handling Examples:
   - message: "Login successful!" - Status 200 JSON Response
   - message: "Missing required field." - Status 400 JSON Response
   - message: "User not found. Try again." - Status 400 JSON Response
   - message: "Password incorrect. Try again." - Status 400 JSON Response
   - message: "Error." - Status 500 JSON Response

<b>`Core API`</b>
- GET Request
- Endpoint URL: /core
- Response & Parameter Handling Examples:
   - message: "Error on the server. Please try again later." - Status 500 JSON Response

<b>`Advisors API`</b>
- GET Request
- Endpoint URL: /advisors
- Response & Parameter Handling Examples:
   - message: "No advisors found." - Status 404 JSON Response
   - message: "Error on the server. Please try again later." - Status 500 JSON Response
 
<b>`Major API`</b>
- GET Request
- Endpoint URL: /major
- Response & Parameter Handling Examples:
   - message: "No major courses found." - Status 404 JSON Response
   - message: "Error on the server. Please try again later." - Status 500 JSON Response

<b>`Completed Courses API`</b>
- GET Request
- Endpoint URL: /courses-completed
- Response & Parameter Handling Examples:
   - message: "No completed courses found." - Status 404 JSON Response
   - message: "Error on the server. Please try again later." - Status 500 JSON Response

<b>`Courses API`</b>
- GET Request
- Endpoint URL: /courses
- Response & Parameter Handling Examples:
   - message: "No courses found." - Status 404 JSON Response
   - message: "Error on the server. Please try again later." - Status 500 JSON Response

# Coding Style Guides
HTML/CSS Style Guide - https://google.github.io/styleguide/htmlcssguide.html <br>
Javascript Style Guide - https://google.github.io/styleguide/jsguide.html 

# Features
## 🌐 General Features
- Web-based academic planning tool
- Built with Node.js, JavaScript, MySQL, and ChatGPT
- Hosted on Google Cloud Platform (GCP) with Cloud SQL
- Responsive design using HTML5, Bootstrap 5, and CSS
- Adheres to Elizabethtown College branding

---

## 🔐 User Accounts
- Secure user login and registration system
- Editable academic profile (major, minor, completed courses, etc.)
- Session storage for personalized experience

---

## 🗓️ Four-Year Plan Grid
- Automatically generates an 8-semester plan based on major
- Editable course selections with dropdown menus
- Add/remove semesters for study abroad, part-time, or accelerated paths
- Save and personalize plans for future use

---

## 📅 Schedule Builder
- Manually build class and event schedules
- Assign days, times, titles, and colors to events
- Unlimited schedules with sorting (Newest to Oldest, etc.)
- Save, download, and manage schedules on the "My Schedules" page

---

## 🤖 AI Scheduling Assistant
- Integrates OpenAI GPT-4o-mini API
- Parses uploaded course track PDFs (using pdf-parse)
- Generates optimized semester schedules based on user data
- Ensures prerequisite satisfaction and no time conflicts
- Offers insights about courses and requirements

---

## 💬 Advisor Messaging System
- Built-in communication with advisors using Brevo API
- Auto-retrieves advisor contact info from session storage
- Send messages without leaving the platform

---

## 📈 Degree Progress Tracker
- Visual display of progress through major, minor, and core requirements
- Shows completion percentages
- Detailed breakdown of completed and remaining courses

---

## ✅ Prerequisite and Conflict Tracking
- Automatically tracks completed prerequisites
- Prevents selection of unavailable/ineligible courses
- Highlights course conflicts and unfulfilled requirements

---

---

## ⚠️ Limitations & Future Improvements

### 🚧 Current Limitations
- **Major Coverage**: Only supports the Computer Science major; other majors and minors are not yet implemented.
- **Manual Data Input**: Adding new course tracks and course offerings requires manual database entry.
- **Limited AI Context**: The GPT-generated schedules rely on uploaded PDFs and do not yet have full access to real-time course data or historical offerings.
- **Prerequisite Complexity**: Handles most direct prerequisites but does not yet support complex conditional requirements (e.g., "take 2 of the following 3 courses").
- **No Mobile App**: Accessible via web browser only; lacks a dedicated mobile app for offline planning.
- **Single-School Scope**: Tailored for Elizabethtown College and not easily adaptable to other institutions without customization.
- **Accessibility Compliance**: Basic support exists, but full WCAG 2.1 compliance has not yet been validated.

### 🚀 Planned Improvements
- **Multi-Major Support**: Expand to include additional majors and minors across departments.
- **Dynamic Course Data Integration**: Automate course and requirement updates via API from the college’s registrar or catalog.
- **Enhanced AI Scheduling**: Allow multi-semester optimization and handle special constraints (study abroad, dual majors, etc.).
- **Advanced Prerequisite Logic**: Support for conditional and grouped prerequisites.
- **Mobile App Development**: Build a cross-platform app version for iOS and Android using frameworks like React Native.
- **Custom Advisor Dashboards**: Allow advisors to view, comment on, and edit student plans directly.
- **Analytics & Insights**: Provide students with progress forecasting, GPA calculators, and course difficulty insights.
- **Accessibility Overhaul**: Conduct full audit and redesign for WCAG compliance and keyboard/screen reader navigation.




# Authors

Isabel Mattivi - pachecomattivii@etown.edu <br>
Stephanie Motz - motzs@etown.edu <br>
Melissa Patton - pattonm@etown.edu <br>
Dani Strausburger - strausburgerd@etown.edu <br>

## UI Designs:
<br>
<img width="400" height="500" alt="home page" src="https://github.com/user-attachments/assets/40d55beb-943f-4735-ac84-d1f89a463ccc">
<img width="340" height="500" alt="home2" src="https://github.com/user-attachments/assets/d87800b9-febb-41e2-99db-924798dc225b">
<img width="324" height="500" alt="progress" src="https://github.com/user-attachments/assets/b71159d9-bf33-446c-b733-6b9e5ab27179">
<img width="370" height="500" alt="schedule" src="https://github.com/user-attachments/assets/617a669b-d610-4d2e-b3e9-8024a9f27a9b">
<img width="374" height="500" alt="Schedule Page" src="https://github.com/user-attachments/assets/f8b79f9f-117a-4f04-a275-75bb2705956f">
