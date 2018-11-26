var svg = d3.select("#graphic-svg");
var w_svg = document.getElementById("graphic-svg").getBoundingClientRect().width;
var margin = { left: 5, right: 40, top: 60, bottom: 0 }
var graphicMargin = { w:(w_svg-margin.left-margin.right), w_names:75, btwn_names:15, h_col:13, h_btwn:5 };
var w_dotLine = graphicMargin.w-graphicMargin.w_names-graphicMargin.btwn_names;

// Datasets
var dataset, champ_subset, currChampionName, currAvg, nPairs, sort, pairGroup, dotGroup, nameGroup;
var rowConverter = function(d) {
  return {
    champ1: d.champ1,
    champ2: d.champ2,
    winrate: parseFloat(d.winrate),
    n_games: parseInt(d.n_games)
  }
};

// Scale
var xScale_win = d3.scaleLinear()
                   .domain([0,1])
                   .range([80, w_dotLine]);

var sliderValue = parseInt(d3.select(".slider").node().value);

// Text wrap function
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.3, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
        }
    }
  });
}; // end wrap function

// Colors
var green = "green";
var red = d3.rgb(212,89,84);
var gray = d3.color("#a19da8");
var dark_gray = d3.rgb(100,100,100);
var dotColor = d3.color("#f6bba8");
var highlightColor = d3.rgb(79,39,79);
var light_gray = d3.rgb(200,200,200);

// Import data
d3.csv('data/jungler_pair_long.csv', rowConverter, function(data) {

   // Data
   dataset = data;

  // Create base elements
  svg.append("line")
      .attr("class", "midline")
      .attr("x1", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
      .attr("x2", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
      .attr("y1", margin.top)
      .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2)
      .style("stroke", gray);
  svg.append("text")
     .text("Paired champion")
     .attr("x", graphicMargin.w_names)
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "nameDataLabel")
     .call(wrap, 50)
     .style("text-anchor", "end");
  svg.append("text")
     .text("# of games played")
     .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "nGamesDataLabel")
     .style("text-anchor", "start")
     .call(wrap, 80);
  svg.append("text")
     .text("Individual win rate")
     .attr("x", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "avgDataLabel")
     .call(wrap, 60);
  svg.append("text")
     .text("Paired win rate")
     .attr("x", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+champ_subset[0].winrate.toFixed(2)))
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "pairDataLabel")
     .call(wrap, 50);
  // Pairs
  pairGroup = svg.selectAll("pairGroup")
                  .data(champ_subset)
                  .enter()
                  .append("g")
                  .attr("class", "pairGroup")
                  .attr("transform", "translate(0," + margin.top + ")");
  dotGroup = pairGroup.append("g")
                      .attr("class", "dotGroup");
  nameGroup = pairGroup.append("g")
                       .attr("class", "nameGroup");
  dotGroup.append("rect") // to allow clickability between name and rect
           .attr("class", "background")
           .attr("id", "dotBackground")
           .attr("x", graphicMargin.w_names)
           .attr("width", w_dotLine+graphicMargin.btwn_names+margin.right)
           .attr("height", graphicMargin.h_col);
  dotGroup.append("rect")
           .attr("class", "pairBar")
           .attr("height", graphicMargin.h_col)
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
           .style("fill", light_gray)
           .style("opacity", 0.3);
  nameGroup.append("rect")
           .attr("class", "background")
           .attr("id", "nameBackground")
           .attr("x", 0)
           .attr("width", graphicMargin.w_names)
           .attr("height", graphicMargin.h_col);
  nameGroup.append("text")
           .attr("class", "pairNameText")
           .attr("x", graphicMargin.w_names);
  dotGroup.append("rect")
            .attr("class", "dotDistance")
            .attr("height", 2)
  dotGroup.append("circle") // average dot
           .attr("class", "avgDot")
           .attr("r", 4)
           .style("fill", highlightColor);
  dotGroup.append("circle") // pair dot
           .attr("class", "pairDot")
           .attr("r", 4);
  dotGroup.append("text")
           .attr("class", "countLabel")
           .attr("id", "gamesCountLabel")
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
           .style("text-anchor", "start")
           .style("fill", "none");
  dotGroup.append("text")
           .attr("class", "countLabel")
           .attr("id", "avgCountLabel")
           .style("fill", "none");
  dotGroup.append("text")
           .attr("class", "countLabel")
           .attr("id", "pairCountLabel")
           .style("fill", "none");
   // Create line breaks
   var breakline_g = svg.append("g").attr("id", "breakline_g");
   breakline_g.append("line")
               .attr("class", "breakline")
               .attr("x1", 0)
               .attr("x2", w_svg);

   // Initial setting
   sort = "win";
   updateChampion("Nunu");
   updateData();
   updateClick();
   updateSizing();

  // INTERACTIVITY
  // Sorting - buttons
  d3.select("#button-alpha").on("click", function() {
    sort = "alpha";
    updateButton(d3.select(this));
    updateData();
    updateGraphic();
  }); // end sorting changes
  d3.select("#button-win").on("click", function() {
    sort = "win";
    updateButton(d3.select(this));
    updateData();
    updateGraphic();
  }); // end sorting changes
  d3.select("#button-play").on("click", function() {
    sort = "play";
    updateButton(d3.select(this));
    updateData();
    updateGraphic();
  }); // end sorting changes
  // Slider
  d3.select(".slider").on("input", function() {
    // update slider display
    sliderValue = parseInt(d3.select(this).node().value);
    document.getElementById("slider-instructions").innerHTML = "Show pairs with at least " + d3.format(",")(sliderValue) + " games played:";

    updateData();
    updateGraphic();
  }); // end on change slider function

}); // end d3.csv function
