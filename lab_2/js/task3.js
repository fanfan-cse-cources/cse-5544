d3.csv("./output/energy/type_producer_generation.csv", function (data) {
    let svg = d3.select("svg"),
        margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    let subgroups = []
    let total = 0

    for (let i = 0; i < data.length; i++) {
        subgroups[i] = data[i]["TYPE OF PRODUCER"]
        total += Number(data[i]["GENERATION (Megawatthours)"])
    }

    let percentage = {}
    for (let i = 0; i < data.length; i++) {
        percentage[data[i]["TYPE OF PRODUCER"]] = Math.round(Number(data[i]["GENERATION (Megawatthours)"]) / total * 100 * 100) / 100
    }

    const colors = ['#e0e0e2ff', '#81d2c7ff', '#b5bad0ff', '#7389aeff', '#416788ff']
    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors)

    let pieGenerator = d3.pie()
        .value(function (d) {
            return d["GENERATION (Megawatthours)"]
        })
        .sort(function (a, b) {
            return a["TYPE OF PRODUCER"].localeCompare(b["TYPE OF PRODUCER"])
        })
    let arcData = pieGenerator(data)

    let arcGenerator = d3.arc()
        .innerRadius(50)
        .outerRadius(200)

    d3.select('g')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d, i) {
            return colors[i]
        })

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
        .attr("transform", "translate(0, 400)")

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
            return d + " " + percentage[d] + "%"
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .attr("transform", "translate(0, 400)")
})
