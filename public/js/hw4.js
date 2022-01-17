// HW4 - Enoch Jones - IS 542 - Jan 11, 2022
// To see the web interface visit https://jenochjones.github.io/IS542/hw4.html


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
          checkForm.name = `The ${form} field cannot be blank<br>`;
        } else {
          checkForm.name = "";
        }
        document.getElementById("validate-p").innerHTML = checkForm.name;
        return checkForm.name;
      },
      isValidEmail: function (email) {
        if (email === "") {
          return "";
        } else {
          email.toLowerCase();
          if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            checkForm.emails = "";
          } else {
            checkForm.emails = "Please enter a valid email<br>";
          }
          document.getElementById("validate-p").innerHTML = checkForm.emails;
          return checkForm.emails;
        }
      },
      matchesRegex: function (text, reg) {
        if (text === "") {
          return "";
        } else {
          if (text.match(RegExp(reg))) {
            checkForm.password = "";
          } else {
            checkForm.password = "Please enter a valid password<br>";
          }
          document.getElementById("validate-p").innerHTML = checkForm.password;
          return checkForm.password;
        }
      },
      matchesString: function (textOne, textTwo) {
        if (textOne === "") {
          return "";
        } else {
          if (textOne === textTwo) {
            checkForm.passwordVal = "";
          } else {
            checkForm.passwordVal = "Passwords do not match<br>";
          }
          document.getElementById("validate-p").innerHTML = checkForm.passwordVal;
          return checkForm.passwordVal;
        }
      },
      lengthIsInRange: function (text, m = 0, n = 10) {
        if (text.length >= m && text.length < n) {
          checkForm.textRange = "";
        } else {
          checkForm.textRange = "Your comment is too long<br>";
        }
        document.getElementById("validate-p").innerHTML = checkForm.textRange;
        return checkForm.textRange;
      },
      isInRange: function (text, m = 20, n = 56) {
        if (isNaN(text)) {
          checkForm.range = "Please enter an integer";
        } else if ( m <= parseFloat(text) && n >= parseFloat(text)) {
          checkForm.range = "";
        } else {
          checkForm.range = "Please enter a value between 20 and 56<br>";
        }
        document.getElementById("validate-p").innerHTML = checkForm.range;
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
  if (checkForm.isNonEmpty(name, 'name') !== "" || checkForm.isNonEmpty(email, 'email') !== "" || checkForm.isNonEmpty(password, 'password') !== "" ||
  checkForm.isNonEmpty(password2, 're-enter password') !== "" || checkForm.isNonEmpty(comment, 'comment') !== "" ||
  checkForm.isNonEmpty(quant, 'quantity') !== "") {
    string += "All fields must be filled<br>";
  };
  checkForm.isValidEmail(email) !== "" ? string += `${checkForm.isValidEmail(email)}<br>` : string += "";
  checkForm.matchesRegex(password) !== "" ? string += `${checkForm.matchesRegex(password)}<br>` : string += "";
  checkForm.matchesString(password2, password) !== "" ? string += `${checkForm.matchesString(password2)}<br>` : string += "";
  checkForm.lengthIsInRange(comment) !== "" ? string += `${checkForm.lengthIsInRange(comment)}<br>` : string += "";
  checkForm.isInRange(quant) !== "" ? string += `${checkForm.isInRange(quant)}<br>` : string += "";
  string += "";
  document.getElementById("validate-p").innerHTML = string;
}

function showInfo() {
  document.getElementById("info-div").style.display = "flex";
}

function hideInfo() {
  document.getElementById("info-div").style.display = "none";
}