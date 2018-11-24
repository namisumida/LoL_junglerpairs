var svg = d3.select("#graphic-svg");
var w_svg = document.getElementById("graphic-svg").getBoundingClientRect().width;
var margin = { left: 5, right: 32, top: 60, bottom: 0 }
var graphicMargin = { w:(w_svg-margin.left-margin.right), w_names:65, btwn_names:35, h_col:13, h_btwn:3 };
var w_dotLine = graphicMargin.w-(margin.left+graphicMargin.w_names+graphicMargin.btwn_names);

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

// Scales
var xScale_win;
var updatexScale_win = function(subset) {
  xScale_win = d3.scaleLinear()
                 .domain([d3.min(subset, function(d) { return d.winrate; }), d3.max(subset, function(d) { return d.winrate; })])
                 .range([margin.left+graphicMargin.w_names+graphicMargin.btwn_names, margin.left+graphicMargin.w_names+graphicMargin.btwn_names+w_dotLine]);
};
var xScale_play;
var updatexScale_play = function(subset) {
  xScale_play = d3.scaleLinear()
                   .domain([d3.min(subset, function(d) { return d.n_games; }), d3.max(subset, function(d) { return d.n_games; })])
                   .range([margin.left+graphicMargin.w_names+graphicMargin.btwn_names, margin.left+graphicMargin.w_names+graphicMargin.btwn_names+w_dotLine]);
};

// Function to update champion
var updateChampion = function(champ) {
  currChampionName = champ; // set champ name
  // Get average
  var avgDataRow = avg_data.filter(function(d) { return d.queueid==1200 & d.champion == champ; })[0];
  currAvg = +(avgDataRow.nwins/avgDataRow.ngames).toFixed(2);
  // Get subset
  champ_subset = dataset.filter(function(d) { return d.champ1 == champ; });
  if (sort == "win") {
    champ_subset.sort(function(a,b) { return d3.descending(a.winrate, b.winrate); })
  }
  else {
    champ_subset.sort(function(a,b) { return d3.ascending(a.champ2, b.champ2); })
  }
  // Update xScales
  updatexScale_win(champ_subset);
  updatexScale_play(champ_subset);
  // Update nPairs
  nPairs = champ_subset.length;
}; // end update champion function

// On click
var updateClick = function() {
  dotGroup.on("click", function(d) {
    var currElement = d3.select(this);

    // Remove on click attributes for all (mainly previously clicked element)
    svg.selectAll(".countLabel")
       .style("fill", "none");
    svg.selectAll(".pairBar")
       .style("fill", light_gray);
    svg.selectAll(".dotDistance")
       .style("opacity", 0.5);
    svg.selectAll(".pairNameText")
       .style("font-family", "radnika-regular");
    currElement.selectAll(".countLabel")
               .style("fill", "black");
    currElement.select(".pairBar")
               .style("fill", dotColor);
    currElement.select(".dotDistance")
               .style("opacity", 1);
    currElement.select(".pairNameText")
               .style("font-family", "radnika-bold");
  }); // end on click
};

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
var red = "red";
var gray = d3.color("#a19da8");
var dark_gray = d3.rgb(100,100,100);
var dotColor = d3.color("#f6bba8");
var highlightColor = d3.rgb(79,39,79);
var light_gray = d3.rgb(200,200,200);

