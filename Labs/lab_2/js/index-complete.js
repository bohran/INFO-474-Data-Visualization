(function() {

  var context = "";

  // wait until window loads to execute code
  window.onload = function() {
    let canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");
    fetch("data/admission_predict.json")
      .then(res => res.json())
      .then(data => makeScatterPlot(data));
  }

  // make a scater plot of the data with the given function
  function makeScatterPlot(data) {
    drawAxesLines(); // draw axes
    let axesLimits = findMinMax(data);
    drawAxesTicks(axesLimits);
    for (let i = 0; i < 400; i++) {
      plotCanvasPoint(data[i]);
    }
    /* Cool Points Animation!!!
    for (let i = 0; i < 400; i++) {
      setTimeout(() => {
        plotCanvasPoint(data[i]);
      }, i * 50)
    }
    */
  }

  function drawAxesLines() {
    line(50, 50, 50, 450);
    line(50, 450, 450, 450);
  }

  // find the min and max for each axis
  // returns an object with x and y axes min/max
  function findMinMax(data) {
    let greScores = data.map((row) => parseInt(row["GRE Score"]));
    let admissionRates = data.map((row) => parseFloat(row["Chance of Admit"]));

    // get x-axis min and max
    let xMax = Math.max.apply(Math, greScores);
    let xMin = Math.min.apply(Math, greScores);

    // round x-axis limits
    xMax = Math.round(xMax*10)/10;
    xMin = Math.round(xMin*10)/10;

    // get y-axis min and max
    let yMax = Math.max.apply(Math, admissionRates);
    let yMin = Math.min.apply(Math, admissionRates);

    // round y-axis limits to nearest 0.05
    yMax = Number((Math.ceil(yMax*20)/20).toFixed(2));
    yMin = Number((Math.ceil(yMin*20)/20).toFixed(2));

    // format axes limits and return it
    let allMaxsAndMins = {
      xMax : xMax,
      xMin : xMin,
      yMax : yMax,
      yMin : yMin
    }
    return allMaxsAndMins;

  }

  // draw the axes ticks on both axes
  function drawAxesTicks(axesLimits) {

    // draw x-axis ticks
    let xMark = axesLimits.xMin; // start a counter with initial value xMin
    for (let x = 80; x < 400; x += 30) {
      // stop if counter is greater than x-axis max
      if (xMark > axesLimits.xMax) {
        break;
      }
      // draw the counter and label it
      line(x, 440, x, 460);
      context.fillText(xMark, x - 5, 470);
      // increment counter
      xMark += 5;
    }

    let yMark = axesLimits.yMin; // start a counter with initial value yMin
    for (let y = 425; y > 50; y -= 25) {
      yMark = Math.round(yMark*100)/100; // round counter to nearest hundredth
      // stop if counter is greater than y-axis max
      if (yMark > axesLimits.yMax) {
        break;
      }
      // draw the counter and label it
      line(40, y, 60, y);
      context.fillText(yMark, 15, y + 5);
      // increment counter
      yMark += 0.05;
    }
  }

  // plot a point at the given x and y coordinate
  function plotPoint(x, y) {
    context.beginPath();
    //context.arc(x, y, 5, 0, 2 * Math.PI, false); old arc
    context.arc(x, y, 3, 0, 2 * Math.PI, false); // made point area smaller
    //context.fillStyle = 'green'; old fill fillStyle
    context.fillStyle = '#4286f4'; // changed color to blue
    context.fill();
    //context.lineWidth = 5; old lineWidth
    context.lineWidth = 1; // made line width smaller
    context.strokeStyle = '#003300';
    context.stroke();
  }

  // draw a line starting from x1,y1 to x2,y2
  function line(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  // plot a json data point on the canvas
  function plotCanvasPoint(point) {
    let canvasPoint = toCanvasPoint(point); // scale data point to canvas point
    plotPoint(canvasPoint.x, canvasPoint.y);
  }

  // convert a data point to canvas coordinates
  function toCanvasPoint(point) {
    xCanvas = (point["GRE Score"] - 285)*6 + 50; // scale the x point
    yCanvas = 450 - (point["Chance of Admit"] - 0.3)*500; // scale the y point
    // return new x and y
    return {
      x: xCanvas,
      y: yCanvas
    }
  }
})();
