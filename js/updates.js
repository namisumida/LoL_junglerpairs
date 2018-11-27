// Scales
var updatexScale_play = function(subset) {
  var maxDistance = d3.min([xScale_win(currAvg), (w_dotLine-xScale_win(currAvg))]);
  xScale_play = d3.scaleLinear()
                   .domain([d3.min(subset, function(d) { return d.n_games; }), d3.max(subset, function(d) { return d.n_games; })])
                   .range([30, maxDistance]);
};

// Update slider - when a new champion is selected
var updateSlider = function() {
  var slider = d3.select(".slider");
  var previousValue = parseInt(slider.node().value); // save previous value
  var subset = dataset.filter(function(d) { return d.champ1 == currChampionName; })
  var subset_max = d3.max(subset, function(d) { return d.n_games; });
  // Update slider to new min and max
  document.getElementById("slider").min = d3.min(subset, function(d) { return d.n_games; });
  document.getElementById("slider").max = subset_max;
};

// Function to update champion - this only includes stuff when the champion is fixed
var updateChampion = function(champ) {
  currChampionName = champ; // set champ name
  // Get average
  var avgDataRow = avg_data.filter(function(d) { return d.champ == champ; })[0];
  currAvg = +(avgDataRow.winrate).toFixed(2);
  updateSlider();
  // update champ subset for now
  champ_subset = dataset.filter(function(d) { return d.champ1 == currChampionName; });
  // Update xScales
  updatexScale_play(champ_subset);
}; // end update champion

var updateData = function() {
  // Get subset
  champ_subset = dataset.filter(function(d) { return d.champ1 == currChampionName & d.n_games>=sliderValue; });
  if (sort == "win") {
    champ_subset.sort(function(a,b) { return d3.descending(a.winrate, b.winrate); })
  }
  else if (sort == "alpha") {
    champ_subset.sort(function(a,b) { return d3.ascending(a.champ2, b.champ2); })
  }
  else {
    champ_subset.sort(function(a,b) { return d3.descending(a.n_games, b.n_games); })
  }
  // Update nPairs
  nPairs = champ_subset.length;
}; // end update data

// On click
var updateClick = function() {
  dotGroup.on("click", function(d) {
    var currElement = d3.select(this);
    var currPair = d.champ2;

    // Remove on click attributes for all (mainly previously clicked element)
    svg.selectAll(".countLabel")
       .style("fill", "none");
    svg.selectAll(".pairBar")
       .style("fill", light_gray)
       .style("opacity", 0.3);
    svg.selectAll(".dotDistance")
       .style("opacity", 0.5);
    svg.selectAll(".pairNameText")
       .style("font-family", "radnika-regular");
    currElement.selectAll(".countLabel")
               .style("fill", "black");
    currElement.select(".pairBar")
               .style("fill", dotColor)
               .style("opacity", 0.5);
    currElement.select(".dotDistance")
               .style("opacity", 1);
    d3.selectAll(".pairNameText")
      .filter(function(d) { return d.champ2 == currPair; })
      .style("font-family", "radnika-bold");
  }); // end on click

  // When a name is selected
  nameGroup.on("click", function(d) {
    var newChampion = d3.select(this)._groups[0][0].textContent;
    updateChampion(newChampion);
    updateData();
    updateGraphic();
  });
};

// Resizing
var updateSizing = function() {
  var currentHeight = margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs);
  document.getElementById("graphic-svg").style.height = (currentHeight+30) + "px";
}

// update button
var updateButton = function(button) {
  // Update buttons
  var value = button._groups[0][0].value;

  // change button to selected styles
  button.style("background-color", d3.rgb(79,39,79))
        .style("color", "white");

  // assign other button
  if (value == "win") {
    d3.select("#button-alpha").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
    d3.select("#button-play").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
  }
  else if (value == "play") {
    d3.select("#button-alpha").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
    d3.select("#button-win").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
  }
  else if (value == "alpha") {
    d3.select("#button-win").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
    d3.select("#button-play").style("background-color", "white")
                             .style("color", d3.color("#a19da8"));
  }

}; // end update button

