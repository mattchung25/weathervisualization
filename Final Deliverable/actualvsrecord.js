function onTimeRangeChanged() {
    const timeRange = +document.getElementById('timeRangeSelect').value;
    d3.csv('./Weather Data/JAX.csv').then(data => {
        const filteredData = filterDataByRange(data, timeRange);
        updateRecordVsActualChart(filteredData);
    });
}

function filterDataByRange(data, range) {
    const endDate = new Date(data[data.length - 1].date);
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - range);
    return data.filter(d => new Date(d.date) >= startDate);
}

function updateRecordVsActualChart(data) {
    d3.select('#recordVsActualChart').html('');

    const svg = d3.select('#recordVsActualChart').append('svg').attr('width', 800).attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const lineActual = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.actual_max_temp));

    const lineRecord = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.record_max_temp));

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d => +d.record_max_temp)]);

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', lineActual);

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 1.5)
        .attr('d', lineRecord);

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
        .text('Actual Max Temp');

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
        .text('Record Max Temp');

    // Add interactivity: tooltips
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden');

    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.actual_max_temp))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
            tooltip.html(`Date: ${d.date}<br>Actual Max Temp: ${d.actual_max_temp}<br>Record Max Temp: ${d.record_max_temp}`)
                .style('visibility', 'visible');
        })
        .on('mousemove', (event) => {
            tooltip.style('top', `${event.pageY - 10}px`)
                .style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

    g.selectAll('.dot-record')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot-record')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.record_max_temp))
        .attr('r', 5)
        .attr('fill', 'orange')
        .on('mouseover', (event, d) => {
            tooltip.html(`Date: ${d.date}<br>Actual Max Temp: ${d.actual_max_temp}<br>Record Max Temp: ${d.record_max_temp}`)
                .style('visibility', 'visible');
        })
        .on('mousemove', (event) => {
            tooltip.style('top', `${event.pageY - 10}px`)
                .style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
}

d3.csv('./Weather Data/JAX.csv').then(data => {
    updateRecordVsActualChart(data);
});
