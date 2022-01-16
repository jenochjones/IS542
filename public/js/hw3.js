// HW3 - Enoch Jones - IS 542 - Jan 11, 2022
// To see the web interface visit https://jenochjones.github.io/IS542/hw3.html

/* This was a fun project. The encapsulation method was new to me. I have seen it used before, but never
 * understood it. Most of the functions were quite straight forward. However, I don't really understand
 * how to make a public variable that updates as the private variable changes. I am not sure if I did exactly
 * what was specified in the assignment, but I did the best I could. It seems to work and I am satisfied with the
 * results. */

"use strict";

const checkMyString = (function () {
  return {
    isNumeric: function (text) {
      return isNaN(text) || text === "" ? checkMyString.isValid = false : true;
    },
    isInteger: function (text) {
      return isNaN(text) ? false : parseFloat(text) % 1 === 0 ? true : checkMyString.isValid = false;
    },
    isNegativeInteger: function (text) {
      return isNaN(text) ? false : parseFloat(text) % 1 !== 0 ? checkMyString.isValid = false : parseFloat(text) < 0 ? true : checkMyString.isValid = false;
    },
    isPositiveInteger: function (text) {
      return isNaN(text) ? false : parseFloat(text) % 1 !== 0 ? checkMyString.isValid = false : parseFloat(text) > 0 ? true : checkMyString.isValid = false;
    },
    isNonNegativeInteger: function (text) {
      return isNaN(text) ? false : parseFloat(text) % 1 !== 0 ? checkMyString.isValid = false : parseFloat(text) >= 0 ? true : checkMyString.isValid = false;
    },
    isInRange: function (text, m = false, n = false) {
      if (isNaN(text)) {
        return false;
      } else if ( m !== false && n !== false) {
        return parseFloat(text) > m && parseFloat(text) < n ? true : checkMyString.isValid = false;
      } else if ( m !== false) {
        return parseFloat(text) > m ? true : checkMyString.isValid = false;
      } else if ( n !== false) {
        return parseFloat(text) < n ? true : checkMyString.isValid = false;
      } else {
        return checkMyString.isValid = false;
      }
    },
    isValidEmail: function (email) {
      email.toLowerCase();
      return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : checkMyString.isValid = false;
    },
    isNonEmpty: function (text) {
      return text === "" ? checkMyString.isValid = false : true;
    },
    matchesRegex: function (text, reg) {
      return text.match(RegExp(reg)) ? true : checkMyString.isValid = false;
    },
    lengthIsInRange: function (text, m = false, n = false) {
      if ( m !== false && n !== false) {
        return text.length > m && text.length < n ? true : checkMyString.isValid = false;
      } else if ( m !== false) {
        return text.length > m ? true : checkMyString.isValid = false;
      } else if ( n !== false) {
        return text.length < n ? true : checkMyString.isValid = false;
      } else {
        return checkMyString.isValid = false;
      }
    },
    isValid: true,
    reset: function () {
      checkMyString.isValid = true;
    },
  };
}());

function checkString() {
  let myString = document.getElementById("string-input").value;
  let checkfor = document.getElementById("select-check").value;
  let regExp = document.getElementById("reg-input").value;
  let m;
  let n;
  let answer;

  if (checkfor === "isNumeric") {
    checkMyString.isNumeric(myString);
  } else if (checkfor === "isInteger") {
    checkMyString.isInteger(myString);
  } else if (checkfor === "isNegativeInteger") {
    checkMyString.isNegativeInteger(myString);
  } else if (checkfor === "isPositiveInteger") {
    checkMyString.isPositiveInteger(myString);
  } else if (checkfor === "isNonNegInteger") {
    checkMyString.isNonNegativeInteger(myString);
  } else if (checkfor === "isInRange") {
    m = document.getElementById("first-num").value;
    n = document.getElementById("second-num").value;
    m = m === "" ? false : m;
    n = n === "" ? false : n;
    checkMyString.isInRange(myString, m, n);
  } else if (checkfor === "isValidEmail") {
    checkMyString.isValidEmail(myString);
  } else if (checkfor === "isNonEmpty") {
    checkMyString.isNonEmpty(myString);
  } else if (checkfor === "lengthIsInRange") {
    m = document.getElementById("first-num").value;
    n = document.getElementById("second-num").value;
    m = m === "" ? false : m;
    n = n === "" ? false : n;
    checkMyString.lengthIsInRange(myString, m, n);
  } else if (checkfor === "matchesRegex") {
    checkMyString.matchesRegex(myString, regExp);
  } else {
    console.log("Expression not found.")
  }
  isValid = checkMyString.isValid;
  if (isValid === true) {
    answer = 'That is true';
  } else if (isValid === false) {
    answer = 'That is false';
  } else {
    answer = 'Something went wrong';
  }
  document.getElementById("answer").innerText = answer;
}

function fixTable() {
  let checkfor = document.getElementById("select-check").value;
  let inputClass = document.getElementsByClassName('input-range');
  let rangeClass = document.getElementsByClassName('reg-exp');

  if (checkfor === "isInRange" || checkfor === "lengthIsInRange") {
    Object.keys(rangeClass).forEach(key =>  rangeClass[key].style.display = "none");
    Object.keys(inputClass).forEach(key =>  inputClass[key].style.display = "flex");
  } else if (checkfor === "matchesRegex") {
    Object.keys(inputClass).forEach(key =>  inputClass[key].style.display = "none");
    Object.keys(rangeClass).forEach(key =>  rangeClass[key].style.display = "flex");
  } else {
    Object.keys(inputClass).forEach(key =>  inputClass[key].style.display = "none");
    Object.keys(rangeClass).forEach(key =>  rangeClass[key].style.display = "none");
  }
}

let isValid = checkMyString.isValid;

