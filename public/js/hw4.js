// HW4 - Enoch Jones - IS 542 - Jan 11, 2022
// To see the web interface visit https://jenochjones.github.io/IS542/hw3.html

/* This was a fun project. The encapsulation method was new to me. I have seen it used before, but never
 * understood it. Most of the functions were quite straight forward. However, I don't really understand
 * how to make a public variable that updates as the private variable changes. I am not sure if I did exactly
 * what was specified in the assignment, but I did the best I could. It seems to work and I am satisfied with the
 * results. */

"use strict";

const checkForm = (function (){
  let string = runAllChecks();
  function runAllChecks () {
    return {
      name: "",
      emails: "",
      password: "",
      passwordVal: "",
      range: "",
      textRange:"",
      isNonEmpty: function (text, form) {
        if (text === "") {
          checkForm.name = `The ${form} field cannot be blank`;
        } else {
          checkForm.name = "";
        }
        document.getElementById("validate-div").innerText = checkForm.name;
        return checkForm.name;
      },
      isValidEmail: function (email) {
        email.toLowerCase();
        if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          checkForm.emails = "";
        } else {
          checkForm.emails = "Please enter a valid email";
        }
        document.getElementById("validate-div").innerText = checkForm.emails;
        return checkForm.emails;
      },
      matchesRegex: function (text, reg) {
        if (text.match(RegExp(reg))) {
          checkForm.password = "";
        } else {
          checkForm.password = "Please enter a valid password";
        }
        document.getElementById("validate-div").innerText = checkForm.password;
        return checkForm.password;
      },
      matchesString: function (textOne, textTwo) {
        if (textOne === textTwo) {
          checkForm.passwordVal = "";
        } else {
          checkForm.passwordVal = "Passwords do not match";
        }
        document.getElementById("validate-div").innerText = checkForm.passwordVal;
        return checkForm.passwordVal;
      },
      lengthIsInRange: function (text, m = 0, n = 10) {
        if (text.length > m && text.length < n) {
          checkForm.textRange = "Your comment is too long";
        } else {
          checkForm.textRange = "";
        }
        document.getElementById("validate-div").innerText = checkForm.textRange;
        return checkForm.textRange;
      },
      isInRange: function (text, m = 20, n = 56) {
        if (isNaN(text)) {
          checkForm.range = "";
        } else if ( m >= parseFloat(text) || n <= parseFloat(text)) {
          checkForm.range = "Please enter a value between 20 and 56";
        }
        document.getElementById("validate-div").innerText = checkForm.range;
        return checkForm.range;
      },
    }
  }
  return string;
}());

function submitButton() {
  const name = document.getElementById("form-name").value;
  const email = document.getElementById("form-email").value;
  const password = document.getElementById("form-pass").value;
  const password2 = document.getElementById("form-pass2").value;
  const comment = document.getElementById("form-com").value;
  const quant = document.getElementById("form-quant").value;
  let string = "";
  string += checkForm.isNonEmpty(name, 'name');
  string += checkForm.isNonEmpty(email, 'email');
  string += checkForm.isNonEmpty(password, 'password');
  string += checkForm.isNonEmpty(password2, 're-enter password');
  string += checkForm.isNonEmpty(comment, 'comment');
  string += checkForm.isNonEmpty(quant, 'quantity');
  string += checkForm.isValidEmail(email);
  string += checkForm.matchesRegex(password);
  string += checkForm.matchesString(password2);
  string += checkForm.lengthIsInRange(comment);
  string += checkForm.isInRange(quant);
  document.getElementById("validate-div").innerText = string;
}

function showInfo() {
  document.getElementById("info-div").style.display = "flex";
}

function hideInfo() {
  document.getElementById("info-div").style.display = "none";
}