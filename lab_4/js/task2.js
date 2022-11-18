function drawUSMap (data) {
  const margin = { top: 20, right: 50, bottom: 20, left: 50 }
  const width = 600 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const svg = d3.select('#us_map').append('svg')
    .attr('width', 650)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + margin.top + ')')

  d3.json('./dataset/us-states.json', function (error, states) {
    const proj = d3.geoAlbersUsa()
      .fitExtent([[0, 0], [width, height]], states)
    const path = d3.geoPath().projection(proj)
    const legend = svg.append('g')

    const max = 500000000

    const colorScale = d3.scaleSequential()
      .domain([0, max])
      .interpolator(d3.interpolateBlues)

    states.features.forEach(function (obj) {
      const name = obj.properties.name
      for (let i = 0; i < data.length; i++) {
        if (data[i].State === name) {
          obj.generation = data[i]['GENERATION (Megawatthours)']
        }
      }
    })

    const mouthLeave = function (d) {
      d3.selectAll('.state')
        .transition()
        .duration(200)
        .style('opacity', 1)
    }
    const mouseOver = function (d) {
      d3.selectAll('.state')
        .transition()
        .duration(200)
        .style('opacity', 0.7)
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
    }

    svg.selectAll('path')
      .data(states.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'state')
      .style('fill', function (d) {
        return colorScale(d.generation)
      })
      .on('mouseover', mouseOver)
      .on('mouseleave', mouthLeave)

    const color = d3.scaleSequential()
      .domain([0, height])
      .interpolator(d3.interpolateBlues)

    const scale = d3.scaleLinear().domain([0, max]).range([height, 0])
    const yAxis = d3.axisRight().scale(scale).ticks(10)
    svg.append('g').attr('transform', 'translate(' + [width + 25, 0] + ')').call(yAxis)

    const lg = legend.append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('x2', '100%')
      .attr('y1', '100%')
      .attr('y2', '0%')

    const level = 4
    for (let i = 0; i <= level; i++) {
      lg.append('stop')
        .attr('offset', (100 * i / level).toString() + '%')
        .attr('stop-color', color(height * i / level))
    }

    legend.append('rect')
      .attr('x', width + 10)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', height)
      .style('fill', 'url(#gradient)')

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('2021 Electricity Generation on Map')
      .attr('transform', 'translate(0, 0)')
  })
}