// Import data
d3.csv('data/jungler_pair_long.csv', rowConverter, function(data) {

   // Data
   dataset = data;

   // Initial setting
   sort = "win";
   updateChampion("Nunu");

  // Create base elements
  svg.append("line")
      .attr("class", "midline")
      .attr("x1", margin.left+xScale_win(currAvg))
      .attr("x2", margin.left+xScale_win(currAvg))
      .attr("y1", margin.top)
      .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2)
      .style("stroke", gray);
  svg.append("text")
     .text("Paired champion")
     .attr("x", margin.left+graphicMargin.w_names)
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "nameDataLabel")
     .call(wrap, 40)
     .style("text-anchor", "end");
  svg.append("text")
     .text("# of games played")
     .attr("x", margin.left+graphicMargin.w_names+20)
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "barDataLabel")
     .call(wrap, 60)
     .style("text-anchor", "start");
  svg.append("text")
     .text("Individual win rate")
     .attr("x", margin.left+xScale_win(currAvg))
     .attr("y", margin.top-40)
     .attr("class", "dataLabel")
     .attr("id", "avgDataLabel")
     .call(wrap, 40);
  svg.append("text")
     .text("Paired win rate")
     .attr("x", margin.left+xScale_win(champ_subset[0].winrate))
     .attr("y", margin.top-25)
     .attr("class", "dataLabel")
     .attr("id", "pairDataLabel")
     .call(wrap, 40);
  // Pairs
  pairGroup = svg.selectAll("pairGroup")
                  .data(champ_subset)
                  .enter()
                  .append("g")
                  .attr("class", "pairGroup")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  dotGroup = pairGroup.append("g")
                      .attr("class", "dotGroup");
  nameGroup = pairGroup.append("g")
                       .attr("class", "nameGroup");
  dotGroup.append("rect") // to allow clickability between name and rect
           .attr("class", "background")
           .attr("id", "dotBackground")
           .attr("x", 0)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", graphicMargin.w + margin.right)
           .attr("height", graphicMargin.h_col);
  dotGroup.append("rect")
           .attr("class", "pairBar")
           .attr("width", function(d) {
             return xScale_play(d.n_games);
           })
           .attr("height", graphicMargin.h_col)
           .attr("x", margin.left+graphicMargin.w_names+5)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .style("fill", light_gray)
           .style("opacity", .4);
  nameGroup.append("rect")
           .attr("class", "background")
           .attr("id", "nameBackground")
           .attr("x", 0)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", graphicMargin.w_names)
           .attr("height", graphicMargin.h_col);
  nameGroup.append("text")
           .attr("class", "pairNameText")
           .text(function(d) {
             return d.champ2;
           })
           .attr("x", margin.left+graphicMargin.w_names)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3;
           });
  dotGroup.append("rect")
            .attr("class", "dotDistance")
            .attr("x", function(d) {
              var winRate = +(d.winrate).toFixed(2)
              if (winRate > currAvg) {
                return xScale_win(currAvg);
              }
              else {
                return xScale_win(+(winRate).toFixed(2));
              }
            })
            .attr("y", function(d,i) {
              return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1;
            })
            .attr("height", 2)
            .attr("width", function(d) {
              return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg));
            });
  dotGroup.append("circle") // average dot
           .attr("class", "avgDot")
           .attr("cx", function(d) {
             return xScale_win(currAvg);
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           })
           .attr("r", 4)
           .style("fill", highlightColor);
  dotGroup.append("circle") // pair dot
           .attr("class", "pairDot")
           .attr("cx", function(d) {
             return xScale_win(+(d.winrate).toFixed(2));
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           })
           .attr("r", 4)
           .style("fill", function(d) {
             var roundedWin = +(d.winrate).toFixed(2);
             if (roundedWin > currAvg) {
               return green;
             }
             else if (roundedWin < currAvg) {
               return red;
             }
             else {
               return dark_gray;
             }
           });
  dotGroup.append("text")
           .attr("class", "countLabel")
           .attr("id", "avgCountLabel")
           .attr("x", function(d) {
             if (+(d.winrate).toFixed(2) > currAvg) {
               return xScale_win(currAvg) - 8;
             }
             else { return xScale_win(currAvg) + 8; };
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             return d3.format(".0%")(currAvg);
           })
           .style("text-anchor", function(d) {
             if (+(d.winrate).toFixed(2) > currAvg) {
               return "end";
             }
             else { return "start"; };
           })
           .style("fill", "none");
  dotGroup.append("text")
           .attr("class", "countLabel")
           .attr("id", "pairCountLabel")
           .attr("x", function(d) {
             var roundedAvg = +(d.winrate).toFixed(2);
             if (roundedAvg > currAvg) {
               return xScale_win(roundedAvg) + 8;
             }
             else { return xScale_win(roundedAvg) - 8; };
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             return d3.format(".0%")(d.winrate);
           })
           .style("text-anchor", function(d) {
             if (+(d.winrate).toFixed(2) > currAvg) {
               return "start";
             }
             else { return "end"; };
           })
           .style("fill", "none");
   // Create line breaks
   var breakline_g = svg.append("g").attr("id", "breakline_g");
   breakline_g.selectAll("breakline")
               .data(champ_subset.filter(function(d,i) {
                 return (i+1)%5==0;
               })) // this can be any mode, but should be based on the metric
               .enter()
               .append("line")
               .attr("class", "breakline")
               .attr("x1", 0)
               .attr("x2", w_svg)
               .attr("y1", function(d,i) {
                 return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
               })
               .attr("y2", function(d,i) {
                 return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
               });

  updateClick();

  // INTERACTIVITY - when a new champion is selected
  svg.selectAll(".nameGroup").on("click", function(d) {
    var newChampion = d3.select(this)._groups[0][0].textContent;
    updateChampion(newChampion);
    updateGraphic();
  })


}); // end d3.csv function
