// HW2 - Enoch Jones - IS 542 - Jan 5, 2022
// To see the web interface visit https://jenochjones.github.io/IS542/hw2.html

// Function to find the ith fibonacci number given i
function fibonacciNumbers() {
  let i = parseInt(document.getElementById('fib-input').value);
  let numOne = 0;
  let numTwo = 1;
  let numThree = 1;
  for (let r = 0; r < i; r++) {
    if(r !== 0) {
      numThree = numOne + numTwo;
      numOne = numTwo;
      numTwo = numThree;
    }
  }
  document.getElementById('fib-answer').innerText = numThree.toString();
}

// Function to find the ith factorial given i
function factorials() {
  let i = parseInt(document.getElementById('fac-input').value);
  let v = i - 1;
  let fac = i;
  if (i === 0) {
    fac = 1;
  } else {
    for (let r = 0; r < v; r++) {
      i -= 1;
      fac *= i;
    }
  }
  document.getElementById('fac-answer').innerText = fac.toString();
}

// Function to find the sum of all the numbers between two numbers
function findSums() {
  let sumOne = parseInt(document.getElementById('sum-one').value);
  let sumTwo = parseInt(document.getElementById('sum-two').value);
  let sumTotal = 0;
  for (sumOne; sumOne < sumTwo + 1; sumOne++) {
    sumTotal += sumOne;
  }
  document.getElementById('sum-answer').innerText = sumTotal.toString();
}

// Function to give the coins needed to equal a given number of cents
function numCoins() {
  let cents = parseInt(document.getElementById('cents-input').value);
  let quarters = Math.floor(cents / 25);
  cents -= quarters * 25;
  let dimes = Math.floor(cents / 10);
  cents -= dimes * 10;
  let nickels = Math.floor(cents / 5);
  cents -= nickels * 5;
  let allCents = ``;
  if(quarters !== 0) {
    if(quarters === 1) {
      allCents += `${quarters} quarter`;
    } else {
      allCents += `${quarters} quarters`;
    }
  }
  if(dimes !== 0) {
    if(dimes === 1) {
      allCents += ` ${dimes} dime`;
    } else {
      allCents += ` ${dimes} dimes`;
    }
  }
  if(nickels !== 0) {
    if(nickels === 1) {
      allCents += ` ${nickels} nickle`;
    } else {
      allCents += ` ${nickels} nickles`;
    }
  }
  if(cents !== 0) {
    if(cents === 1) {
      allCents += ` ${cents} penny`
    } else {
      allCents += ` ${cents} pennies`
    }
  }
  document.getElementById('cents-answer').innerText = allCents;
}
