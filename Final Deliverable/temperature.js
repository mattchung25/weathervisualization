function onCategoryChanged() {
    const selectedCategory = document.getElementById('categorySelect').value;
    d3.csv(`./Weather Data/${selectedCategory}.csv`).then(data => {
        updateChart(data);
    });
}

function updateChart(data) {
    d3.select('#chart').html('');

    const svg = d3.select('#chart').append('svg').attr('width', 800).attr('height', 400);

    const margin = {top: 20, right: 30, bottom: 40, left: 40},
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.actual_max_temp));

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain(d3.extent(data, d => +d.actual_max_temp));

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
        .attr('d', line);
}

d3.csv('./Weather Data/JAX.csv').then(data => {
    updateChart(data);
});
