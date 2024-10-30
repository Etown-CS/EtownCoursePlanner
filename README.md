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

-   [XAMPP](https://www.apachefriends.org/)

## Setup

<!---
Here you list all the one-time things the developer needs to do after cloning
your repo. Sometimes there is no need for this section, but some apps require
some first-time configuration from the developer, for example: setting up a
database for running your webapp locally. -->

Once you have XAMPP downloaded, you want to clone the repo to your local machine. Make sure to either clone it into, or move it into XAMPP/htdocs/ so that you can utilize XAMPP to locally host the website.<br>
After that, open XAMPP and click the start buttons next to apache and MySQL. Then, click on the shell button to open a command line terminal.<br>

Run the db.sql script in an XAMPP command line to access a local version of the database.

## Running

Now that everything's running and in its proper place, you can open the website locally. Enter the URL below into your browser, and the index page should load. <br>
http://localhost/etowncourseplanner/web_src/

# Deployment

To officially deploy the page, you must have access to the Google Cloud Platform. We'll assume that's taken care of for these instructions.<br>
Open up a terminal in VSC, then run the following command: <br>
gcloud app deploy <br>
Once you run this, a prompt will appear asking for a Y or a N. Type Y and hit enter, then wait for the command to finish.<br><br>
Once this is completed, you can use the following command to open the deployed website in your browser: <br>
gcloud app display

# Authors

Isabel Mattivi - pachecomattivii@etown.edu
Stephanie Motz - motzs@etown.edu
Melissa Patton - pattonm@etown.edu
Dani Strausburger - strausburgerd@etown.edu

## UI Designs:
<br>
<img width="450" height="500" alt="home page" src="https://github.com/user-attachments/assets/40d55beb-943f-4735-ac84-d1f89a463ccc">
<img width="341" height="500" alt="home2" src="https://github.com/user-attachments/assets/d87800b9-febb-41e2-99db-924798dc225b">
<img width="324" height="500" alt="progress" src="https://github.com/user-attachments/assets/b71159d9-bf33-446c-b733-6b9e5ab27179">
<img width="370" height="500" alt="schedule" src="https://github.com/user-attachments/assets/617a669b-d610-4d2e-b3e9-8024a9f27a9b">
<img width="374" height="500" alt="Schedule Page" src="https://github.com/user-attachments/assets/f8b79f9f-117a-4f04-a275-75bb2705956f">
