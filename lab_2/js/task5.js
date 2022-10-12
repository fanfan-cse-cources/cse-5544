d3.csv("./output/stock/stock_prices.csv", function (data) {
    let svg = d3.select("svg"),
        margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    const subgroups = data.columns.slice(2,)

    const colors = ['#e0e0e2ff', '#81d2c7ff', '#b5bad0ff', '#7389aeff', '#416788ff']
    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colors)

    let x = d3.scaleLinear()
        .domain([11000 - 200, 17000])
        .range([0, width - 100])

    let prices = []
    let y = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
                for (let i = 0; i < subgroups.length; i++) {
                    prices[i] = d[subgroups[i]] - 30
                }

                return d3.min(prices)
            }), d3.max(data, function (d) {
                return d3.max(prices) + 30
            })]
        )
        .range([height - 100, 0])

    let yAxis = d3.axisLeft(y)
    let xAxis = d3.axisBottom(x).ticks(10)

    svg.append('g')
        .attr("transform", "translate(75, " + (height) + ")")
        .call(xAxis)
        .append("text")
        .attr("fill", "black")
        .attr("x", "65em")
        .attr("dy", "3em")
        .attr("text-anchor", "end")
        .text("Nasdaq 100 Price($)")

    svg.append('g')
        .attr("transform", "translate(75, 100)")
        .call(yAxis)
        .append("text")
        .attr("fill", "black")
        .attr("y", 6)
        .attr("dy", "-1em")
        .attr("text-anchor", "end")
        .text("Price ($)")

    for (let i = 0; i < subgroups.length; i++) {
        svg.append('g').selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cx', d => x(d["NDX_price"]))
            .attr('cy', d => y(d[subgroups[i]]))
            .attr('r', '3')
            .style("fill", function (d) {
                return colors[i]
            })
            .attr("transform", "translate(75, 100)")
    }

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
        .attr("transform", "translate(500, 100)")

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
            return d.replace("_price", "")
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .attr("transform", "translate(500, 100)")
})
