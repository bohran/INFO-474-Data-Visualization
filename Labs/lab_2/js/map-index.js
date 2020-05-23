(function() {

    var context = "";
  
    // wait until window loads to execute code
    window.onload = function() {
      let canvas = document.getElementById('myCanvas');
      context = canvas.getContext("2d");
      drawMap();
    //   fetch("data/admission_predict.json")
    //     .then(res => res.json())
    //     .then(data => makeScatterPlot(data));
    }
  
    // make a scater plot of the data with the given function
    function drawMap(){
        base_image = new Image();
        base_image.src = 'data/USMap.JPG';
        base_image.onload = function(){
            context.drawImage(base_image, 0,0);
        }
    }


// (function() {

//     var context = "";
  
//     // wait until window loads to execute code
//     window.onload = function() {
//         let canvas = document.getElementById('myCanvas');
//         context = canvas.getContext("2d");      
//         drawMap();  
//         }
//     //   fetch("data/1000-largest-us-cities-by-population-with-coordinates.json")
//         // .then(res => res.json())
//         // .then(data => drawMap(data));
//     function drawMap(){
//         base_image = new Image();
//         base_image.src = 'data/USMap.JPG';
//         base_image.onload = function(){
//             context.drawImage(base_image, 0,0);
//         }
//     }
  
})();