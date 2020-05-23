// Source: https://www.d3-graph-gallery.com/graph/histogram_basic.html

"use strict";

(function() {
  let data = ""; // keep data in global scope
  let svgContainer = ""; // keep SVG reference in global scope
  let rectangle = "";
  // load data and make scatter plot after window loads
  window.onload = function() {
    d3.csv("data/Admission_Predict.csv").then(data => makeHistogram(data));
  };
  // make scatter plot with trend line
  function makeHistogram(csvData) {
    data = csvData;

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 70, bottom: 50, left: 70 },
      width = 760 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis: scale and draw:
    var x = d3
      .scaleLinear()
      .domain([
        d3.min(data, function(d) {return +d["TOEFL Score"];}),
        d3.max(data, function(d) {return +d["TOEFL Score"];})
      ]) 
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3
      .histogram()
      .value(function(d) {
        return d["TOEFL Score"];
      }) 
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(10)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear().range([height, 0]);
    y.domain([0, d3.max(bins, function(d) {return d.length;})]); 
    svg.append("g").call(d3.axisLeft(y));

    // X axis label
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", width - 300)
      .attr("y", height + 40)
      .style("font-size", 14)
      .text("TOEFL Score (bin)");

    // Y axis label
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -100)
      .attr("y", -50)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .style("font-size", 14)
      .text("Count of TOEFL Score");

    // append the bar rectangles to the svg element
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function(d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function(d) {
        return height - y(d.length);
      })
      .style("fill", "#0D49A4");
  }
})();
