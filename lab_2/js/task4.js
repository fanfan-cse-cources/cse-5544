d3.csv("./output/stock/moving_avg.csv", function (data) {
    let svg = d3.select("svg"),
        margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    const parseTime = d3.timeParse("%m/%d/%Y")

    let x = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return parseTime(d["Date"])
        }))
        .rangeRound([0, width - 100])

    let y = d3.scaleLinear()
        .domain([80, 350])
        .range([height - 100, 0])

    let yAxis = d3.axisLeft(y).ticks(12)
    let xAxis = d3.axisBottom(x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%B'))


    const subgroups = data.columns.slice(1,)

    let dataReady = subgroups.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            name: grpName,
            values: data.map(function (d) {
                return {time: d["Date"], value: +d[grpName]}
            })
        };
    });

    svg.append('g')
        .attr("transform", "translate(75, " + height + ")")
        .call(xAxis);

    svg.append('g')
        .attr("transform", "translate(75, 100)")
        .call(yAxis)
        .append("text")
        .attr("fill", "black")
        .attr("y", 6)
        .attr("dy", "-1em")
        .attr("text-anchor", "end")
        .text("Price ($)")

    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e0e0e2ff', '#81d2c7ff', '#b5bad0ff', '#7389aeff', '#416788ff'])

    let line = d3.line()
        .x(function (d) {
            return x(+parseTime(d.time))
        })
        .y(function (d) {
            return y(+d.value)
        })

    svg.selectAll("svg")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return line(d.values)
        })
        .attr("stroke", function (d) {
            return color(d.name)
        })
        .style("stroke-width", 2)
        .style("fill", "none")
        .attr("transform", "translate(75, 100)")

    svg.selectAll("svg")
        .data(subgroups)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function (d, i) {
            return 100 + i * 25
        })
        .attr("r", 7)
        .style("fill", function (d) {
            return color(d)
        })
        .attr("transform", "translate(400, 100)")

    svg.selectAll("svg")
        .data(subgroups)
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function (d, i) {
            return 100 + i * 25
        })
        .style("fill", function (d) {
            return color(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .attr("transform", "translate(400, 100)")
})
