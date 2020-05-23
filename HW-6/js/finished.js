(function() {

  let allYearsData = ""
  let svgLine = "";
  let svgScatter = ""
  let dropBox = "";
  let div = "";
  let defaultVal = "AUS";

  window.onload = function() {
    
    d3.csv("data/dataEveryYear.csv")
      .then((data) => {
        dropDown(data);
        makeLineGraph(data);
        makeScatterPlot(data);
      });
    dropBox = d3.select("body").append("select")
      .attr("name", "country")
      .on("change", onChange);

    div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svgLine = d3.select("body")
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);

    svgScatter = d3.select("div")
      .append('svg')
      .attr('width', 300)
      .attr('height', 300)
  }

  function countrySelection(value, index, self) { 
    return self.indexOf(value) === index;
  }

  function dropDown(data) {

    let countries = (data.map((row) => row["location"]))

    countries = countries.filter(countrySelection);

    let options = dropBox.selectAll("option")
    .data(countries)
    .enter()
      .append("option");
    options.text((d) => {
          return d;
      })
      .attr("value", (d) => {
        return d;
      });
  }

  function onChange() {
    defaultVal = dropBox.property("value")
    lineGraphFunc();
  }

  function makeLineGraph(data) {
    allYearsData = data
    lineGraphFunc();
  }

  function lineGraphFunc() {
    svgLine.html("");
    let data = allYearsData.filter((row) => row["location"] == defaultVal)
    let time_data = data.map((row) => +row["time"]);
    let populationSize = data.map((row) => +row["pop_mlns"]);

    // find data limits
    let minMaxData = findMinMax(time_data, populationSize);

    // draw axes and return scaling + mapping functions
    let mapFunctions = drawAxes(minMaxData, "time", "pop_mlns", svgLine, 500);

    plotLineGraph(mapFunctions, data, svgLine);
    labels = ["Population by Years per Country", "Years", "Population (millions)"]
    tooltipPopup = [14, 10, 100, 40, 230, 490, 'translate(15, 300)rotate(-90)']
    makeLabels(svgLine, labels, tooltipPopup);
  }

  function plotLineGraph(mapFunctions, inputData, svgContainer) {
    let line = d3.line()
      .x((d) => mapFunctions.x(d))
      .y((d) =>mapFunctions.y(d));
    svgContainer.append("path")
      .datum(inputData)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      //adding tooltip
      .on("mouseover", (d) => {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", (d) => {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
  }

  function makeScatterPlot(data) {
    let fertility_rate_data = data.map((row) => parseInt(row.fertility_rate));
    let life_expectancy_data = data.map((row) => parseInt(row.life_expectancy));

    let newMinMaxData = findMinMax(fertility_rate_data, life_expectancy_data);

    let scaleAndMapFuncs = drawAxes(newMinMaxData, "fertility_rate", "life_expectancy", svgScatter, 300);

    plotData(scaleAndMapFuncs, svgScatter);
    labels = ["Countries by Life Expectancy and Fertility Rate", "Fertility Rates (Avg Children per Woman)", 'Life Expectancy (years)']
    tooltipPopup = [10, 7, 10, 20, 60, 295, 'translate(7, 200)rotate(-90)']

    makeLabels(svgScatter, labels, tooltipPopup);
  }

  function findMinMax(x, y) {

    // get min/max x values
    let xMin = d3.min(x);
    let xMax = d3.max(x);

    // get min/max y values
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    // return formatted min/max data as an object
    return {
      xMin : xMin,
      xMax : xMax,
      yMin : yMin,
      yMax : yMax
    }
  }

  // draw the axes and ticks
  function drawAxes(limits, x, y, svgContainer, size) {
    // return x value from a row of data
    let xValue = function(d) { return +d[x]; }
    let xScale = "";
    if(size == 300) {
      xScale = d3.scaleLinear()
        .domain([limits.xMin - 0.5, limits.xMax + 1]) // give domain buffer room
        .range([size * 0.1, size * 0.9]);
    } else {
      xScale = d3.scaleLinear()
        .domain([limits.xMin, limits.xMax]) // give domain buffer room
        .range([size * 0.1, size * 0.9]);
    }
    // xMap returns a scaled x value from a row of data
    let xMap = function(d) { return xScale(xValue(d)); };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer.append("g")
      .attr('transform', 'translate(0, ' + size * .9 + ')')
      .call(xAxis)
        d3.tickFormat(d3.format("d"));

    // return y value from a row of data
    let yValue = function(d) { return +d[y]}

    // function to scale y
    let yScale = d3.scaleLinear()
      .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
      .range([size *0.1, size * 0.9]);

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) { return yScale(yValue(d)); };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
      .attr('transform', 'translate(' + size * 0.1 + ', 0)')
      .call(yAxis);

    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  function plotData(mapFunctions, svgContainer) {
    let popData = allYearsData.map((row) => +row["pop_mlns"]);
    let popMinMax = d3.extent(popData);

    let pop_map_func = d3.scaleLinear()
      .domain([popMinMax[0], popMinMax[1]])
      .range([3, 10]);

    let xMap = mapFunctions.x;
    let yMap = mapFunctions.y;


    dots = svgContainer.selectAll(".dot")
      .data(allYearsData)
      .enter()
      .append("circle")
        .attr("class", (d) => d.time)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("r", (d) =>   pop_map_func(d["pop_mlns"]))
        .attr("fill", "steelblue")
  }


  function makeLabels(svgContainer, labels) {
    svgContainer.append('text')
      .attr('x', 14)
      .attr('y', 10)
      .style('font-size', 10 + 'pt')
      .text(labels[0]);
    svgContainer.append('text')
      .attr('x', 40)
      .attr('y', 490)
      .style('font-size', 10 + 'pt')
      .text(labels[1]);

    svgContainer.append('text')
      .attr('transform', 'translate(15, 300)rotate(-90)')
      .style('font-size', 10 + 'pt')
      .text(labels[2]);
  }
})();
