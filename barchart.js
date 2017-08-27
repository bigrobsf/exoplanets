/* jslint esversion:6 */

function barChart() {
  d3.select('.plot-notes')
    .classed('hidden', true);

  d3.select('.stacked-notes')
    .classed('hidden', true);

  d3.select('.bar-notes')
    .classed('hidden', false);

  var svg = d3.select("svg"),
      margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

      var x = d3.scaleBand()
                .rangeRound([0, width]).padding(0.1);

      var y = d3.scaleLinear()
                .rangeRound([height, 0]);

      var g = svg.append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.csv('detection_data.csv', function(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;

        },

        function(error, data) {
          if (error) throw error;

          var keys = data.columns.slice(1);

          x.domain(data.map(function(d) { return d.Year; }));
          y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis--y")
        .attr("transform", "translate(" + width + ", 0)")
        .call(d3.axisRight(y).ticks())
      .append("text")
        .attr("x", -80)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.5em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Detections");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Year); })
        .attr("y", function(d) { return y(d.total); })
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on("mousemove", showTooltip)
        .on("touchstart", showTooltip)
        .on("mouseout", function() {
          d3.select(".tooltip")
          .style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return height - y(d.total); });

    svg
      .append("text")
        .text("Number of Detected Exoplanets by Year")
        .attr("x", width / 2)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold");

    function showTooltip(d) {
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("top", d3.event.y + 20 + "px")
          .style("left", d3.event.x - 20 + "px")
          .html(`
            <p>Count for ${d.Year}: ${d.total}</p>
          `);
    }



  });
}
