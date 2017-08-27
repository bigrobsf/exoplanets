/* jslint esversion:6 */

function stackedBar() {

  d3.select('.plot-notes')
    .classed('hidden', true);

  d3.select('.stacked-notes')
    .classed('hidden', false);

  d3.select('.bar-notes')
    .classed('hidden', true);

  var svg = d3.select("svg"),
    margin = {top: 20, right: 40, bottom: 30, left: 20},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
            .rangeRound([0, width]).padding(0.1);

  var y = d3.scalePow().exponent(0.7)
            .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
            .range(["#ea80fc", "#b388ff", "#8c9eff", "#80d8ff", "#a7ffeb",
                    "#b9f6ca", "#f4ff81", "#ffd180", "#ff9e80", "#ff5252"]);

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
      z.domain(keys);

      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
          .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return x(d.data.Year); })
          .attr("y", function(d) { return y(d[1]); })
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
          .attr("height", function(d) { return y(d[0]) - y(d[1]); });

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(" + width + ", 0)")
              .call(d3.axisRight(y))
            .append("text")
              .attr("x", -80)
              .attr("y", y(y.ticks().pop()) + 0.5)
              .attr("dy", "0.32em")
              .attr("fill", "#000")
              .attr("font-weight", "bold")
              .attr("text-anchor", "start")
              .text("Detections");

          svg
            .append("text")
              .text("Detected Exoplanets by Method by Year")
              .attr("x", width / 2)
              .attr("y", 20)
              .style("text-anchor", "middle")
              .style("font-size", "16px")
              .style("font-weight", "bold");

          var legend = g.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 100) + ")"; });

          legend.append("rect")
              .attr("x", 125)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", z);

          legend.append("text")
              .attr("x", 115)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .text(function(d) { return d; });

          function showTooltip(d) {
            d3.select(".tooltip")
                .style("opacity", 1)
                .style("top", d3.event.y + 20 + "px")
                .style("left", d3.event.x - 20 + "px")
                .html(`
                  <p>Total count for ${d.data.Year}: ${d.data.total}</p>
                  <p>Method count: ${d[1] - d[0]}</p>
                `);
          }
    }
  );
}
