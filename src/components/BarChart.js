import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { red } from 'material-ui/colors';

import { max } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    const { data, bands } = this.props;

    if (data === undefined || data.length === 0) {
      return null;
    }

    const node = this.node;
    const svg = select(node);
    const margin = 24;
    const chart = { height: 100, width: 800 };

    const xScale = scaleBand()
      .domain(bands)
      .range([0, chart.width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([chart.height, 0]);

    const g = svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${chart.height})`)
      .call(axisBottom(xScale).tickSize(0));

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect');

    svg
      .selectAll('rect')
      .data(data)
      .exit()
      .remove();

    svg
      .selectAll('rect')
      .data(data)
      .style('fill', red[500])
      .attr('x', (d, i) => xScale(bands[i]))
      .attr('y', d => yScale(d))
      .attr('height', d => chart.height - yScale(d))
      .attr('width', xScale.bandwidth());
  }

  render() {
    return <svg ref={node => (this.node = node)} width={900} height={160} />;
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  bands: PropTypes.array.isRequired,
};

export default BarChart;
