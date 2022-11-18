function drawBar (data, currentState) {
  const margin = { top: 20, right: 50, bottom: 20, left: 50 }
  const width = 600 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const svg = d3.select('#bar').append('svg')
    .attr('width', 650)
    .attr('height', 450)
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + margin.top + ')')

  const month = [...Array(12).keys()].map(i => i + 1)
  const usTotalGen = []

  month.forEach(function (m) {
    data.forEach(function (item) {
      if (item.STATE === currentState && parseInt(item.MONTH) === m) {
        usTotalGen.push(parseFloat(item['GENERATION(Mwh)']))
      }
    })
  })

  const maxNumber = Math.max.apply(Math, usTotalGen) + 1000000
  const y = d3.scaleLinear()
    .domain([0, maxNumber])
    .range([height + 20, 0])

  const x = d3.scaleBand()
    .domain(month)
    .range([0, width])
    .paddingOuter(0.33)
    .paddingInner(0.33)

  const yAxis = d3.axisLeft(y).ticks(6)
  const xAxis = d3.axisBottom(x)

  svg.append('g')
    .attr('transform', 'translate(75, 0)')
    .call(yAxis)

  svg.append('g')
    .attr('transform', 'translate(75, ' + (height + 20) + ')')
    .call(xAxis)

  const bar = svg.selectAll('.bar')
    .data(data)
    .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function (d) {
      if (d.STATE === currentState) {
        return 'translate(' + x(d.MONTH) + ',' + y(d['GENERATION(Mwh)']) + ')'
      }
    })

  bar.append('rect')
    .attr('x', 75)
    .attr('width', function () {
      return x.bandwidth()
    })
    .attr('height', function (d) {
      if (d.STATE === currentState) {
        return height - y(d['GENERATION(Mwh)'])
      }
    }).attr('transform', 'translate(0, 20)')

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text(`2021 ${currentState} Monthly Electricity Generation`)
    .attr('transform', 'translate(75, 0)')
}
