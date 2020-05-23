'use strict';

(function() {

    let data = "";
    let svgContainer = "";

  window.onload = function() {
//     var data = [2, 4, 8, 10]; 
//     var svg = d3.select("body").append("svg") 
//                 .attr("width", 200)    
//                 .attr("height", 200),        
//         width = svg.attr("width"),        
//         height = svg.attr("height"),        
    
//         radius = Math.min(width, height) / 2,       
//         g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");    
//     var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);    
    
//     // Generate the pie   
//     var pie = d3.pie();

//     var arc = d3.arc()
//         .innerRadius(0)                
//         .outerRadius(radius);    
//         //Generate groups    
//         var arcs = g.selectAll("arc")                
//         .data(pie(data))                
//         .enter()                
//         .append("g")                
//         .attr("class", "arc")
//     //Draw arc paths   
//     arcs.append("path")        
//     .attr("fill", function(d, i) {
//             return color(i);        
//         })        
//     .attr("d", arc);
  //}
  svgContainer.append("svg:image")
    .attr('x', -9)
    .attr('y', -12)
    .attr('width', 20)
    .attr('height', 24)
    .attr("xlink:href", "resources/images/check.png")
}
  
})();