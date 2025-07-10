function onTimeRangeChanged() {
    const timeRange = document.getElementById('timeRangeSelect').value;
    d3.csv('/JAX.csv').then(jaxData => {
        d3.csv('/CQT.csv').then(laData => {
            const filteredJaxData = filterDataByRange(jaxData, timeRange);
            const filteredLaData = filterDataByRange(laData, timeRange);
            updatePrecipitationChart(filteredJaxData, filteredLaData);
        });
    });
}

function filterDataByRange(data, range) {
    const endDate = new Date(data[data.length - 1].date);
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - range);
    return data.filter(d => new Date(d.date) >= startDate);
}

function updatePrecipitationChart(jaxData, laData) {
    d3.select('#precipitationComparisonChart').html('');

    const svg = d3.select('#precipitationComparisonChart').append('svg').attr('width', 800).attr('height', 400);

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const lineJax = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.actual_precipitation));

    const lineLa = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.actual_precipitation));

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const combinedData = jaxData.concat(laData);

    x.domain(d3.extent(combinedData, d => new Date(d.date)));
    y.domain([0, d3.max(combinedData, d => +d.actual_precipitation)]);

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.append('path')
        .datum(jaxData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', lineJax);

    g.append('path')
        .datum(laData)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 1.5)
        .attr('d', lineLa);

    const legend = svg.append('g')
        .attr('transform', `translate(${width - 100},${margin.top})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', 'steelblue');

    legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .text('Jacksonville');

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 24)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', 'orange');

    legend.append('text')
        .attr('x', 24)
        .attr('y', 33)
        .attr('dy', '.35em')
        .text('Los Angeles');
}

d3.csv('/JAX.csv').then(jaxData => {
    d3.csv('/CQT.csv').then(laData => {
        updatePrecipitationChart(jaxData, laData);
    });
});
