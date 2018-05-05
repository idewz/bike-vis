import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';

import * as d3 from 'd3';
import { red } from 'material-ui/colors';

class TimeMatrix extends Component {
  constructor(props) {
    super(props);

    this.createTimeMatrix = this.createTimeMatrix.bind(this);
    this.updateTimeMatrix = this.updateTimeMatrix.bind(this);
    this.drawDayCells = this.drawDayCells.bind(this);

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentDidMount() {
    this.createTimeMatrix();

    if (this.props.trips && this.props.trips.length !== 0) {
      this.updateTimeMatrix();
    }
  }

  componentDidUpdate() {
    this.updateTimeMatrix();
  }

  getMatrix(trips) {
    const matrix = [...Array(7)].map(e => Array(24).fill(0));

    trips.forEach(trip => {
      const day = trip.start_time.getDay();
      const hour = trip.start_time.getHours();
      matrix[day][hour]++;
    });

    return matrix;
  }

  chart = { width: 48 * 7, height: 16 * 24, margin: 20 };
  colors = [red[100], red[300], red[500], red[700], red[900]];

  xScale = d3
    .scaleBand()
    .domain(range(7))
    .range([0, this.chart.width])
    .padding(0.05);

  yScale = d3
    .scaleBand()
    .domain(range(24))
    .range([0, this.chart.height])
    .padding(0.2);

  colorScale = d3.scaleQuantile().range(this.colors);

  createTimeMatrix() {
    const matrix = [...Array(7)].map(e => Array(24).fill(0));

    const node = this.node;
    const svg = d3.select(node);
    const container = svg
      .append('g')
      .attr('class', 'container')
      .attr(
        'transform',
        `translate(${this.chart.margin}, ${this.chart.margin})`
      );

    d3
      .select('.tooltip')
      .enter()
      .append('div')
      .attr('class', 'tooltip');

    container
      .selectAll('g')
      .data(matrix)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${this.xScale(i)}, 0)`);
  }

  updateTimeMatrix() {
    const { trips } = this.props;
    const matrix = this.getMatrix(trips);

    this.colorScale.domain([0, d3.max(matrix, d => d3.max(d))]);

    const node = this.node;
    const container = d3.select(node).select('.container');

    container
      .selectAll('g')
      .data(matrix)
      .each(this.drawDayCells);
  }

  drawDayCells(d, i, nodes) {
    const rects = d3
      .select(nodes[i])
      .selectAll('rect')
      .data(d.map((e, j) => ({ day: i, hour: j, value: e })));

    rects
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (e, i) => this.yScale(i))
      .attr('height', e => this.yScale.bandwidth())
      .attr('width', this.xScale.bandwidth())
      .attr('fill', this.colors[0])
      .merge(rects)
      .on('mouseover', this.handleMouseOver)
      .on('mousemove', this.handleMouseMove)
      .on('mouseout', this.handleMouseOut)
      .transition()
      .delay(500)
      .style('fill', (e, i) => this.colorScale(e.value));
  }

  handleMouseOver(d) {
    const tooltip = d3.select('.tooltip');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    tooltip.html(`${days[d.day]} at ${d.hour}<br/>${d.value}`);
    tooltip.style('visibility', 'visible');
  }

  handleMouseMove(d) {
    const tooltip = d3.select('.tooltip');

    tooltip
      .style('top', d3.event.pageY - 40 + 'px')
      .style('left', d3.event.pageX + 10 + 'px');
  }

  handleMouseOut(d) {
    const tooltip = d3.select('.tooltip');

    tooltip.style('visibility', 'hidden');
  }

  render() {
    return <svg ref={node => (this.node = node)} width={400} height={440} />;
  }
}

TimeMatrix.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default TimeMatrix;
