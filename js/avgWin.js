var rowConverter = function(d) {
  return {
    champion: d.champion,
    queueid: parseInt(d.queueid),
    ngames: parseInt(d.ngames),
    nwins: parseInt(d.nwins),
    nkills: parseInt(d.nkills),
    ndeaths: parseInt(d.ndeaths),
    nassists: parseInt(d.nassists),
    totalminionskilled: parseInt(d.totalminionskilled),
    neutralminionskilled: parseInt(d.neutralminionskilled),
    avgdamagedealtchampions: parseInt(d.avgdamagedealtchampions),
    role: d.role,
    broad_role: d.broad_role
  };
};

var avg_data;

d3.csv('data/champion_stats_by_queue.csv', rowConverter, function(data) {

  avg_data = data;

}); 
