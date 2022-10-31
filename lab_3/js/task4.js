d3.json("./output/region_state.json", function (data) {
    const margin = {top: 20, right: 50, bottom: 20, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    const svg = d3.select("#state_tree").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "p-6")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    const root = d3.hierarchy(data).sum(function (d) {
        return d['value'];
    });

    d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)
        (root);

    const color = d3.scaleOrdinal()
        .domain(["Midwest", "Northeast", "South", "West"])
        .range(["steelblue", "orange", "green", "red"]);

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) {
            return d['x0'];
        })
        .attr('y', function (d) {
            return d['y0'];
        })
        .attr('width', function (d) {
            return d['x1'] - d['x0'];
        })
        .attr('height', function (d) {
            return d['y1'] - d['y0'];
        })
        .style("stroke", "black")
        .style("fill", function (d) {
            return color(d['parent']['data']['name'])
        });

    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) {
            return (d['x0'] + d['x1']) / 2
        })    // +10 to adjust position (more right)
        .attr("y", function (d) {
            return (d['y0'] + d['y1']) / 2
        })    // +20 to adjust position (lower)
        .text(function (d) {
            return d['data']['name']
        })
        .attr("font-size", "12px")
        .attr("fill", "black");

    svg.selectAll("titles")
        .data(root.descendants().filter(function (d) {
            return d.depth === 1
        }))
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d['x0']
        })
        .attr("y", function (d) {
            return d['y0'] + 21
        })
        .text(function (d) {
            return d['data']['name']
        })
        .attr("font-size", "19px")
        .attr("fill", function (d) {
            return color(d['data']['name'])
        })

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("2021 Electricity Generation Treemap");
})
