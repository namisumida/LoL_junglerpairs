var svg_right = d3.select("#graphic-right-svg");
var rightMargin = { left: 10, right: 10, top: 50, bottom: 10 };
var w_svg_right = document.getElementById("graphic-right-svg").getBoundingClientRect().width;

// Dimensions for slope chart
var slopeMargin = { top: 40, bottom: 10, left: w_svg_right/6, width: w_svg_right, height: 450, lineWidth: w_svg_right/3 };

// Datasets
var dataset, champ_subset;
var currChampionName;
var rowConverter = function(d) {
  return {
    champ1: d.champ1,
    champ2: d.champ2,
    win: parseFloat(d.win),
    count: parseInt(d.count)
  }
};

// Scales
var yScale = d3.scaleLinear()
           .domain([0,1])
           .range([slopeMargin.height-slopeMargin.bottom, slopeMargin.top]);
// Dot scale: Uses champ_subset and updates the dotScale
var dotScale;
var updateDotScale = function() {
  dotScale = d3.scaleLinear()
               .domain([d3.min(champ_subset, function(d) { return d.count; }),
                        d3.max(champ_subset, function(d) { return d.count; })])
               .range([6,30]);
}; // end update dot scale function

// Function that creates a df with n pairs per 10 percent
var createSubset = function(champ, avg) {
  temp_subset = dataset.filter(function(d) { return d.champ1 == champ; }); // sets

  floorList = [];
  champ_subset = [];
  for (var i=0; i<temp_subset.length; i++) {
    var row = temp_subset[i];
    var winFloor = Math.floor(row.win*10) / 10
    if (!floorList.includes(winFloor)) { // if the output doesn't already have this range
      champ_subset.push({floor: winFloor, count:1});
      floorList.push(winFloor);
    }
    else {
      var floorIndex = floorList.indexOf(winFloor);
      champ_subset[floorIndex].count++;
    }
  }
}; // end count pairs per ten function

// Function to update champion
var updateChampion = function(champ) {
  currChampionName = champ;

  // Get new dataset
  createSubset(currChampionName);

  // update dot scale
  updateDotScale();
}; // end update champion function

// Colors
var green = d3.rgb(148,157,72);
var light_repred = d3.rgb(227,128,115);
var gray = d3.color("#a19da8");
var dark_gray = d3.rgb(100,100,100);
var dotColor = d3.color("#f6bba8");
var highlightColor = d3.rgb(79,39,79);





// Import data
d3.csv('data/jungler_pair_long.csv', rowConverter, function(data) {

   // Data
   dataset = data;
   // Slope chart group
   var slopeChart = svg_right.append("g")
                             .attr("id", "slopeChart")
                             .attr("transform", "translate(" + rightMargin.left + "," + slopeMargin.top + ")")
   // Draw line
   slopeChart.append("rect")
             .attr("class", "slopeLine")
             .attr("x", slopeMargin.left + slopeMargin.lineWidth)
             .attr("y", yScale(1))
             .attr("height", yScale(0)-yScale(1))
             .attr("width", 2)
             .style("fill", highlightColor)
   var slopeTickValues = [0,10,20,30,40,50,60,70,80,90,100];
   slopeChart.selectAll("tickText")
             .data(slopeTickValues)
             .enter()
             .append("text")
             .attr("class", "tickText")
             .attr("x", slopeMargin.left + slopeMargin.lineWidth + 10)
             .attr("y", function(d) {
               return yScale(d/100)-3;
             })
             .text(function(d) {
               if (d!=100) {
                 return d + " ~ " + (d+10) + "%";
               }
               else {
                 return d + "%";
               }
             });


  // INTERACTIVITY - when a champion is selected
  // Current champion
  updateChampion(1);
  var avgWin = Math.random();

  // Pairs
  var pairGroup = slopeChart.selectAll("pairGroup")
                            .data(champ_subset)
                            .enter()
                            .append("g")
                            .attr("class", "pairGroup")
                            .attr("transform", "translate(" + slopeMargin.left + ",0)");
  pairGroup.append("line")
           .attr("class", "pairLine")
           .attr("x1", 0)
           .attr("x2", slopeMargin.lineWidth)
           .attr("y1", yScale(+avgWin.toFixed(2)))
           .attr("y2", function(d) {
             return yScale(d.floor);
           })
           .style("stroke", highlightColor);

  pairGroup.append("circle")
           .attr("class", "pairDot")
           .attr("cx", slopeMargin.lineWidth)
           .attr("cy", function(d) {
             return yScale(d.floor);
           })
           .attr("r", function(d) {
             return dotScale(d.count)
           })
           .style("fill", dotColor);
  // Champion name
  svg_right.append("text")
            .text(currChampionName)
            .attr("x", rightMargin.left)
            .attr("y", rightMargin.top)
            .attr("class", "nameText")
            .style("fill", highlightColor);
  // Champion average dot
  slopeChart.append("circle")
           .attr("class", "champAvgDot")
           .attr("cx", slopeMargin.left)
           .attr("cy", yScale(+avgWin.toFixed(2)))
           .attr("r", 6)
           .style("fill", highlightColor);

}); // end d3.csv function
