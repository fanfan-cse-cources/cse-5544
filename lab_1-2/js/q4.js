d3.csv("data/q4.csv", drawHist);

function drawHist(error, points) {
    const colors = ['#e0e0e2ff', '#81d2c7ff', '#b5bad0ff', '#7389aeff', '#416788ff'];
    let fruit = []
    let val = []

    console.log(points)

    const array = Object.values(points);
    for (let i = 0; i < array.length; i++) {
        if (array[i].value) {
            fruit[i] = array[i].fruit;
            val[i] = array[i].value;
        }
    }

    console.log(val)

    // let data = [10, 40, 30, 20, 60, 80];
    let pieGenerator = d3.pie()
        .value(function (d) {
            return d.value;
        })
        .sort(function (a, b) {
            return a.fruit.localeCompare(b.fruit);
        });
    let arcData = pieGenerator(points);

    let arcGenerator = d3.arc()
        .innerRadius(50)
        .outerRadius(200);

    d3.select('g')
        .selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function (d, i) {
            return colors[i];
        });
    // .attr('style', 'fill: red;');

    d3.select('g')
        .selectAll('text')
        .data(arcData)
        .enter()
        .append('text')
        .each(function (d) {
            let centroid = arcGenerator.centroid(d);
            d3.select(this)
                .attr('x', centroid[0])
                .attr('y', centroid[1])
                .attr('dy', '0.33em')
                .text(d.data.fruit);
        });
}
