document.addEventListener("DOMContentLoaded", function () {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
    true
  );
  req.send();
  req.onload = function () {
    const dataset = JSON.parse(req.responseText);

    const w = 800;
    const h = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 45 };
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;

    const timeFormat = d3.timeFormat('%M:%S');

    console.log(dataset);
    console.log(dataset[0].Seconds);
    console.log(new Date(dataset[0].Year))

    dataset.forEach(function (d) {
      let parsedTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
    })

    console.log(new Date(dataset[0].Time))

    const xScale = d3
      .scaleTime()
      .domain([d3.timeYear.offset(d3.min(dataset, (d) => new Date((d.Year).toString()), (d) => d.inspected_at), - 1),
      d3.timeYear.offset(d3.max(dataset, (d) => new Date((d.Year).toString()), (d) => d.inspected_at), + 1)])
      .range([margin.left, w - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.max(dataset, (d) => new Date(d.Time)), d3.min(dataset, (d) => new Date(d.Time))])
      .range([h - margin.bottom, margin.top]);

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    d3.select("svg")
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date((d.Year).toString())))
      .attr("cy", (d) => yScale(new Date(d.Time)))
      .attr("r", (d) => 6)
      .style("fill", (d) => d.Doping.length > 3 ? "firebrick" : "darkgreen")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => new Date((d.Year).toString()))
      .attr("data-yvalue", (d) => new Date(d.Time))
      .on("mouseover", function (d, i) {
        tooltip
          .html(i.Name + ":" + i.Nationality + "<br>"
            + "Year: " + i.Year + ", Time: " + (i.Time).toString().slice(19, 24) + "<br><br>"
            + i.Doping)
          .attr("data-year", new Date((i.Year).toString()))
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 50 + "px");
        tooltip.style("opacity", 0.9);
        tooltip.attr("id", "tooltip");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    /*
        svg.selectAll("text")
           .data(dataset)
           .enter()
           .append("text")
           .text((d) =>  (d[0] + "," + d[1]))
           .attr("x", (d) => xScale(d[0] + 10))
           .attr("y", (d) => yScale(d[1]))
    
           */

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth - 3)
      .tickFormat("")
      .ticks(10);

    svg
      .append("g")
      .attr("class", "y-axis-grid")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxisGrid)
      .style("opacity", 0.2);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(630, 173)`)
      
    svg.select("#legend").append("circle").attr("cx", 0).attr("cy", 0).attr("r", 6).style("fill", "seagreen").style("opacity", 0.6)
    svg.select("#legend").append("circle").attr("cx", 0).attr("cy", 17).attr("r", 6).style("fill", "firebrick").style("opacity", 0.6);
    svg.select("#legend").append("text").attr("x", 10).attr("y", 2).text("No doping").style("font-size", "12px").attr("alignment-baseline", "middle")
    svg.select("#legend").append("text").attr("x", 10).attr("y", 19).text("Doping Allegations").style("font-size", "12px").attr("alignment-baseline", "middle")

  };
});