// Update
var updateGraphic = function() {

  // Update name text
  document.getElementById("champion-name").innerHTML = currChampionName;
  // Update icon image
  if (currChampionName.includes("'")) {
    var iconURLname = currChampionName.replace("'", "");
  }
  else { iconURLname = currChampionName; }
  document.getElementById("champion-icon").src = "";

  // Update groups and exit
  pairGroup = svg.selectAll(".pairGroup")
                 .data(champ_subset);
  dotGroup = pairGroup.select(".dotGroup");
  nameGroup = pairGroup.select(".nameGroup");
  dotGroup.exit().remove();
  nameGroup.exit().remove();
  pairGroup.exit().remove();

  // Enter elements
  pairGroupEnter = pairGroup.enter()
                            .append("g")
                            .attr("class", "pairGroup")
                            .attr("transform", "translate(0," + margin.top + ")");
  dotGroupEnter = pairGroupEnter.append("g").attr("class", "dotGroup");
  nameGroupEnter = pairGroupEnter.append("g").attr("class", "nameGroup");
  dotGroupEnter.append("rect") // to allow clickability between name and rect
           .attr("class", "background")
           .attr("id", "dotBackground")
           .attr("x", graphicMargin.w_names)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", w_dotLine+graphicMargin.btwn_names+margin.right)
           .attr("height", graphicMargin.h_col);
  dotGroupEnter.append("rect")
           .attr("class", "pairBar")
           .attr("width", function(d) {
             return xScale_play(d.n_games);
           })
           .attr("height", graphicMargin.h_col)
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .style("fill", light_gray)
           .style("opacity", 0.3);
  nameGroupEnter.append("rect")
           .attr("class", "background")
           .attr("id", "nameBackground")
           .attr("x", 0)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", graphicMargin.w_names)
           .attr("height", graphicMargin.h_col);
  nameGroupEnter.append("text")
           .attr("class", "pairNameText")
           .text(function(d) {
             return d.champ2;
           })
           .attr("x", graphicMargin.w_names)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3;
           });
  dotGroupEnter.append("rect")
            .attr("class", "dotDistance")
            .attr("x", function(d) {
              var winRate = +(d.winrate).toFixed(2)
              if (winRate > currAvg) {
                return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg);
              }
              else {
                return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2));
              }
            })
            .attr("y", function(d,i) {
              return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1;
            })
            .attr("height", 2)
            .attr("width", function(d) {
              return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg));
            });
  dotGroupEnter.append("circle") // average dot
           .attr("class", "avgDot")
           .attr("cx", function(d) {
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg);
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           })
           .attr("r", 4)
           .style("fill", highlightColor);
  dotGroupEnter.append("circle") // pair dot
           .attr("class", "pairDot")
           .attr("cx", function(d) {
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2));
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
  dotGroupEnter.append("text")
           .attr("class", "countLabel")
           .attr("id", "gamesCountLabel")
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             return d3.format(",")(d.n_games);
           })
           .style("text-anchor", "start")
           .style("fill", "none");
  dotGroupEnter.append("text")
               .attr("class", "countLabel")
               .attr("id", "avgCountLabel")
               .attr("x", function(d) {
                 if (+(d.winrate).toFixed(2) > currAvg) {
                   return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8;
                 }
                 else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
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
  dotGroupEnter.append("text")
           .attr("class", "countLabel")
           .attr("id", "pairCountLabel")
           .attr("x", function(d) {
             var roundedAvg = +(d.winrate).toFixed(2);
             if (roundedAvg > currAvg) {
               return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) + 8;
             }
             else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) - 8; };
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             if (+d.winrate.toFixed(2)!=currAvg) {
               return d3.format(".0%")(d.winrate);
             }
           })
           .style("text-anchor", function(d) {
             if (+(d.winrate).toFixed(2) > currAvg) {
               return "start";
             }
             else { return "end"; };
           })
           .style("fill", "none");

 // Merge
 dotGroup = dotGroup.merge(dotGroupEnter);
 nameGroup = nameGroup.merge(nameGroupEnter);
 pairGroup = pairGroup.merge(pairGroupEnter);

  // Update
  svg.selectAll(".midline")
      .attr("x1", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
      .attr("x2", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
      .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2);

  dotGroup.select("#dotBackground")
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
          });
  dotGroup.select(".pairBar")
            .attr("width", function(d) {
              return xScale_play(d.n_games);
            })
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .style("fill", light_gray)
           .style("opacity", 0.3);
  nameGroup.select("#nameBackground")
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
  nameGroup.select(".pairNameText")
           .text(function(d) {
             return d.champ2;
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3;
           })
           .style("font-family", "radnika-regular");
  dotGroup.select(".dotDistance")
            .attr("x", function(d) {
              var winRate = +(d.winrate).toFixed(2)
              if (winRate > currAvg) {
                return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg);
              }
              else {
                return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2));
              }
            })
            .attr("y", function(d,i) {
              return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1;
            })
            .attr("width", function(d) {
              return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg));
            })
            .style("opacity", 0.5);
  dotGroup.select(".avgDot")
           .attr("cx", function(d) {
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg);
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           });
  dotGroup.select(".pairDot")
           .attr("cx", function(d) {
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2));
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           })
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
  dotGroup.select("#gamesCountLabel")
           .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             return d3.format(",")(d.n_games);
           })
           .style("text-anchor", "start")
           .style("fill", "none");
  dotGroup.select("#avgCountLabel")
          .attr("x", function(d) {
            if (+(d.winrate).toFixed(2) > currAvg) {
              return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8;
            }
            else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
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
  dotGroup.select("#pairCountLabel")
           .attr("x", function(d) {
             var roundedAvg = +(d.winrate).toFixed(2);
             if (roundedAvg > currAvg) {
               return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) + 8;
             }
             else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) - 8; };
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
           })
           .text(function(d) {
             if (+d.winrate.toFixed(2)!=currAvg) {
               return d3.format(".0%")(d.winrate);
             }
           })
           .style("text-anchor", function(d) {
             if (+(d.winrate).toFixed(2) > currAvg) {
               return "start";
             }
             else { return "end"; };
           })
           .style("fill", "none");

   // Data labels
   var firstRow = champ_subset[0];
   var firstRowDist = xScale_win(+firstRow.winrate.toFixed(2))-xScale_win(currAvg);
   svg.select("#avgDataLabel")
       .text("Individual win rate")
       .attr("x", function() {
         if (Math.abs(firstRowDist) < 30) {
           if (firstRowDist < 0) { // if average is greater than winrate
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg)+5;
           }
           else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg)-5; }
         }
         else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
       })
       .attr("y", margin.top-25)
       .call(wrap, 60)
       .style("text-anchor", function() {
         if (Math.abs(firstRowDist) < 60) {
           if (firstRowDist < 0) { // if average is greater than winrate
             return "start";
           }
           else { return "end"; }
         }
         else { return "middle"; }
       });
   svg.select("#pairDataLabel")
       .text("Paired win rate")
       .attr("x", function() {
         if (Math.abs(firstRowDist) < 30) {
           if (firstRowDist < 0) { // if average is greater than winrate
             return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+champ_subset[0].winrate.toFixed(2))-5;
           }
           else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+champ_subset[0].winrate.toFixed(2))+5; }
         }
         else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+champ_subset[0].winrate.toFixed(2)); }
       })
       .attr("y", margin.top-25)
       .call(wrap, 50)
       .style("text-anchor", function() {
         if (Math.abs(firstRowDist) < 60) {
           if (firstRowDist < 0) {
             return "end";
           }
           else { return "start"; }
         }
         else { return "middle"; }
       });

   // Create line breaks
   svg.selectAll(".breakline")
        .data(champ_subset.filter(function(d,i) {
          return (i+1)%5==0;
        }))
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
   updateSizing();
}; // end update graphic
