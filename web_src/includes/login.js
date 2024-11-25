
(function () {
    "use strict";

    const BASE_URL = "http://localhost:8080";

    window.addEventListener("load", init);

    function init() {
        id('login').addEventListener('click', login);
    }

    /**
     * Fetch login API and prepares info for client-side
     */
    function login () {
        const url = BASE_URL + "/login";
        let params = new FormData();
        let email = id('email').value;

        params.append("email", email);
        params.append("password", id("pwd").value);

        const options = {method: "POST", body: params};

        fetch(url, options)
        .then(checkStatus)
        .then((data) => {
            if (data.message == "Login successful!") {
                // Save user email
                window.sessionStorage.setItem('email', email);
                console.log(email);

                // Redirect user to the logged in homepage
                location.assign('../loggedin.html');
            } else {
                id('message').textContent = data['message'];
            }
        });
    }
})();

// Helper functions

/**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} id - element ID
 * @returns {object} DOM object associated with id.
 */
function id(idName) {
    return document.getElementById(idName);
}

/**
 * This function checks the response and returns it in JSON.
 * @returns {} response
 */
function checkStatus(response) {
    if (!response.ok) {
        console.log("Error in request: " + response.statusText);
    }
    return response.json();
}