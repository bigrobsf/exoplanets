/* jslint esversion:6 */

function scatterPlot() {
  var svg = d3.select("svg");
  var width = +svg.attr("width");
  var height = +svg.attr("height");

  var padding = 60;

  d3.select('.plot-notes')
    .classed('hidden', false);

  d3.select('.stacked-notes')
    .classed('hidden', true);

  d3.select('.bar-notes')
    .classed('hidden', true);

  d3.csv('exomultpars.csv', function(row) {
      return {
        discoveryMethod: row["mpl_discmethod"],
        periodDays: row["mpl_orbper"] || 'N/A',
        distAu: row["mpl_orbsmax"] || 'N/A',
        name: row["mpl_name"],
        massEarths: +row["mpl_masse"],
        radiusEarths: +row["mpl_rade"],
        yearFound: row["mpl_disc"],
        starDist: +row["st_dist"] * 3.26156
      };
    },
      function(error, data) {
      if (error) throw error;

      var fillScale = d3.scalePow().exponent(0.5)
                        .domain(d3.extent(data, d => d.massEarths))
                        .range(['white', '#004d40']);

      var radiusScale = d3.scaleLinear()
                          .domain(d3.extent(data, d => d.radiusEarths))
                          .range([2, 20]);

      var xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.yearFound))
                     .range([padding, width - padding]);

      var yScale = d3.scalePow().exponent(0.5)
                     .domain(d3.extent(data, d => d.starDist))
                     .range([height - padding, padding]);

      var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));

      var yAxis = d3.axisLeft(yScale);

      svg
        .append("text")
          .text("Exoplanets Found by Year")
          .attr("x", width / 2)
          .attr("y", 20)
          .style("text-anchor", "middle")
          .style("font-size", "16px")
          .style("font-weight", "bold");

      svg
        .append("text")
          .text(`There are ${data.length} known explanets.`)
          .attr("x", width / 2)
          .attr("y", 40)
          .style("text-anchor", "middle")
          .style("font-size", "12px");

      svg
        .append("text")
          .text("Distance in light-years")
          .attr("x", 0)
          .attr("y", 50)
          .style("text-anchor", "left")
          .style("font-size", "14px");


      svg
        .append("text")
          .text("Year of discovery")
          .attr("x", width / 2)
          .attr("y", height - 5)
          .style("text-anchor", "middle")
          .style("font-size", "14px");

      svg
        .append("g")
          .attr("transform", "translate(0, " + (height - padding + 10) + ")")
          .call(xAxis);

      svg
        .append("g")
          .attr("transform", "translate(40, 0)")
          .call(yAxis);

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cy", d => yScale(d.starDist))
          .attr("cx", d => xScale(d.yearFound))
          .attr("fill", d => fillScale(d.massEarths))
          .style("stroke", function(d) {
            return d.starDist === 0 ? "#ff5722" : "black";
          })
          .on("mousemove", showTooltip)
          .on("touchstart", showTooltip)
          .on("mouseout", function() {
            d3.select(".tooltip")
                .style("opacity", 0);
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .attr("r", d => radiusScale(d.radiusEarths));


    function showTooltip(d) {
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("top", d3.event.y + 20 + "px")
          .style("left", d3.event.x - 80 + "px")
          .html(`
            <p>${d.name}</p>
            <p>Year in Earth days: ${d.periodDays}</p>
            <p>Radius (Earth = 1): ${d.radiusEarths !== 0 ? d.radiusEarths : 'N/A'}</p>
            <p>Mass (Earth = 1): ${d.massEarths !== 0 ? d.massEarths : 'N/A'}</p>
            <p>Orbital dist in AU: ${d.distAu}</p>
            <p>Distance in light-years: ${d.starDist !== 0 ? (d.starDist).toFixed(2) : 'N/A'}</p>
          `);
    }
  });
}
