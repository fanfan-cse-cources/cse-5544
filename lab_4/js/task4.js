d3.csv("./output/energy_2021_MT_TS.csv", function (data) {
    const margin = {top: 20, right: 50, bottom: 20, left: 50},
        width = 800 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    let svg = d3.select("#pie").append("svg")
        .attr("width", 900)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    let subgroups = []
    let counter = 0
    let total = 0
    let totalData = []

    for (let i = 0; i < data.length; i++) {
        if (data[i]['STATE'] === 'US-TOTAL') {
            totalData.push(data[i])
            subgroups[counter] = data[i]["TYPE OF PRODUCER"];
            total += Number(data[i]["GENERATION(Mwh)"]);
            counter += 1;
        }
    }

    let percentage = {}
    for (let i = 0; i < totalData.length; i++) {
        percentage[totalData[i]["TYPE OF PRODUCER"]] = Math.round(Number(totalData[i]["GENERATION(Mwh)"]) / total * 100 * 100) / 100
    }

    const colors = ['#e0e0e2ff', '#81d2c7ff', '#b5bad0ff', '#7389aeff', '#416788ff']
    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors)

    let pieGenerator = d3.pie()
        .value(function (d) {
            if (d['STATE'] === 'US-TOTAL') {
                return d["GENERATION(Mwh)"]
            }
        })
        .sort(function (a, b) {
            return a["TYPE OF PRODUCER"].localeCompare(b["TYPE OF PRODUCER"])
        })
    let arcData = pieGenerator(totalData)

    let arcGenerator = d3.arc()
        .innerRadius(50)
        .outerRadius(150)

    d3.select('#pie g')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d, i) {
            return colors[i]
        })
        .attr("transform", "translate(200, 150)")

    svg.selectAll("#pie svg")
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
        .attr("transform", "translate(350, 0)")

    svg.selectAll("#pie svg")
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
        .attr("transform", "translate(350, 0)")
})
