import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import { niceNumber } from '../utils';

class NestedMap extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  componentDidMount() {
    this.createChart();

    if (this.props.data && this.props.data.length !== 0) {
      this.updateChart();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.data === undefined ||
      nextProps.data.length === 0 ||
      (nextProps.data[0] === 0 || nextProps.data[1] === 0)
    ) {
      return false;
    }

    return true;
  }

  componentDidUpdate() {
    this.updateChart();
  }

  positionX(percents, i) {
    const svg = d3.select(this.node);
    const width = svg.attr('width');

    switch (i) {
      case 0:
        return 0;

      case 1:
        return percents[i - 1] * width;

      case 2:
        return width - percents[i] * width;

      default:
        return 0;
    }
  }

  createChart() {
    const { data, colors } = this.props;
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const percents = data.map(d => d / 100);

    svg
      .selectAll('rect')
      .data(percents)
      .enter()
      .append('rect')
      .attr('width', d => d * width)
      .attr('height', height)
      .attr('x', (d, i) => this.positionX(percents, i))
      .style('fill', (d, i) => colors[i]);

    svg
      .append('g')
      .attr('class', 'texts')
      .attr('transform', `translate(0, 60)`);

    d3
      .select('.tooltip')
      .enter()
      .append('div')
      .attr('class', 'tooltip');
  }

  updateChart() {
    const { data, labels } = this.props;
    const svg = d3.select(this.node);
    const width = svg.attr('width');

    const total = data.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    const percents = data.map(d => d / total);
    const blocks = data.map((d, i) => ({
      value: d,
      percent: d / total,
      label: d > 0 ? labels[i] : '',
    }));

    const gText = svg.select('g.texts');
    const rects = svg.selectAll('rect');

    rects
      .data(blocks)
      .transition()
      .duration(750)
      .ease(d3.easeCubicIn)
      .attr('width', (d, i) => d.percent * width)
      .attr('x', (d, i) => this.positionX(percents, i))
      .on('end', () => {
        const percentTexts = gText.selectAll('text.big-percentage');
        percentTexts
          .data(blocks)
          .enter()
          .append('text')
          .attr('class', 'big-percentage')
          .merge(percentTexts)
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .text(d => (d.percent > 0 ? `${niceNumber(d.percent * 100)}%` : ''));

        const genderTexts = gText.selectAll('text.label');
        genderTexts
          .data(blocks)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('y', -24)
          .merge(genderTexts)
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .text(d => d.label);
      });

    rects
      .on('mouseover', this.handleMouseOver)
      .on('mouseout', this.handleMouseOut)
      .on('mousemove', this.handleMouseMove);
  }

  handleMouseOver(d, i, nodes) {
    const node = d3.select(nodes[i]);
    const tooltip = d3.select('.tooltip');

    node.classed('border-dotted', true);
    tooltip.style('visibility', 'visible');
    tooltip.html(
      `${d.label} <br/>
      <div class="number">${niceNumber(d.value)}</div>
      ${this.props.unit}`
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
    return <svg ref={node => (this.node = node)} width={960} height={100} />;
  }
}

NestedMap.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired,
};

export default NestedMap;
