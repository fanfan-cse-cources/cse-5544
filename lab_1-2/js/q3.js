d3.csv("data/q3.csv", drawHist);

function drawHist(error, points) {
    let svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + (margin.left + 75) + "," + margin.top + ")");

    const array = Object.values(points);

    let val = []

    for (let i = 0; i < array.length; i++) {
        if (array[i].value) {
            val[i] = array[i].value;
        }
    }

    let maxNumber = Math.max.apply(Math, val);

    let x = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([0, width - 200]);

    let y = d3.scaleLinear()
        .domain([-4, 2])
        .range([0, height]);

    let yAxis = d3.axisLeft(y).ticks(8);
    let xAxis = d3.axisBottom(x);

    svg.append('g')
        .attr("transform", "translate(75, " +  30 + ")")
        .call(yAxis);

    svg.append('g')
        .attr("transform", "translate(75, " + (height + 30) + ")")
        .call(xAxis);

    const top = -245
    let current = top + 70

    let bar = svg.selectAll(".bar")
        .data(points)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            current = current + 75;
            console.log(current)
            return "translate(-5," + (current) + ")";
        });

    bar.append("rect")
        .data(points)
        .attr("x", 80)
        .attr("y", function () {
            return current + 5;
        })
        .attr("width", function (d) {
            console.log(d.value)
            return y(d.value) / 50;
        })
        .attr("height", 75)
}
