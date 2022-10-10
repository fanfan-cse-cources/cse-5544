d3.csv("./output/energy/top3_year_energy_oh.csv", function (data) {
    let svg = d3.select("svg"),
        margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom

    const array = Object.values(data);
    let years = []

    let current_pos = -1
    let current_year = 0
    let data_points = []

    for (let i = 0; i < array.length; i++) {
        if (array[i]["YEAR"]) {
            if (current_year !== array[i]["YEAR"]) {
                years[years.length] = array[i]["YEAR"]
                current_pos += 1
            }

            const generation = Number(array[i]["GENERATION (Megawatthours)"])
            const source = array[i]["ENERGY SOURCE"]

            if (array[i]["YEAR"] !== current_year) {
                current_year = array[i]["YEAR"]
                data_points[current_pos] = {year: current_year}
            }

            data_points[current_pos][source] = generation
        }
    }

    const maxNumber = 150000000;

    let y = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([height, 0]);

    let x = d3.scaleBand()
        .domain(years)
        .range([0, width - 200])
        .paddingOuter(0.33)
        .paddingInner(0.33);

    let yAxis = d3.axisLeft(y).ticks(3);
    let xAxis = d3.axisBottom(x);

    svg.append('g')
        .attr("transform", "translate(75, 20)")
        .call(yAxis)
        .append("text")
        .attr("fill", "black")
        .attr("y", 6)
        .attr("dx", "8em")
        .attr("dy", "-1.5em")
        .attr("text-anchor", "end")
        .text("GENERATION (Megawatthours)");

    svg.append('g')
        .attr("transform", "translate(75, " + (height + 20) + ")")
        .call(xAxis);

    let stack = d3.stack()
        .keys(["Coal", "Nuclear", "Natural Gas"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    let stackedData = stack(data_points);

    let subgroups = ["Coal", "Nuclear", "Natural Gas"]

    let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#322F20', '#988F2A', '#FE5F00'])

    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {
            return color(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d['data']['year']);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .attr("transform", "translate(75, 20)")

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
        .attr("transform", "translate(400, -80)")

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
        .attr("transform", "translate(400, -80)")
});
