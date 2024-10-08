<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Etown Course Planner</title>

    <!-- Etown Font look-alike -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Crete+Round&display=swap" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'navbar.php'; ?>

    <section id="welcome-msg">
        <h1 class="crete-round-regular">Welcome to the Etown Course Planner</h1> <!--Contribution-->
    </section>

    <section id="basic-instructions">
        <h1 class="crete-round-regular">Want to learn more about the project?</h1>
        <p id="learn-more">
            Explore the website without logging in if you want an overview of the website.
            Want a project overview? Scroll down for an overview about our team and project.
            Or you can click below to register, and get started!
        </p>
    </section>

    <button id="get-started">Get Started!</button>

    <section id="about-project">
        <h1 class="crete-round-regular">About Etown Course Planner</h1>
        <p id="about-team">
            Our team was created in Etown's computer science capstone class in Fall 2024.
            The members of this team are Isabel Mattivi, Stephanie Motz, Melissa Patton, and Dani Strausburger.
            This project takes place over the fall and spring semesters of our senior year, and will be finished by the end of Spring 2025.
        </p>
    </section>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>