function init() {
  const markup = `
  <section id="title">
		<h1 id="title-text">Nexus Blitz jungle duos</h1>
		<h3 id="instructions">Explore win and play rates for different combinations of your favorite junglers.</h3>
	</section>
	<section id="options">
		<div id="name-image-container">
			<div id="name-container">
				<h2 id="champion-name">Nunu</h2>
			</div>
			<img id="champion-icon" src="https://ddragon.leagueoflegends.com/cdn/8.23.1/img/champion/Aatrox.png" alt="Champion icon">
		</div>
		<div id="options-container">
			<div id="searchbar-container">
				<h5 id="searchbar-instructions">Search for a champion:</h5>
				<input id="searchbar" type="text" placeholder="Type in a champion name">
			</div>
			<div id="button-section">
				<h5 id="button-instructions">Sort by:</h5>
				<div id="button-container">
					<button type="button" id="button-win" value="win">Win rate</button>
					<button type="button" id="button-play" value="play"># games</button>
					<button type="button" id="button-alpha" value="alpha">Champion name</button>
				</div>
			</div>
			<div id="slider-container">
				<h5 id="slider-instructions">Show pairs with at least 200 games played:</h5>
				<input id="slider" class="slider" type="range" min="137" max="12567" step="1" value="200" orient="horizontal"></input>
			</div>
		</div>
	</section>
	<svg id="graphic-svg" height="100%" width="100%"></svg>
  `
  document.getElementById("js-junglerpairs").innerHTML = markup;

  var svg = d3.select("#graphic-svg");
  var w_svg = document.getElementById("graphic-svg").getBoundingClientRect().width;
  var margin = { left: 5, right: 40, top: 60, bottom: 0 }
  var graphicMargin = { w:(w_svg-margin.left-margin.right), w_names:90, btwn_names:15, h_col:13, h_btwn:5 };
  var w_dotLine = graphicMargin.w-graphicMargin.w_names-graphicMargin.btwn_names;
  var searchedChampion, xScale_play;
  // Colors
  var green = "green";
  var red = d3.rgb(212,89,84);
  var gray = d3.color("#a19da8");
  var dark_gray = d3.rgb(100,100,100);
  var dotColor = d3.color("#f6bba8");
  var highlightColor = d3.rgb(79,39,79);
  var light_gray = d3.rgb(200,200,200);
  // Datasets
  var avg_data = [{champ: 'Aatrox',winrate: 0.484620106433638 },
  {champ: 'Ahri',winrate: 0.498866213169796 },
  {champ: 'Akali',winrate: 0.397741472697074 },
  {champ: 'Alistar',winrate: 0.537150429510739 },
  {champ: 'Amumu',winrate: 0.553002044495287 },
  {champ: 'Anivia',winrate: 0.528135990590416 },
  {champ: 'Annie',winrate: 0.486048307080181 },
  {champ: 'Ashe',winrate: 0.463068849431503 },
  {champ: 'Aurelion Sol',winrate: 0.485882675446135 },
  {champ: 'Azir',winrate: 0.458300147994994 },
  {champ: 'Bard',winrate: 0.471827811586207 },
  {champ: 'Blitzcrank',winrate: 0.458426161687977 },
  {champ: 'Brand',winrate: 0.58729332118676 },
  {champ: 'Braum',winrate: 0.48779204375763 },
  {champ: 'Caitlyn',winrate: 0.467790612999271 },
  {champ: 'Camille',winrate: 0.475134020650502 },
  {champ: 'Cassiopeia',winrate: 0.534426789693149 },
  {champ: "Cho'Gath",winrate: 0.5134551089114 },
  {champ: 'Corki',winrate: 0.472509702557568 },
  {champ: 'Darius',winrate: 0.498715124812913 },
  {champ: 'Diana',winrate: 0.523989185700549 },
  {champ: 'Dr. Mundo',winrate: 0.543204534644253 },
  {champ: 'Draven',winrate: 0.467213935332566 },
  {champ: 'Ekko',winrate: 0.518524809425253 },
  {champ: 'Elise',winrate: 0.493895050809395 },
  {champ: 'Evelynn',winrate: 0.466038298357659 },
  {champ: 'Ezreal',winrate: 0.485545148641285 },
  {champ: 'Fiddlesticks',winrate: 0.502418998097949 },
  {champ: 'Fiora',winrate: 0.479191438752973 },
  {champ: 'Fizz',winrate: 0.494103383632573 },
  {champ: 'Galio',winrate: 0.508729437829111 },
  {champ: 'Gangplank',winrate: 0.475272864206699 },
  {champ: 'Garen',winrate: 0.510628757226084 },
  {champ: 'Gnar',winrate: 0.457838722847421 },
  {champ: 'Gragas',winrate: 0.51745572103963 },
  {champ: 'Graves',winrate: 0.535110556870696 },
  {champ: 'Hecarim',winrate: 0.474333237808009 },
  {champ: 'Heimerdinger',winrate: 0.488892991183619 },
  {champ: 'Illaoi',winrate: 0.497490816905686 },
  {champ: 'Irelia',winrate: 0.474172674070472 },
  {champ: 'Ivern',winrate: 0.449740514974656 },
  {champ: 'Janna',winrate: 0.512787098902753 },
  {champ: 'Jarvan IV',winrate: 0.520395937114316 },
  {champ: 'Jax',winrate: 0.530931352091651 },
  {champ: 'Jayce',winrate: 0.498398620309682 },
  {champ: 'Jhin',winrate: 0.501583029970556 },
  {champ: 'Jinx',winrate: 0.511073718670017 },
  {champ: "Kai'Sa",winrate: 0.515817237551695 },
  {champ: 'Kalista',winrate: 0.493511132269794 },
  {champ: 'Karma',winrate: 0.500194212493688 },
  {champ: 'Karthus',winrate: 0.58081893373498 },
  {champ: 'Kassadin',winrate: 0.491815205509883 },
  {champ: 'Katarina',winrate: 0.451131393772105 },
  {champ: 'Kayle',winrate: 0.554085570058389 },
  {champ: 'Kayn',winrate: 0.498578940374468 },
  {champ: 'Kennen',winrate: 0.488442822315693 },
  {champ: "Kha'Zix",winrate: 0.483186150672351 },
  {champ: 'Kindred',winrate: 0.486685012976446 },
  {champ: 'Kled',winrate: 0.506275883998853 },
  {champ: "Kog'Maw",winrate: 0.559924612359462 },
  {champ: 'LeBlanc',winrate: 0.466666666690069 },
  {champ: 'Lee Sin',winrate: 0.494543612925522 },
  {champ: 'Leona',winrate: 0.51742954354696 },
  {champ: 'Lissandra',winrate: 0.481136469567536 },
  {champ: 'Lucian',winrate: 0.507134874967248 },
  {champ: 'Lulu',winrate: 0.492258685802578 },
  {champ: 'Lux',winrate: 0.518096616871533 },
  {champ: 'Malphite',winrate: 0.521761874900541 },
  {champ: 'Malzahar',winrate: 0.514912124973638 },
  {champ: 'Maokai',winrate: 0.550234176822921 },
  {champ: 'Master Yi',winrate: 0.492346123107902 },
  {champ: 'Miss Fortune',winrate: 0.501001776741126 },
  {champ: 'Mordekaiser',winrate: 0.501358119023003 },
  {champ: 'Morgana',winrate: 0.530192074286061 },
  {champ: 'Nami',winrate: 0.524283206623903 },
  {champ: 'Nasus',winrate: 0.470759403829525 },
  {champ: 'Nautilus',winrate: 0.519706279039142 },
  {champ: 'Nidalee',winrate: 0.479804934050889 },
  {champ: 'Nocturne',winrate: 0.46126169762374 },
  {champ: 'Nunu',winrate: 0.481377258030678 },
  {champ: 'Olaf',winrate: 0.475846875967083 },
  {champ: 'Orianna',winrate: 0.533438042484914 },
  {champ: 'Ornn',winrate: 0.49563278197677 },
  {champ: 'Pantheon',winrate: 0.485353443319751 },
  {champ: 'Poppy',winrate: 0.533328420893302 },
  {champ: 'Pyke',winrate: 0.46523238627363 },
  {champ: 'Quinn',winrate: 0.460751864813911 },
  {champ: 'Rakan',winrate: 0.506520469793616 },
  {champ: 'Rammus',winrate: 0.493644980662322 },
  {champ: "Rek'Sai",winrate: 0.466043947643366 },
  {champ: 'Renekton',winrate: 0.494794829541989 },
  {champ: 'Rengar',winrate: 0.487553406525283 },
  {champ: 'Riven',winrate: 0.517079540505592 },
  {champ: 'Rumble',winrate: 0.531666963180751 },
  {champ: 'Ryze',winrate: 0.469362084484097 },
  {champ: 'Sejuani',winrate: 0.474309177586866 },
  {champ: 'Shaco',winrate: 0.462381656801272 },
  {champ: 'Shen',winrate: 0.481795044919493 },
  {champ: 'Shyvana',winrate: 0.477091633495518 },
  {champ: 'Singed',winrate: 0.528018318080683 },
  {champ: 'Sion',winrate: 0.546495489224562 },
  {champ: 'Sivir',winrate: 0.486305836310401 },
  {champ: 'Skarner',winrate: 0.494602889860744 },
  {champ: 'Sona',winrate: 0.527556325861785 },
  {champ: 'Soraka',winrate: 0.4913137893655 },
  {champ: 'Swain',winrate: 0.502147803937758 },
  {champ: 'Syndra',winrate: 0.493487433489452 },
  {champ: 'Tahm Kench',winrate: 0.478827361549577 },
  {champ: 'Taliyah',winrate: 0.527126231000239 },
  {champ: 'Talon',winrate: 0.463339686518301 },
  {champ: 'Taric',winrate: 0.537826877404769 },
  {champ: 'Teemo',winrate: 0.472499738707376 },
  {champ: 'Thresh',winrate: 0.487032466273287 },
  {champ: 'Tristana',winrate: 0.493274416818442 },
  {champ: 'Trundle',winrate: 0.49779207812675 },
  {champ: 'Tryndamere',winrate: 0.505955143070244 },
  {champ: 'Twisted Fate',winrate: 0.488251654343052 },
  {champ: 'Twitch',winrate: 0.500895939060735 },
  {champ: 'Udyr',winrate: 0.493658766539233 },
  {champ: 'Urgot',winrate: 0.51134505318612 },
  {champ: 'Varus',winrate: 0.476136104187942 },
  {champ: 'Vayne',winrate: 0.521392259446102 },
  {champ: 'Veigar',winrate: 0.496676217804412 },
  {champ: "Vel'Koz",winrate: 0.51679379097404 },
  {champ: 'Vi',winrate: 0.488395615203288 },
  {champ: 'Viktor',winrate: 0.509665541557533 },
  {champ: 'Vladimir',winrate: 0.47935400987539 },
  {champ: 'Volibear',winrate: 0.517387741330441 },
  {champ: 'Warwick',winrate: 0.469156468679203 },
  {champ: 'Wukong',winrate: 0.509678847007245 },
  {champ: 'Xayah',winrate: 0.503280224983727 },
  {champ: 'Xerath',winrate: 0.495114656016152 },
  {champ: 'Xin Zhao',winrate: 0.478278642802619 },
  {champ: 'Yasuo',winrate: 0.513977910969915 },
  {champ: 'Yorick',winrate: 0.495107114525522 },
  {champ: 'Zac',winrate: 0.485367153268848 },
  {champ: 'Zed',winrate: 0.478423817748161 },
  {champ: 'Ziggs',winrate: 0.509211691740744 },
  {champ: 'Zilean',winrate: 0.507737200435052 },
  {champ: 'Zoe',winrate: 0.448825440024095 },
  {champ: 'Zyra',winrate: 0.534561299287912 }];
  // Scales
  var xScale_win = d3.scaleLinear()
                     .domain([0,1])
                     .range([80, w_dotLine]);
  // Slider
  var sliderValue = parseInt(d3.select(".slider").node().value);
  function setup() {
      // Initial setting
      sort = "win";
      updateChampion("Nunu");
      updateData();

     // Create base elements
     svg.append("line")
         .attr("class", "midline")
         .attr("x1", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
         .attr("x2", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
         .attr("y1", margin.top)
         .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2)
         .style("stroke", gray);
     svg.append("text")
        .text("Paired with...")
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
        .text(currChampionName + "'s win rate")
        .attr("x", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
        .attr("y", margin.top-25)
        .attr("class", "dataLabel")
        .attr("id", "avgDataLabel")
        .call(wrapChampion);
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
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
              .attr("width", w_dotLine+graphicMargin.btwn_names+margin.right)
              .attr("height", graphicMargin.h_col);
     dotGroup.append("rect")
              .attr("class", "pairBar")
              .attr("width", function(d) { return xScale_play(d.n_games); })
              .attr("height", graphicMargin.h_col)
              .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
              .style("fill", light_gray)
              .style("opacity", 0.3);
     nameGroup.append("rect")
              .attr("class", "background")
              .attr("id", "nameBackground")
              .attr("x", 0)
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
              .attr("width", graphicMargin.w_names)
              .attr("height", graphicMargin.h_col);
     nameGroup.append("text")
              .attr("class", "pairNameText")
              .text(function(d) { return "+ " + d.champ2; })
              .attr("x", graphicMargin.w_names)
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3; });
     dotGroup.append("rect")
               .attr("class", "dotDistance")
               .attr("x", function(d) {
                 var winRate = +(d.winrate).toFixed(2)
                 if (winRate > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
                 else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2)); }
               })
               .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1; })
               .attr("height", 2)
               .attr("width", function(d) { return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg)); });
     dotGroup.append("circle") // average dot
              .attr("class", "avgDot")
              .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); })
              .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; })
              .attr("r", 4)
              .style("fill", highlightColor);
     dotGroup.append("circle") // pair dot
              .attr("class", "pairDot")
              .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2)); })
              .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; })
              .attr("r", 4)
              .style("fill", function(d) {
                var roundedWin = +(d.winrate).toFixed(2);
                if (roundedWin > currAvg) { return green; }
                else if (roundedWin < currAvg) { return red; }
                else { return dark_gray; }
              });
     dotGroup.append("text")
              .attr("class", "countLabel")
              .attr("id", "gamesCountLabel")
              .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
              .text(function(d) { return d3.format(",")(d.n_games); })
              .style("text-anchor", "start")
              .style("fill", "none");
     dotGroup.append("text")
              .attr("class", "countLabel")
              .attr("id", "avgCountLabel")
              .attr("x", function(d) {
                if (+(d.winrate).toFixed(2) > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8; }
                else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
              })
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
              .text(function(d) { return d3.format(".0%")(currAvg); })
              .style("text-anchor", function(d) {
                if (+(d.winrate).toFixed(2) > currAvg) { return "end"; }
                else { return "start"; };
              })
              .style("fill", "none");
     dotGroup.append("text")
              .attr("class", "countLabel")
              .attr("id", "pairCountLabel")
              .attr("x", function(d) {
                var roundedWin = +(d.winrate).toFixed(2);
                if (roundedWin > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedWin) + 8; }
                else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedWin) - 8; };
              })
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
              .text(function(d) { return d3.format(".0%")(d.winrate); })
              .style("text-anchor", function(d) {
                if (+(d.winrate).toFixed(2) > currAvg) { return "start"; }
                else { return "end"; };
              })
              .style("fill", "none");
      // Create line breaks
      svg.selectAll("breakline")
          .data(champ_subset.filter(function(d,i) { return (i+1)%5==0; })) // this can be any mode, but should be based on the metric
          .enter()
          .append("line")
          .attr("class", "breakline")
          .attr("x1", 0)
          .attr("x2", w_svg)
          .attr("y1", function(d,i) { return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2; })
          .attr("y2", function(d,i) { return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2; });

      updateClick();
      updateSizing();
  }; // end set up function
  function resize() {
    // Get width and update scales/margins/sizes
    w_svg = document.getElementById("graphic-svg").getBoundingClientRect().width;
    graphicMargin = { w:(w_svg-margin.left-margin.right), w_names:90, btwn_names:15, h_col:13, h_btwn:5 };
    w_dotLine = graphicMargin.w-graphicMargin.w_names-graphicMargin.btwn_names;
    xScale_win = d3.scaleLinear()
                   .domain([0,1])
                   .range([80, w_dotLine]);
    xScale_play = d3.scaleLinear()
                     .domain([0, d3.max(champ_subset, function(d) { return d.n_games; })])
                     .range([0, d3.min([xScale_win(currAvg), (w_dotLine-xScale_win(currAvg))])]);
    updateGraphicResizing();
  }; // end resize function
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
  function wrapChampion(text) {
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
      var champNameLength = tspan.text(currChampionName + "'s").node().getComputedTextLength();
      if (champNameLength < 45) {
        var width = 45;
      }
      else { var width = champNameLength; }
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
  function updatexScale_play(subset) {
    var maxDistance = d3.min([xScale_win(currAvg), (w_dotLine-xScale_win(currAvg))]);
    xScale_play = d3.scaleLinear()
                     .domain([0, d3.max(subset, function(d) { return d.n_games; })])
                     .range([0, maxDistance]);
  };
  // Search bar functions
  function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
    var currentFocus;
  /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:
              Run update on graphic */
              closeAllLists();
              updateChampion("+ "+inp.value);
              updateData();
              updateGraphic();
              document.getElementById("searchbar").value="";
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          save old variable
          increase the currentFocus variable:*/
          old = currentFocus;
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.color = d3.rgb(79,39,79);
            x[old].style.backgroundColor = d3.color("#fff");
          }
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          old = currentFocus;
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.color = d3.rgb(79,39,79);
            x[old].style.backgroundColor = d3.color("#fff");
          }
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    }); // end add event listener
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
      x[currentFocus].style.color = "white";
      x[currentFocus].style.backgroundColor = d3.rgb(79,39,79);
    }; // end addActive

    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }; // end removeActive

    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }; // end closeAllLists
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      document.getElementById("searchbar").value="";
    });
  }; // end autocomplete
  // Update slider - when a new champion is selected
  function updateSlider() {
    var slider = d3.select(".slider");
    var previousValue = parseInt(slider.node().value); // save previous value
    var subset = dataset.filter(function(d) { return d.champ1 == currChampionName; })
    var subset_max = d3.max(subset, function(d) { return d.n_games; });
    // Update slider to new min and max
    document.getElementById("slider").min = d3.min(subset, function(d) { return d.n_games; });
    document.getElementById("slider").max = subset_max;
    // Update slider text
    var newMin = document.getElementById("slider").min;
    if (previousValue < newMin) { // if previous is smaller than new/current min, change text
      document.getElementById("slider-instructions").innerHTML = "Show pairs with at least " +newMin+ " games played:"
    };
  };
  // Function to update champion - this only includes stuff when the champion is fixed
  function updateChampion(champ) {
    currChampionName = champ.replace("+ ", ""); // set champ name
    // Get average
    var avgDataRow = avg_data.filter(function(d) { return d.champ == currChampionName; })[0];
    currAvg = +(avgDataRow.winrate).toFixed(2);
    updateSlider();
    // update champ subset for now
    champ_subset = dataset.filter(function(d) { return d.champ1 == currChampionName; });
    // Update xScales
    updatexScale_play(champ_subset);
    // Update name text
    document.getElementById("champion-name").innerHTML = currChampionName;
    // Update icon image
    var iconURLname = currChampionName.replace("'", "");
    iconURLname = iconURLname.replace(".", "");
    iconURLname = iconURLname.replace(" ", "");
    document.getElementById("champion-icon").src = "icons/"+iconURLname+".png";
  }; // end update champion
  function updateData() {
    // Get subset
    champ_subset = dataset.filter(function(d) { return d.champ1 == currChampionName & d.n_games>=sliderValue; });
    if (sort == "win") { champ_subset.sort(function(a,b) { return d3.descending(a.winrate, b.winrate); }) }
    else if (sort == "alpha") { champ_subset.sort(function(a,b) { return d3.ascending(a.champ2, b.champ2); }) }
    else { champ_subset.sort(function(a,b) { return d3.descending(a.n_games, b.n_games); }) }
    // Update nPairs
    nPairs = champ_subset.length;
  }; // end update data
  // On click
  function updateClick() {
    dotGroup.on("mouseover", function(d) {
      var currElement = d3.select(this);
      var currPair = d.champ2;
      currElement.selectAll(".countLabel").style("fill", "black");
      currElement.select(".pairBar")
                 .style("fill", dotColor)
                 .style("opacity", 0.5);
      currElement.select(".dotDistance").style("opacity", 1);
      d3.selectAll(".pairNameText")
        .filter(function(d) { return d.champ2 == currPair; })
        .style("font-family", "radnika-bold");
    })
    .on("mouseout", function(d) {
      // Remove on click attributes for all (mainly previously clicked element)
      var currElement = d3.select(this);
      currElement.selectAll(".countLabel").style("fill", "none");
      currElement.select(".pairBar")
                 .style("fill", light_gray)
                 .style("opacity", 0.3);
      currElement.select(".dotDistance").style("opacity", 0.5);
      svg.selectAll(".pairNameText").style("font-family", "radnika-regular");
    }); // end on mouseout

    // When a name is selected
    nameGroup.on("click", function(d) {
      var newChampion = d3.select(this)._groups[0][0].textContent;
      updateChampion(newChampion);
      updateData();
      updateGraphic();
    })
    .on("mouseover", function(d) {
      var currElement = d3.select(this);
      currElement.select(".pairNameText").style("font-family", "radnika-bold");
      var currPair = d.champ2;

      var currDotGroup = svg.selectAll(".dotGroup")
                            .filter(function(d) { return d.champ2 == currPair; });

      currDotGroup.selectAll(".countLabel")
                  .style("fill", "black");
      currDotGroup.select(".pairBar")
                  .style("fill", dotColor)
                  .style("opacity", 0.5);
      currDotGroup.select(".dotDistance")
                  .style("opacity", 1);
    })
    .on("mouseout", function(d) {
      var currElement = d3.select(this);
      currElement.select(".pairNameText").style("font-family", "radnika-regular");
      var currPair = d.champ2;

      var currDotGroup = svg.selectAll(".dotGroup")
                            .filter(function(d) { return d.champ2 == currPair; });
      currDotGroup.selectAll(".countLabel")
                  .style("fill", "none");
      currDotGroup.select(".pairBar")
                  .style("fill", light_gray)
                  .style("opacity", 0.3);
      currDotGroup.select(".dotDistance")
                  .style("opacity", 0.5);
    })
  };
  // Resizing
  function updateSizing() {
    var currentHeight = margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs);
    document.getElementById("graphic-svg").style.height = (currentHeight+30) + "px";
  }
  // update button
  function updateButton(button) {
    // Update buttons
    var value = button._groups[0][0].value;
    // change button to selected styles
    button.style("background-color", d3.rgb(79,39,79)).style("color", "white");
    // assign other button
    if (value == "win") {
      d3.select("#button-alpha").style("background-color", "white").style("color", d3.rgb(79,39,79));
      d3.select("#button-play").style("background-color", "white").style("color", d3.rgb(79,39,79));
    }
    else if (value == "play") {
      d3.select("#button-alpha").style("background-color", "white").style("color", d3.rgb(79,39,79));
      d3.select("#button-win").style("background-color", "white").style("color", d3.rgb(79,39,79));
    }
    else if (value == "alpha") {
      d3.select("#button-win").style("background-color", "white").style("color", d3.rgb(79,39,79));
      d3.select("#button-play").style("background-color", "white").style("color", d3.rgb(79,39,79));
    }
  }; // end update button
  // Update when changes are made (like a click)
  function updateGraphic() {
    // Update groups and exit
    pairGroup = svg.selectAll(".pairGroup").data(champ_subset);
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
                 .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
                 .attr("width", w_dotLine+graphicMargin.btwn_names+margin.right)
                 .attr("height", graphicMargin.h_col);
    dotGroupEnter.append("rect")
                 .attr("class", "pairBar")
                 .attr("width", function(d) { return xScale_play(d.n_games);})
                 .attr("height", graphicMargin.h_col)
                 .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
                 .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i;})
                 .style("fill", light_gray)
                 .style("opacity", 0.3);
    nameGroupEnter.append("rect")
                   .attr("class", "background")
                   .attr("id", "nameBackground")
                   .attr("x", 0)
                   .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
                   .attr("width", graphicMargin.w_names)
                   .attr("height", graphicMargin.h_col);
    nameGroupEnter.append("text")
                   .attr("class", "pairNameText")
                   .text(function(d) { return "+ " + d.champ2; })
                   .attr("x", graphicMargin.w_names)
                   .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3; });
    dotGroupEnter.append("rect")
                  .attr("class", "dotDistance")
                  .attr("x", function(d) {
                    var winRate = +(d.winrate).toFixed(2)
                    if (winRate > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
                    else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2)); }
                  })
                  .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1; })
                  .attr("height", 2)
                  .attr("width", function(d) { return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg)); });
    dotGroupEnter.append("circle") // average dot
                 .attr("class", "avgDot")
                 .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); })
                 .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; })
                 .attr("r", 4)
                 .style("fill", highlightColor);
    dotGroupEnter.append("circle") // pair dot
                 .attr("class", "pairDot")
                 .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2)); })
                 .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; })
                 .attr("r", 4)
                 .style("fill", function(d) {
                   var roundedWin = +(d.winrate).toFixed(2);
                   if (roundedWin > currAvg) { return green; }
                   else if (roundedWin < currAvg) { return red; }
                   else { return dark_gray; }
                 });
    dotGroupEnter.append("text")
                 .attr("class", "countLabel")
                 .attr("id", "gamesCountLabel")
                 .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
                 .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
                 .text(function(d) { return d3.format(",")(d.n_games); })
                 .style("text-anchor", "start")
                 .style("fill", "none");
    dotGroupEnter.append("text")
                 .attr("class", "countLabel")
                 .attr("id", "avgCountLabel")
                 .attr("x", function(d) {
                   if (+(d.winrate).toFixed(2) > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8; }
                   else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
                 })
                 .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
                 .text(function(d) { return d3.format(".0%")(currAvg); })
                 .style("text-anchor", function(d) {
                   if (+(d.winrate).toFixed(2) > currAvg) { return "end"; }
                   else { return "start"; };
                 })
                 .style("fill", "none");
    dotGroupEnter.append("text")
                 .attr("class", "countLabel")
                 .attr("id", "pairCountLabel")
                 .attr("x", function(d) {
                   var roundedAvg = +(d.winrate).toFixed(2);
                   if (roundedAvg > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) + 8; }
                   else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) - 8; };
                 })
                 .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
                 .text(function(d) {
                   if (+d.winrate.toFixed(2)!=currAvg) { return d3.format(".0%")(d.winrate); }
                 })
                 .style("text-anchor", function(d) {
                   if (+(d.winrate).toFixed(2) > currAvg) { return "start"; }
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
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; });
    dotGroup.select(".pairBar")
              .attr("width", function(d) { return xScale_play(d.n_games); })
             .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
             .style("fill", light_gray)
             .style("opacity", 0.3);
    nameGroup.select("#nameBackground")
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
    nameGroup.select(".pairNameText")
             .text(function(d) { return "+ " + d.champ2; })
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3; })
             .style("font-family", "radnika-regular");
    dotGroup.select(".dotDistance")
              .attr("x", function(d) {
                var winRate = +(d.winrate).toFixed(2)
                if (winRate > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
                else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2)); }
              })
              .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1; })
              .attr("width", function(d) { return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg)); })
              .style("opacity", 0.5);
    dotGroup.select(".avgDot")
             .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); })
             .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; });
    dotGroup.select(".pairDot")
             .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2)); })
             .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; })
             .style("fill", function(d) {
               var roundedWin = +(d.winrate).toFixed(2);
               if (roundedWin > currAvg) { return green; }
               else if (roundedWin < currAvg) { return red; }
               else { return dark_gray; }
             });
    dotGroup.select("#gamesCountLabel")
             .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
             .text(function(d) { return d3.format(",")(d.n_games); })
             .style("text-anchor", "start")
             .style("fill", "none");
    dotGroup.select("#avgCountLabel")
            .attr("x", function(d) {
              if (+(d.winrate).toFixed(2) > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8; }
              else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
            })
            .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
            .text(function(d) { return d3.format(".0%")(currAvg); })
            .style("text-anchor", function(d) {
              if (+(d.winrate).toFixed(2) > currAvg) { return "end"; }
              else { return "start"; };
            })
            .style("fill", "none");
    dotGroup.select("#pairCountLabel")
             .attr("x", function(d) {
               var roundedAvg = +(d.winrate).toFixed(2);
               if (roundedAvg > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) + 8; }
               else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(roundedAvg) - 8; };
             })
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4; })
             .text(function(d) {
               if (+d.winrate.toFixed(2)!=currAvg) { return d3.format(".0%")(d.winrate); }
             })
             .style("text-anchor", function(d) {
               if (+(d.winrate).toFixed(2) > currAvg) { return "start"; }
               else { return "end"; };
             })
             .style("fill", "none");

     // Data labels
     var firstRow = champ_subset[0];
     var firstRowDist = xScale_win(+firstRow.winrate.toFixed(2))-xScale_win(currAvg);
     svg.select("#avgDataLabel")
         .text(currChampionName + "'s win rate")
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
         .call(wrapChampion)
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
             if (firstRowDist < 0) { return "end"; }
             else { return "start"; }
           }
           else { return "middle"; }
         });

     // Create line breaks
     svg.selectAll("breakline")
        .data(champ_subset.filter(function(d,i) { return (i+1)%5==0; }))
        .enter()
        .append("line")
        .attr("class", "breakline")
        .attr("x2", w_svg)
        .attr("y1", function(d,i) { return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2; })
        .attr("y2", function(d,i) { return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2; });
     updateClick();
     updateSizing();
  }; // end update graphic
  // Function for updating when there are resizing changes
  function updateGraphicResizing() {
    dotGroup.select("#dotBackground")
             .attr("x", graphicMargin.w_names)
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
             .attr("width", w_dotLine+graphicMargin.btwn_names+margin.right)
             .attr("height", graphicMargin.h_col);
    dotGroup.select(".pairBar")
             .attr("width", function(d) { return xScale_play(d.n_games); })
             .attr("height", graphicMargin.h_col)
             .attr("x", graphicMargin.w_names + graphicMargin.btwn_names)
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; });
    nameGroup.select("#nameBackground")
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i; })
             .attr("width", graphicMargin.w_names)
             .attr("height", graphicMargin.h_col);
    nameGroup.select(".pairNameText")
             .attr("x", graphicMargin.w_names)
             .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +3; });
    dotGroup.select(".dotDistance")
            .attr("x", function(d) {
              var winRate = +(d.winrate).toFixed(2)
              if (winRate > currAvg) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
              else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(winRate).toFixed(2)); }
            })
            .attr("y", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2-1; })
            .attr("width", function(d) { return Math.abs(xScale_win(+(d.winrate).toFixed(2))-xScale_win(currAvg)); });
    dotGroup.select(".avgDot")
             .attr("cx", function(d) { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); })
             .attr("cy", function(d,i) { return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2; });
    dotGroup.select(".pairDot")
             .attr("cx", function(d) {
               return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(+(d.winrate).toFixed(2));
             })
             .attr("cy", function(d,i) {
               return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2;
             });
    dotGroup.select("#gamesCountLabel")
             .attr("x", graphicMargin.w_names + graphicMargin.btwn_names + 5)
             .attr("y", function(d,i) {
               return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
             });
    dotGroup.select("#avgCountLabel")
             .attr("x", function(d) {
               if (+(d.winrate).toFixed(2) > currAvg) {
                 return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) - 8;
               }
               else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg) + 8; };
             })
             .attr("y", function(d,i) {
               return (graphicMargin.h_col+graphicMargin.h_btwn)*i + graphicMargin.h_col/2 +4;
             });
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
             });

    // Update
    svg.selectAll(".midline")
        .attr("x1", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
        .attr("x2", graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg))
        .attr("y2", margin.top + (graphicMargin.h_col + graphicMargin.h_btwn)*(nPairs-1) + graphicMargin.h_col/2);

     // Data labels
     var firstRow = champ_subset[0];
     var firstRowDist = xScale_win(+firstRow.winrate.toFixed(2))-xScale_win(currAvg);
     svg.select("#avgDataLabel")
         .text(currChampionName + "'s win rate")
         .attr("x", function() {
           if (Math.abs(firstRowDist) < 30) {
             if (firstRowDist < 0) { // if average is greater than winrate
               return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg)+5;
             }
             else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg)-5; }
           }
           else { return graphicMargin.w_names+graphicMargin.btwn_names+xScale_win(currAvg); }
         })
         .call(wrapChampion)
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
        .attr("x2", w_svg)
        .attr("y1", function(d,i) {
          return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
        })
        .attr("y2", function(d,i) {
          return margin.top + (graphicMargin.h_col+graphicMargin.h_btwn)*(i)*5 - graphicMargin.h_btwn/2;
        });
     updateClick();
  }; // end update graphic resizing
  // call setup once on page load
  setup();
  // call resize once on page load
  resize();
  // setup event listener to handle window resize
  window.addEventListener('resize', resize);
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
  // Search bar
  // champion names for search bar
  var championNameList = [];
  for (var i=0; i<(avg_data.length); i++) { // get a list of all champions
    championNameList.push(avg_data[i].champ);
  }; // end for loop
  autocomplete(document.getElementById("searchbar"), championNameList); // autocomplete function
}; // end init function

// Import data
function rowConverter(d) {
  return {
    champ1: d.champ1,
    champ2: d.champ2,
    winrate: parseFloat(d.winrate),
    n_games: parseInt(d.n_games)
  }
};
d3.csv('jungler_pair_long.csv', rowConverter, function(data) {
   dataset = data;
   init();
}); // end d3.csv function
