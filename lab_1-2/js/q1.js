d3.csv('data/q1.csv', drawHist)

function drawHist (error, points) {
  const svg = d3.select('svg')
  const margin = { top: 10, right: 30, bottom: 30, left: 30 }
  const width = +svg.attr('width') - margin.left - margin.right
  const height = +svg.attr('height') - margin.top - margin.bottom
  const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const array = Object.values(points)
  const city_name = []
  const data = []

  for (let i = 0; i < array.length; i++) {
    if (array[i].value) {
      data[i] = array[i].value
      city_name[i] = array[i].city
    }
  }

  const maxNumber = Math.max.apply(Math, data) + 1000000
  // console.log(maxNumber)
  const y = d3.scaleLinear()
    .domain([0, maxNumber])
    .range([height, 0])

  const x = d3.scaleBand()
    .domain(city_name)
    .range([0, width - 200])
    .paddingOuter(0.33)
    .paddingInner(0.33)

  const yAxis = d3.axisLeft(y).ticks(6)
  const xAxis = d3.axisBottom(x)

  svg.append('g')
    .attr('transform', 'translate(75, 0)')
    .call(yAxis)

  svg.append('g')
    .attr('transform', 'translate(75, ' + height + ')')
    .call(xAxis)

  const bar = svg.selectAll('.bar')
    .data(points)
    .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function (d) {
      console.log(d)
      return 'translate(' + x(d.city) + ',' + y(d.value) + ')'
    })

  bar.append('rect')
    .attr('x', 75)
    .attr('width', function () {
      return x.bandwidth()
    })
    .attr('height', function (d) {
      return height - y(d.value)
    })
}
