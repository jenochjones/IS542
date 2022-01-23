"use strict";

function ready(readyListener) {
    if (document.readyState !== "loading") {
        readyListener();
    } else {
        document.addEventListener("DOMContentLoaded", readyListener);
    }
}

ready(function () {
    MAP_PACKAGE.setUpMap(() => {
        console.log("Map Created");
    });
});
