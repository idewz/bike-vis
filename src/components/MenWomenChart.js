import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import { indigo, pink, blueGrey } from 'material-ui/colors';

class MenWomenChart extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  colors = [indigo[500], pink[400], blueGrey[300]];

  componentDidMount() {
    this.createChart();

    if (this.props.trips.length !== 0) {
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
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const data = [50, 50, 0];
    const percents = data.map(d => d / 100);

    svg
      .selectAll('rect')
      .data(percents)
      .enter()
      .append('rect')
      .attr('width', d => d * width)
      .attr('height', height)
      .attr('x', (d, i) => this.positionX(percents, i))
      .style('fill', (d, i) => this.colors[i]);

    svg
      .append('g')
      .attr('class', 'texts')
      .attr('transform', `translate(0, 60)`);
  }

  updateChart() {
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const data = new Array(3).fill(0);

    this.props.trips.forEach(t => {
      if (t.member_gender !== -1) {
        data[t.member_gender]++;
      } else {
        data[2]++;
      }
    });

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
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .attr('class', 'big-percentage')
          .merge(percentTexts)
          .text(d => `${(d * 100).toFixed(2)}%`);

        gText
          .selectAll('text.label')
          .data(['Men', 'Women', 'Other'])
          .enter()
          .append('text')
          .attr('x', (d, i) => this.positionX(percents, i) + 16)
          .attr('y', -24)
          .attr('class', 'label')
          .text(d => d);
      });
  }

  render() {
    return <svg ref={node => (this.node = node)} width={800} height={100} />;
  }
}

MenWomenChart.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default MenWomenChart;
