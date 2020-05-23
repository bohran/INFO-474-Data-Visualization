// Source: https://www.d3-graph-gallery.com/graph/histogram_basic.html
//https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4

"use strict";

(function() {
  let data = ""; // keep data in global scope
  let svgContainer = ""; // keep SVG reference in global scope
  let rectangle = "";

  // load data and make scatter plot after window loads
  window.onload = function() {
    d3.csv("data/season_data.csv").then(data => makeHistogram(data));
  };
  // make scatter plot with trend line
  function makeHistogram(csvData) {
    data = csvData;
    let avg = d3.mean(data, function(d) {
      return +d["Avg. Viewers (mil)"];
    });
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 70, bottom: 50, left: 70 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // X axis: scale and draw:
    var x = d3
      .scaleLinear()
      .domain([
        d3.min(data, function(d) {
          return +d["Year"];
        }),
        d3.max(data, function(d) {
          return +d["Year"];
        })
      ])
      .range([0, width + 50]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom()
          .scale(x)
          .tickFormat(d3.format("d"))
          .ticks(20)
      );

    var y = d3
      .scaleLinear()
      .domain([
        d3.min(data, function(d) {
          return +d["Avg. Viewers (mil)"];
        }),
        d3.max(data, function(d) {
          return +d["Avg. Viewers (mil)"];
        })
      ])
      .range([height - 25, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // X axis label
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", width - 100)
      .attr("y", height + 42)
      .style("font-size", 14)
      .text("Year");

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
      .text("Average Number of Viewers (mil)");

    // Legend for the visual
    svg
      .append("text")
      .attr("x", 700)
      .attr("y", 105)
      .text("Viewership Data")
      .style("font-size", "18px")
      .attr("alignment-baseline", "middle");
    svg
      .append("rect")
      .attr("x", 730)
      .attr("y", 130)
      .attr("width", 8)
      .attr("height", 8)
      .style("fill", "steelblue");
    svg
      .append("rect")
      .attr("x", 730)
      .attr("y", 160)
      .attr("width", 8)
      .attr("height", 8)
      .style("fill", "gray");
    svg
      .append("text")
      .attr("x", 750)
      .attr("y", 135)
      .text("Actual")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 750)
      .attr("y", 165)
      .text("Estimated")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    // append the bar rectangles to the svg element
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .on("mouseover", d => {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .html(
            "<h3>" +
              "Season #" +
              d["Year"] +
              "<h3>" +
              "<h4>" +
              "<br>" +
              "Year:         " +
              d["Year"] +
              "<br/>" +
              "Episodes:            " +
              d["Episodes"] +
              "<br/>" +
              "Avg Viewers (mil):  " +
              d["Avg. Viewers (mil)"] +
              "<br/>" +
              "Most Watched Episode: " +
              d["Most watched episode"] +
              "<br/>" +
              "Viewers (mil): " +
              d["Viewers (mil)"] +
              "<br/>" +
              "</br>" +
              "<h4>"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", d => {
        div
          .transition()
          .duration(500)
          .style("opacity", 0);
      })
      .attr("x", function(d) {
        return x(d["Year"]);
      })
      .attr("width", 25)
      .attr("y", function(d) {
        return y(d["Avg. Viewers (mil)"]);
      })
      .attr("height", function(d) {
        return height - y(d["Avg. Viewers (mil)"]);
      })
      .style("fill", "steelblue")
      .filter(function(d) {
        return d["Data"] == "Estimated";
      })
      .style("fill", "gray")
      .style("stroke", "white");

    svg
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        return x(d["Year"]) + 10;
      })
      .attr("y", function(d) {
        return y(d["Avg. Viewers (mil)"]) - 5;
      })
      .text(function(d) {
        return d["Avg. Viewers (mil)"];
      });

    svg
      .append("line")
      .style("stroke", "black")
      .attr("x1", 0)
      .attr("y1", d => y(avg))
      .attr("x2", 870)
      .attr("y2", d => y(avg))
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5");
    svg
      .append("text")
      .attr("x", 700)
      .attr("y", d => y(avg) - 4)
      .style("font-size", "8pt")
      .text("Average =  " + Math.round(avg * 10) / 10 + " mil");
  }
})();
