import {createAllMarkers} from "./mapPackage.js";

let animate;
let crossFade;
let setAnimationType;
let slideDown;
let slideLeft;
let slideRight;
let slideUp;

let animationType = "crossFade";

animate = function (htmlString) {
    if (animationType === "slideRight") {
        slideRight(htmlString);
    } else if (animationType === "slideLeft") {
        slideLeft(htmlString);
    } else if (animationType === "slideDown") {
        slideDown(htmlString);
    } else if (animationType === "slideUp") {
        slideUp(htmlString);
    } else {
        crossFade(htmlString);
    }
};

crossFade = function (htmlString) {
    $("#navigator").stop(true).fadeOut(300, function () {
        $("#navigator").html(htmlString);
        createAllMarkers();
    });
    $("#navigator").fadeIn(300).scrollTop(0);
};

setAnimationType = function (typeOfAnimation) {
    animationType = typeOfAnimation;
};

slideDown = function (htmlString) {
    $("#upper-navigator").html(htmlString);
    $("#upper-navigator").css("top", "-110%");
    $(".slide-up").animate({top: '+=110%'}, {
        duration: 800,
        easing: "swing",
        complete: function () {
            $("#navigator").html(htmlString);
            $("#navigator").css("top", "0").scrollTop(0);
            $("#upper-navigator").css("top", "-110%");
            createAllMarkers();
        }
    });
};

slideLeft = function (htmlString) {
    $("#side-navigator").html(htmlString);
    $("#side-navigator").css("left", "-110%");
    $(".slide-side").animate({left: '+=110%'}, {
        duration: 800,
        easing: "swing",
        complete: function () {
            $("#navigator").html(htmlString);
            $("#navigator").css("left", "0").scrollTop(0);
            $("#side-navigator").css("left", "-110%");
            createAllMarkers();
        }
    });
};

slideRight = function (htmlString) {
    $("#side-navigator").html(htmlString);
    $("#side-navigator").css("left", "110%");
    $(".slide-side").animate({left: '-=110%'}, {
        duration: 800,
        easing: "swing",
        complete: function () {
            $("#navigator").html(htmlString);
            $("#navigator").css("left", "0").scrollTop(0);
            $("#side-navigator").css("left", "110%");
            createAllMarkers();
        }
    });
};

slideUp = function (htmlString) {
    $("#upper-navigator").html(htmlString);
    $("#upper-navigator").css("top", "110%");
    $(".slide-up").animate({top: '-=110%'}, {
        duration: 800,
        easing: "swing",
        complete: function () {
            $("#navigator").html(htmlString);
            $("#navigator").css("top", "0").scrollTop(0);
            $("#upper-navigator").css("top", "100%");
            createAllMarkers();
        }
    });
};

export {
    animate,
    setAnimationType
}