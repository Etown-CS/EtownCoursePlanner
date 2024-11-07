(function () {
    "use strict";

    window.addEventListener("load", init);
    
    function init() {
        $('#navbar').load('includes/navbar.html', function() {
            // Now that the navbar is loaded, check for the current page and apply "active" class
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                }
            });
        });
        document.getElementById("createNew").addEventListener("click", function() {
            // Redirect to the desired page
            window.location.href = "create.html"; // Replace 'newPage.html' with your desired URL
        });
    }
    
})();