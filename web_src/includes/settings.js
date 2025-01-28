"use strict";
(function () {
    window.addEventListener("load", init);

    function init() {
        id("on_campus").addEventListener("click", classType);
        id("transfer").addEventListener("click", classType);
    }

    function classType() {
        if (id("on_campus").checked) {
            id('oc-class-add').classList.remove("hidden");
            id('transfer-class-add').classList.add("hidden");
        } else {
            id('transfer-class-add').classList.remove("hidden");
            id('oc-class-add').classList.add("hidden");
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