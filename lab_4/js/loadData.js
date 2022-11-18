const task2Data = './output/energy_2021_census.csv'
const task3Data = './output/energy_2021_MSG.csv'
const task4Data = './output/energy_2021_MT_TS.csv'

d3.queue()
  .defer(d3.csv, task2Data)
  .defer(d3.csv, task3Data)
  .defer(d3.csv, task4Data)
  .await(dataLoader)

function dataLoader (error, task2DataLoaded, task3DataLoaded, task4DataLoaded) {
  const currentState = 'US-TOTAL'
  if (error) throw error
  drawUSMap(task2DataLoaded, task3DataLoaded, task4DataLoaded)
  drawBar(task3DataLoaded, currentState)
  drawPie(task4DataLoaded, currentState)
}

function updateBar (task3DataLoaded, currentState) {
  svg = d3.select('#bar')
  svg.selectAll('svg').remove()
  drawBar(task3DataLoaded, currentState)
}

function updatePie (task4DataLoaded, currentState) {
  const svg = d3.select('#pie')
  svg.selectAll('svg').remove()
  drawPie(task4DataLoaded, currentState)
}
