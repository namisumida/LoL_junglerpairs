// Update
var updateGraphic = function() {

  // Update name text
  document.getElementById("champion-name").innerHTML = currChampionName;

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
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  dotGroupEnter = pairGroupEnter.append("g").attr("class", "dotGroup");
  nameGroupEnter = pairGroupEnter.append("g").attr("class", "nameGroup");
  dotGroupEnter.append("rect") // to allow clickability between name and rect
           .attr("class", "background")
           .attr("id", "dotBackground")
           .attr("x", 0)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", graphicMargin.w + margin.right)
           .attr("height", graphicMargin.h_col);
  dotGroupEnter.append("rect")
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
  nameGroupEnter.append("text")
           .attr("class", "pairNameText")
           .text(function(d) {
             return d.champ2;
           })
           .attr("x", margin.left+graphicMargin.w_names)
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3;
           });
  nameGroupEnter.append("rect")
           .attr("class", "background")
           .attr("id", "nameBackground")
           .attr("x", 0)
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .attr("width", graphicMargin.w_names)
           .attr("height", graphicMargin.h_col);
  dotGroupEnter.append("rect")
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
  dotGroupEnter.append("circle") // average dot
           .attr("class", "avgDot")
           .attr("cx", function(d) {
             return xScale_win(currAvg);
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           })
           .attr("r", 4)
           .style("fill", highlightColor);
  dotGroupEnter.append("circle") // pair dot
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
  dotGroupEnter.append("text")
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
  dotGroupEnter.append("text")
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

 // Merge
 dotGroup = dotGroup.merge(dotGroupEnter);
 nameGroup = nameGroup.merge(nameGroup);
 pairGroup = pairGroup.merge(pairGroupEnter);

  // Update
  svg.selectAll(".midline")
      .attr("x1", margin.left+xScale_win(currAvg))
      .attr("x2", margin.left+xScale_win(currAvg))
      .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2);

  dotGroup.select("#dotBackground")
           .attr("y", function(d,i) {
            return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
          });
  dotGroup.select(".pairBar")
           .attr("width", function(d) {
             return xScale_play(d.n_games);
           })
           .attr("y", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i;
           })
           .style("fill", light_gray);
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
                return xScale_win(currAvg);
              }
              else {
                return xScale_win(+(winRate).toFixed(2));
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
             return xScale_win(currAvg);
           })
           .attr("cy", function(d,i) {
             return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
           });
  dotGroup.select(".pairDot")
           .attr("cx", function(d) {
             return xScale_win(+(d.winrate).toFixed(2));
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
  dotGroup.select("#avgCountLabel")
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
  dotGroup.select("#pairCountLabel")
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
   breakline_g = svg.selectAll("#breakline_g")
                    .data(champ_subset.filter(function(d,i) {
                      return (i+1)%5==0;
                    }));
  breakline_g_enter = breakline_g.enter()
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
   breakline_g = breakline_g.merge(breakline_g_enter);
   breakline_g.attr("y1", function(d,i) {
                 return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
               })
               .attr("y2", function(d,i) {
                 return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
               });

   updateClick();
}; // end update graphic
