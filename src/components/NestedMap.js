import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

class NestedMap extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.createChart();

    if (this.props.data && this.props.data.length !== 0) {
      this.updateChart();
    }
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
  }

  updateChart() {
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const { data, labels } = this.props;

    const total = data.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    const percents = data.map(d => d / total);

    const gText = svg.select('g.texts');
    const rects = svg.selectAll('rect');

    rects
      .data(percents)
      .transition()
      .duration(750)
      .ease(d3.easeCubicIn)
      .attr('width', (d, i) => d * width)
      .attr('x', (d, i) => this.positionX(percents, i))
      .on('end', () => {
        const percentTexts = gText.selectAll('text.big-percentage');
        percentTexts
          .data(percents)
          .enter()
          .append('text')
          .attr('class', 'big-percentage')
          .merge(percentTexts)
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .text(d => (d > 0 ? `${(d * 100).toFixed(2)}%` : ''));

        const genderTexts = gText.selectAll('text.label');
        genderTexts
          .data(percents)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('y', -24)
          .merge(genderTexts)
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .text((d, i) => (d > 0 ? labels[i] : ''));
      });
  }

  render() {
    return <svg ref={node => (this.node = node)} width={900} height={100} />;
  }
}

NestedMap.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
};

export default NestedMap;
