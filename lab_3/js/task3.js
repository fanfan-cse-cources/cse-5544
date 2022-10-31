d3.csv("./output/energy_2021_selected_states.csv", function (month_data) {
    const margin = {top: 20, right: 50, bottom: 20, left: 50},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    const svg = d3.select("#state_heat").append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const month = [...Array(12).keys()].map(i => i + 1);
    const states_set = new Set()
    for (let i = 0; i < month_data.length; i++) {
        states_set.add(month_data[i]['STATE']);
    }
    const states = [...states_set].reverse();

    const min = 4000000;
    const max = 18000000;

    const x_scale = d3.scaleBand().domain(month).range([10, width]).paddingOuter(0).paddingInner(0);
    const x_axis = d3.axisBottom().scale(x_scale).tickSize(0);
    svg.append('g').attr('transform', 'translate(' + [0, height] + ')').call(x_axis);

    const y_scale = d3.scaleBand().domain(states).range([10, height]).paddingOuter(0).paddingInner(0);
    const y_axis = d3.axisLeft().scale(y_scale).tickSize(0);
    svg.append('g').attr('transform', 'translate(' + [10, 0] + ')').call(y_axis);

    const color_scale = d3.scaleSequential().domain([max, min]).interpolator(d3.interpolateRdBu);

    const legend = svg.append("g");
    const value_scale = d3.scaleLinear().domain([min, max]).range([height, 0]);
    const legend_axis = d3.axisRight().scale(value_scale).ticks(10);
    svg.append('g').attr('transform', 'translate(' + [width + 25, 0] + ')').call(legend_axis);

    const color = d3.scaleSequential()
        .domain([0, height])
        .interpolator(d3.interpolateRdBu);

    const lg = legend.append('linearGradient')
        .attr('id', 'gradient_2')
        .attr('x1', '100%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '100%');

    const level = 4;
    for (let i = 0; i <= level; i++) {
        lg.append('stop')
            .attr('offset', (100 * i / level).toString() + '%')
            .attr('stop-color', color(height * i / level));
    }

    svg.selectAll("rect")
        .data(month_data)
        .enter().append("rect")
        .attr("x", function (d) {
            return x_scale(parseInt(d['MONTH']));
        })
        .attr("y", function (d) {
            return y_scale(d['STATE']);
        })
        .attr("width", width / month.length)
        .attr("height", height / states.length)
        .style('fill', function (d) {
            return color_scale(d['GENERATION (Megawatthours)']);
        })
        .style("stroke", "white");

    legend.append('rect')
        .attr('x', width + 10)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', height)
        .style("fill", "url(#gradient_2)");

    svg.append("text")
        .attr("x", ((width + 15) / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("2021 Monthly Electricity Generation Heatmap");
})
