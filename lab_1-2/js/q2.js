d3.csv("data/q2.csv", drawHist);

function drawHist(error, points) {
    let svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + (margin.left + 75) + "," + margin.top + ")");

    let parseTime = d3.timeParse("%a-%d");
    let x = d3.scaleTime()
        .domain(d3.extent(points, function (d) {
            return parseTime(d.day);
        }))
        .rangeRound([0, width - 200]);

    let y = d3.scaleLinear()
        .domain(d3.extent(points, function (d) {
            return d.value;
        }))
        .range([height, 0]);

    let yAxis = d3.axisLeft(y).ticks(8);
    let xAxis = d3.axisBottom(x).ticks(6);

    d3.select('#wrapper')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return x(parseTime(d.day));
        })
        .attr('cy', function (d) {
            return y(d.value);
        })
        .attr('r', 5)
        .attr("transform", "translate(-175, -220)");

    svg.append('g')
        .attr("transform", "translate(75, 30)")
        .call(yAxis)
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    svg.append('g')
        .attr("transform", "translate(75, " + (height + 30) + ")")
        .call(xAxis);

    let lineGenerator = d3.line()
        .x(function (d) {
            return x(parseTime(d.day));
        })
        .y(function (d) {
            return y(d.value);
        });

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", lineGenerator(points))
        .attr("transform", "translate(75, " + 30 + ")");
}
