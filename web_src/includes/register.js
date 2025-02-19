
(function () {
    "use strict";

    //const BASE_URL = "https://etown-course-planner.ue.r.appspot.com"; //"http://localhost:8080";

    window.addEventListener("load", init);

    function init() {
        populateDropdown('advisor', 'name');
        id('register').addEventListener('click', register);
        id("min-yes").addEventListener("click", addMinor);
    }

    /**
     * Creates options for drop down menus using advisors API
     * @param {string} id - element ID
     * @param {string} fieldName - element name
     */
    function populateDropdown(id, fieldName) {
        const url = "/advisors";
        fetch(url)
        .then(res => {
            if(!res.ok) throw new Error('Response not ok');
            return res.json();
        })
        .then(data => {
            const dropdown = document.getElementById(id);
            data.forEach(element => {
                console.log(element);
                const option = document.createElement('option');
                option.value = element.id;
                option.text = element[fieldName];
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function addMinor() {
        if (id("min-yes").checked) {
            id('minor-sect').classList.remove("hidden");
            id('minor-advisor-sect').classList.remove("hidden");
        } else {
            id('minor-sect').classList.add("hidden");
            id('minor-advisor-sect').classList.add("hidden");
        }
    }

    /**
     * Fetches register API and prepares student info for client-side
     */
    function register() {
        const url = "/register";
        let params = new FormData();
        params.append("username", id("name").value);
        params.append("email", id("email").value);
        params.append("major", id("major").value);
        params.append("advisor", id("advisor").value);
        params.append("password", id("password").value);
        console.log(id("minor").value);
        if (id("minor").value != null) {
            params.append("minor", id("minor").value);
            params.append("min_advisor", id("min_advisor").value);
        }

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