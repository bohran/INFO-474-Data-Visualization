
'use strict';

(function() {

  let data = "no data";
  let dataEveryYear = "no data";
  let svgContainer = ""; // keep SVG reference in global scope
  let startYear = '1960' // default year (from Tableau chart)

  // load data and make scatter plot after window loads
  window.onload = function() {
    svgContainer = d3.select('body')
      .append('svg')
      .attr('width', 900) 
      .attr('height', 600); 

    d3.csv("dataEveryYear.csv")
      .then((csvData) => {
        data = csvData
        dataEveryYear = csvData;
        
        // Drop-down to filter by year
        var dropDown = d3.select('body')
          .append('select')
          .on('change', function() {
            makeScatterPlot(this.value);
          });

          // Set of years 
        let years = [...new Set(dataEveryYear.map((row) => row["time"]))]
        
        // Options for the drop-down (default to 1977)
        var dropDownOptions = dropDown.selectAll('option')
          .data(years)
          .enter()
            .append('option')
            .text((d) => { return d; })
            .property("selected", function(d){ return d === startYear; }); 

        makeScatterPlot(startYear);
      });
  }

  // make scatter plot with trend line
  function makeScatterPlot(year) {
    selectYear(year);
    svgContainer.html("");

    let fertility_rate_data = data.map((row) => parseFloat(row["fertility_rate"]));
    let life_expectancy_data = data.map((row) => parseFloat(row["life_expectancy"]));

    // find data limits
    let axesLimits = findMinMax(fertility_rate_data, life_expectancy_data);

    // draw axes and return scaling + mapping functions
    let mapFunctions = drawAxes(axesLimits, "fertility_rate", "life_expectancy");

    // plot data as points and add tooltip functionality
    plotData(mapFunctions);

    // draw title and axes labels
    makeLabels(year);
  }

  function selectYear(year) {
    data = dataEveryYear.filter((row) => row['time'] == year);
  }

  // make title and axes labels
  function makeLabels(year) {
    svgContainer.append('text')
      .attr('x', 250)
      .attr('y', 30)
      .style('font-size', '16pt')
      .text("World Life Expectency and Fertility Through Time");

      svgContainer.append('text')
      .attr('x', 450)
      .attr('y', 590)
      .style('font-size', '10pt')
      .text('Fertility Rates');

      svgContainer.append('text')
      .attr('transform', 'translate(20, 315)rotate(-90)')
      .style('font-size', '10pt')
      .text('Life Expectancy');
  }

  // plot all the data points on the SVG
  // and add tooltip functionality
  function plotData(map) {
    // get population data as array
    let pop_data = data.map((row) => +row["pop_mlns"]);
    let pop_limits = d3.extent(pop_data);
    // make size scaling function for population
    let pop_map_func = d3.scaleLinear()
      .domain([pop_limits[0], pop_limits[1]])
      .range([3, 20]);

    // mapping functions
    let xMap = map.x;
    let yMap = map.y;

    // make tooltip
    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // append data to SVG and plot as points
    svgContainer.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
        .attr('cx', xMap)
        .attr('cy', yMap)
        .attr('r', (d) => pop_map_func(d["pop_mlns"]))
        .attr('fill', "#4286f4")
        .style("opacity", 1) 
        // add tooltip functionality to points
        .on("mouseover", (d) => {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html('<br>' + 
              'Country:         ' + d.location + '<br/>' + 
              'Year:            ' + d.time + '<br/>' + 
              'Fertility Rate:  ' + d.fertility_rate + '<br/>' + 
              'Life Expectancy: ' + d.life_expectancy + '<br/>' + 
              'Population:      ' + numberWithCommas(d["pop_mlns"]*1000000) + 
              '</br>'
            )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
  }
    // draw the axes and ticks
    function drawAxes(limits, x, y) {
      // return x value from a row of data
      let xValue = function(d) { return +d[x]; }
  
      // function to scale x value
      let xScale = d3.scaleLinear()
        .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
        .range([50, 850]);
  
      // xMap returns a scaled x value from a row of data
      let xMap = function(d) { return xScale(xValue(d)); };
  
      // plot x-axis at bottom of SVG
      let xAxis = d3.axisBottom().scale(xScale);
      svgContainer.append("g")
        .attr('transform', 'translate(0, 550)')
        .call(xAxis);
  
      // return y value from a row of data
      let yValue = function(d) { return +d[y]}
  
      // function to scale y
      let yScale = d3.scaleLinear()
        .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
        .range([50, 550]);
  
      // yMap returns a scaled y value from a row of data
      let yMap = function (d) { return yScale(yValue(d)); };
  
      // plot y-axis at the left of SVG
      let yAxis = d3.axisLeft().scale(yScale);
      svgContainer.append('g')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);
  
      // return mapping and scaling functions
      return {
        x: xMap,
        y: yMap,
        xScale: xScale,
        yScale: yScale
      };
    }
  

  // find min and max for arrays of x and y
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

  // format numbers
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

})();
