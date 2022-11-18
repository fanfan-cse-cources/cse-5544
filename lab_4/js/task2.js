function drawUSMap (data, task3DataLoaded, task4DataLoaded) {
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

    const hoverInfo = d3.select('#us_map')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'position-absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '2px')
      .style('padding', '2px')
      .attr('data-html', 'true')

    const mouseMove = function (d) {
      hoverInfo.html(`${d.properties.name} <br />Generation: ${parseInt(d.generation)}`)
        .style('left', (d3.event.x + 30) + 'px')
        .style('top', (d3.event.y) + 'px')
    }
    const mouseOver = function (d) {
      hoverInfo.style('opacity', 1)
    }
    const mouthLeave = function (d) {
      hoverInfo.style('opacity', 0)
    }
    const mouseClick = function (d) {
      let stateCode

      for (const i in data) {
        if (data[i].State === d.properties.name) {
          stateCode = data[i]['State Code']
        }
      }

      d3.selectAll('.state').style('stroke', '#aaa')
      d3.select(this).style('stroke', 'red')
      updateBar(task3DataLoaded, stateCode)
      updatePie(task4DataLoaded, stateCode)
    }

    const statePath = svg.selectAll('path')
      .data(states.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'state')
      .style('fill', function (d) {
        return colorScale(d.generation)
      })
      .on('mousemove', mouseMove)
      .on('mouseover', mouseOver)
      .on('mouseleave', mouthLeave)
      .on('click', mouseClick)

    const zoom = d3.zoom()
      .scaleExtent([1, 5])
      .on('zoom', zoomed)

    function zoomed () {
      statePath.attr('transform', d3.event.transform)
    }
    svg.call(zoom)

    svg.selectAll('.state').style('stroke', '#aaa')

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
