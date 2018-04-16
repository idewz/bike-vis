import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import { red } from 'material-ui/colors';

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.createBarChart = this.createBarChart.bind(this);
  }

  chart = { height: 100, width: 800 };
  yScale = d3.scaleLinear().range([100, 0]);

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.yScale.domain([0, d3.max(this.props.data)]);

    d3
      .select(this.node)
      .selectAll('rect')
      .data(this.props.data)
      .transition()
      .delay((d, i) => i / this.props.data.length * 500)
      .attr('y', (d, i) => this.yScale(d))
      .attr('height', d => this.chart.height - this.yScale(d));
  }

  createBarChart() {
    const { data, bands } = this.props;

    if (data === undefined || data.length === 0) {
      return null;
    }

    const node = this.node;
    const svg = d3.select(node);

    const xScale = d3
      .scaleBand()
      .domain(bands)
      .range([0, this.chart.width])
      .padding(0.2);

    svg
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${this.chart.height})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');

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
      .attr('x', (d, i) => xScale(bands[i]))
      .attr('y', d => this.yScale(d))
      .attr('height', d => this.chart.height - this.yScale(d))
      .attr('width', xScale.bandwidth())
      .style('fill', red[400])
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut);

    function handleMouseOver(d) {
      d3.select(this).style('fill', red[800]);
      tooltip.text(d);
      tooltip.style('visibility', 'visible');
    }

    function handleMouseMove(d) {
      tooltip
        .style('top', window.event.pageY - 40 + 'px')
        .style('left', window.event.pageX + 10 + 'px');
    }

    function handleMouseOut(d) {
      d3.select(this).style('fill', red[400]);
      tooltip.style('visibility', 'hidden');
    }
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
