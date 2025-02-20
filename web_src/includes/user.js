"use strict";

(function () {
    window.addEventListener("load", init);
    function init () {
        // Pulling user's information from session storage.
        const email = window.sessionStorage.getItem('email');
        const name = window.sessionStorage.getItem('name');
        const major = window.sessionStorage.getItem('major');
        const advisor = window.sessionStorage.getItem('advisor');
        const minor = window.sessionStorage.getItem('minor');
        const min_advisor = window.sessionStorage.getItem('min_advisor_id');

        // Checking if email is initialized, otherwise you cannot view
        if (email) {
            id("body").classList.remove("hidden");

            if (id('email') != null) {
                id('email').textContent = email;
            }
            populateFields(email, name, major, advisor);
            if (minor != null) {
                id('account-minor').classList.remove("hidden");
                id('minor').textContent = minor;
                id('min-advisor').textContent = min_advisor;
            }
        } else {
            alert("Not currently logged in, try again.");
            location.assign("login.html");
        }

    }

    /**
     * Populates text fields with user info for account page
     * @param {*} email 
     * @param {*} name 
     * @param {*} major 
     * @param {*} advisor 
     */
    function populateFields(email, name, major, advisor) {
        id('user_email').textContent = email;
        id('name').textContent = name;
        id('major').textContent = major;
        id('advisor').textContent = advisor;
    }

        /*************** Helper Functions ****************/
    /**
     * Helper function to get element by id
     * @param {id} id 
     * @returns the element with the given id
     */
    function id(id) {
        return document.getElementById(id);
    }
})();