
(function () {
    "use strict";

    const BASE_URL = "http://localhost:8080";

    window.addEventListener("load", init);

    function init() {
        populateDropdown('advisor', 'name', BASE_URL);
        id('register').addEventListener('click', register);
    }

    function populateDropdown(id, fieldName, base_url) {
        const url = base_url + "/advisors";
        fetch(url)
        .then(res => {
            if(!res.ok) throw new Error('Response not ok');
            return res.json();
        })
        .then(data => {
            const dropdown = document.getElementById(id);
            data.forEach(element => {
                const option = document.createElement('option');
                option.value = element[fieldName];
                option.text = element[fieldName];
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function register() {
        const url = BASE_URL + "/register";
        let params = new FormData();
        params.append("username", id("name").value);
        params.append("email", id("email").value);
        params.append("major", id("major").value);
        // params.append("advisor", id("advisor").value);
        params.append("password", id("password").value);

        let pwd = id('password').value;
        let vpwd = id('confirm_password').value;

        if (pwd != vpwd) {
            id('message').textContent = "Passwords do not match. Try again."
            return;
        }

        const options = {method: "POST", body: params};

        fetch(url, options)
        .then(checkStatus)
        .then((data) => {
            id('message').textContent = data['message'];
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