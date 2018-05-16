import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';

import * as d3 from 'd3';
import { niceNumber } from '../utils';

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

    if (this.props.matrix && this.props.matrix.length !== 0) {
      this.updateTimeMatrix();
    }
  }

  componentDidUpdate() {
    this.updateTimeMatrix();
  }

  get12HourTime(d, i) {
    let isAM = d < 12;
    let hour = d || 12;

    if (hour > 12) {
      hour -= 12;
    }

    return `${hour} ${isAM ? 'am' : 'pm'}`;
  }

  chart = { width: 48 * 7, height: 16 * 24, margin: 20 };
  colors = [ '#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15' ];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  colorScale = d3.scaleQuantize().range(this.colors);

  legendXScale = d3
    .scaleBand()
    .domain(this.colors)
    .range([0, this.chart.width])
    .padding(0.05);

  createTimeMatrix() {
    const matrix = [...Array(7)].map(e => Array(24).fill(0));

    const node = this.node;
    const svg = d3.select(node);
    const container = svg
      .append('g')
      .attr('class', 'container')
      .attr('transform', `translate(0, ${this.chart.margin / 2})`);

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

    container
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.chart.height})`)
      .call(d3.axisBottom(this.xScale).tickFormat((d, i) => this.days[i]));

    container
      .append('g')
      .attr('class', 'axis axis--y')
      .attr(
        'transform',
        `translate(${this.chart.margin + this.chart.width}, 0)`
      )
      .call(d3.axisRight(this.yScale).tickFormat(this.get12HourTime));

    container
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${this.chart.height + 32})`)
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, 24)`);

    container
      .select('g.legend')
      .selectAll('rect')
      .data(this.colors)
      .enter()
      .append('rect')
      .attr('x', (d, i) => this.legendXScale(this.colors[i]))
      .attr('y', 0)
      .attr('height', 10)
      .attr('width', this.legendXScale.bandwidth())
      .style('fill', d => d);
  }

  updateTimeMatrix() {
    const node = this.node;
    const container = d3.select(node).select('.container');
    const matrix = this.props.matrix;
    this.colorScale.domain([0, d3.max(matrix, d => d3.max(d))]).nice();

    let tickValues = [];
    this.colors.forEach((color, i) => {
      const extent = this.colorScale.invertExtent(color);

      if (i === 0) {
        tickValues.push(extent[0]);
      }
      tickValues.push(extent[1]);
    });

    container
      .selectAll('g')
      .data(matrix)
      .each(this.drawDayCells);

    const ticks = container
      .select('g.legend .axis')
      .selectAll('text')
      .data(tickValues);

    const textPosition = (d, i) => {
      if (i === 0) {
        return 0;
      }

      if (i === this.colors.length) {
        return this.chart.width;
      } else {
        return this.legendXScale(this.colors[i]) + 4;
      }
    };

    ticks
      .enter()
      .append('text')
      .attr('x', textPosition)
      .style('text-anchor', (d, i) => (i ? 'end' : 'start'))
      .merge(ticks)
      .text(d => d);
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

  handleMouseOver(d, i, nodes) {
    const node = d3.select(nodes[i]);
    const tooltip = d3.select('.tooltip');

    node.classed('border-dotted', true);
    tooltip.style('visibility', 'visible');
    tooltip.html(
      `${this.days[d.day]} ${this.get12HourTime(
        d.hour
      )}<br/><div class="number">${niceNumber(d.value)}</div> ${
        this.props.unit
      }`
    );
  }

  handleMouseMove(d) {
    const tooltip = d3.select('.tooltip');

    tooltip
      .style('top', d3.event.pageY - 40 + 'px')
      .style('left', d3.event.pageX + 10 + 'px');
  }

  handleMouseOut(d, i, nodes) {
    const node = d3.select(nodes[i]);
    const tooltip = d3.select('.tooltip');

    node.classed('border-dotted', false);
    tooltip.style('visibility', 'hidden');
  }

  render() {
    return (
      <svg
        ref={node => (this.node = node)}
        className="time-matrix"
        width={400}
        height={480}
      />
    );
  }
}

TimeMatrix.propTypes = {
  matrix: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired,
};

export default TimeMatrix;
