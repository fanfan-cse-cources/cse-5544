d3.csv("./output/energy_2021_MSG.csv", function (data) {
    const margin = {top: 20, right: 50, bottom: 20, left: 50},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    const svg = d3.select("#bar").append("svg")
        .attr("width", 650)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    const month = [...Array(12).keys()].map(i => i + 1);
    const usTotalGen = [];

    month.forEach(function (m) {
        data.forEach(function (item) {
            if (item['STATE'] === 'US-TOTAL' && parseInt(item['MONTH']) === m) {
                usTotalGen.push(parseFloat(item['GENERATION(Mwh)']));
                console.log(item);
            }
        });
    })

    const maxNumber = Math.max.apply(Math, usTotalGen) + 1000000;
    const y = d3.scaleLinear()
        .domain([0, maxNumber])
        .range([height, 0]);

    const x = d3.scaleBand()
        .domain(month)
        .range([0, width])
        .paddingOuter(0.33)
        .paddingInner(0.33);

    const yAxis = d3.axisLeft(y).ticks(6);
    const xAxis = d3.axisBottom(x);

    svg.append('g')
        .attr("transform", "translate(75, 0)")
        .call(yAxis);

    svg.append('g')
        .attr("transform", "translate(75, " + height + ")")
        .call(xAxis);

    const bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            if (d['STATE'] === 'US-TOTAL') {
                return "translate(" + x(d['MONTH']) + "," + y(d['GENERATION(Mwh)']) + ")";
            }
        });

    bar.append("rect")
        .attr("x", 75)
        .attr("width", function () {
            return x.bandwidth();
        })
        .attr("height", function (d) {
            if (d['STATE'] === 'US-TOTAL') {
                return height - y(d['GENERATION(Mwh)']);
            }
        })
})
