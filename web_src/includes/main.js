(function () {
    "use strict";

    window.addEventListener("load", init);
    
    function init() {
        const email = window.sessionStorage.getItem('email');
        $('#navbar').load('includes/navbar.html', function() {
            // Now that the navbar is loaded, check for the current page and apply "active" class
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            })
            if (email) {
                document.getElementById("li-pfp").classList.remove("hidden");
                document.getElementById("pfp").classList.add("hidden");

                document.getElementById("li-home").classList.remove("hidden");
                document.getElementById("home").classList.add("hidden");
            }  else {
                // If no email, make sure the profile pictures are in the default state
                document.getElementById("li-pfp").classList.add("hidden");
                document.getElementById("pfp").classList.remove("hidden");

                document.getElementById("home").classList.remove("hidden");
                document.getElementById("li-home").classList.add("hidden");
            }
        });

        

        // Load the footer
        $('#footer').load('includes/footer.html');


        document.getElementById("createNew").addEventListener("click", function() {
            // Redirect to the desired page
            window.location.href = "create.html"; // Replace 'newPage.html' with your desired URL
        });
    }
    
})();