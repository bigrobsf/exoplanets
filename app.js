/* jslint esversion:6 */

document.addEventListener("DOMContentLoaded", function() {
  barChart(); // default chart

  d3.select("select").on("change", function() {
    let choice = d3.select("select").property("value");
    d3.select("svg").selectAll("*").remove();

    if (choice === "scatter") {
      scatterPlot();
    } else if (choice === "stacked") {
      stackedBar();
    } else {
      barChart();
    }
  });
});
