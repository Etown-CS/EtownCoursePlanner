"use strict";

(function () {
    window.addEventListener("load", init);
    function init () {
        const email = window.sessionStorage.getItem('email');

        if (email) {
            id('email').textContent = email;
            id("body").classList.remove("hidden");
        } else {
            alert("Not currently logged in, try again.");
            location.assign("login.html");
        }

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