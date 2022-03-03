import {createAllMarkers} from "./mapPackage.js";
import {animate} from "./animationPackage.js";

let htmlButton;
let getScripturesCallback;
let getScripturesFailure;

htmlButton = function (content, id, hash) {
    return `<button id="${id}" class="all-buttons button-round" data-hash="${hash}">${content}</button>`;
};

getScripturesCallback = function (chapterHTML) {
    animate(chapterHTML);
};

getScripturesFailure = function () {
    animate("<p>Sorry! God has gone fishing. Please try again later.</p>", "crossFade");
};

export {
    htmlButton,
    getScripturesCallback,
    getScripturesFailure
}
