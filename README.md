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

-   [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) <br>
Description: Launch a development local Server with live reload feature for static & dynamic pages <br>
Version: 5.7.9 <br>
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
