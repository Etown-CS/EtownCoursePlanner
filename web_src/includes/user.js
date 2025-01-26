"use strict";

(function () {
    window.addEventListener("load", init);
    function init () {
        const email = window.sessionStorage.getItem('email');
        const name = window.sessionStorage.getItem('name');
        const major = window.sessionStorage.getItem('major');
        const advisor = window.sessionStorage.getItem('advisor');

        if (email) {
            id('email').textContent = email;
            id("body").classList.remove("hidden");
            populateFields(email, name, major, advisor);
        } else {
            alert("Not currently logged in, try again.");
            location.assign("login.html");
        }

    }

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