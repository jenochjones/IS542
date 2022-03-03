import {changeHash, nextChapter, prvChapter} from "./navigationPackage.js";
import {setAnimationType} from "./animationPackage.js";

$("#navigator").on("click", ".all-buttons", function () {
    setAnimationType("slideDown");
    changeHash(this.dataset.hash);
});

$(".upper").click(function () {
    setAnimationType("slideUp");
    changeHash(this.dataset.hash);
});

$("#next-btn").click(function () {
    setAnimationType("slideRight");
    nextChapter();
});

$("#prev-btn").click(function () {
    setAnimationType("slideLeft");
    prvChapter();
});

