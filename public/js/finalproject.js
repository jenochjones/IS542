let unitConv = 1.49;
let area = 50;
let n = 0.013;
let flow = 51.962;
let hydRad = 2.5;
let slope = 0.0001;

function ChangeUnits() {
  let unit = parseFloat(document.getElementById('units').value);
  if (unit === 1){
    unitConv = 1;
  } else {
    unitConv = 1.49;
  }
  console.log(unitConv)
}

function ChangeWSESlider() {
  let val = parseFloat(document.getElementById('wse-slider').value);
  document.getElementById('wse-text').value = val;

  solveForWhich();
}

function ChangeWSEText() {
  let val = parseFloat(document.getElementById('wse-text').value);
  document.getElementById('wse-slider').value = val;

  solveForWhich()
}

function setWSE(val) {
  document.getElementById('wse-slider').value = val;
  document.getElementById('wse-text').value = val;
  solveForWhich();
}

function ChangeNSlider() {
  let val = parseFloat(document.getElementById('n-slider').value);
  document.getElementById('n-text').value = val;
  n = val;
  solveForWhich();
}

function ChangeNText() {
  let val = parseFloat(document.getElementById('n-text').value);
  document.getElementById('n-slider').value = val;
  n = val;
  solveForWhich();
}

function setN(val) {
  document.getElementById('n-slider').value = val;
  document.getElementById('n-text').value = val;
}

function ChangeFlowSlider() {
  let val = parseFloat(document.getElementById('flow-slider').value);
  document.getElementById('flow-text').value = val;
  flow = val;
  solveForWhich();
}

function ChangeFlowText() {
  let val = parseFloat(document.getElementById('flow-text').value);
  document.getElementById('flow-slider').value = val;
  flow = val;
  solveForWhich();
}

function setFlow(val) {
  document.getElementById('flow-slider').value = val;
  document.getElementById('flow-text').value = val;
}

function ChangeSlopeSlider() {
  let val = parseFloat(document.getElementById('slope-slider').value);
  document.getElementById('slope-text').value = val;
  slope = val;
  solveForWhich();
}

function ChangeSlopeText() {
  let val = parseFloat(document.getElementById('slope-text').value);
  document.getElementById('slope-slider').value = val;
  slope = val;
  solveForWhich();
}

function setSlope(val) {
  document.getElementById('slope-slider').value = val;
  document.getElementById('slope-text').value = val;
}

function solveForWhich() {
  let solveFor = document.getElementById('solve-sel').value;
  if (solveFor === "wse") {
    solveForWSE();
  } else if (solveFor === "n") {
    solveForN();
  } else if (solveFor === "flow") {
    solveForFlow();
  } else if (solveFor === "slope") {
    solveForSlope();
  }
}

///////////////////////Solve//////////////////////////////////////////////
function solveForWSE() {
  wse = (unitConv / n) * area * Math.pow(hydRad, 2 / 3) * Math.pow(slope, 1 / 2);
  setFlow(flow);
}

function solveForFlow() {
  debugger
  flow = (unitConv / n) * area * Math.pow(hydRad, 2/3) * Math.pow(slope, 1/2);
  setFlow(flow);
}

function solveForN() {
  n = (unitConv / flow) * area * Math.pow(hydRad, 2/3) * Math.pow(slope, 1/2);
  setN(n);
}

function solveForSlope() {
  slope = Math.pow(flow / ((unitConv / n) * area * Math.pow(hydRad, 2/3)),2);
  setSlope(slope);
}

