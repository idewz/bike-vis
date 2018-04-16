import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';
import { blue, pink } from 'material-ui/colors';

class MenWomenChart extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  createChart() {
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const height = svg.attr('height');

    svg
      .append('rect')
      .attr('class', 'rect--men')
      .attr('width', width / 2)
      .attr('height', height)
      .style('fill', blue[500]);

    svg
      .append('rect')
      .attr('class', 'rect--women')
      .attr('width', width / 2)
      .attr('height', height)
      .attr('x', width / 2)
      .style('fill', pink[300]);
  }

  updateChart() {
    const svg = d3.select(this.node);
    const width = svg.attr('width');

    let nMen = 0;
    let nWomen = 0;

    this.props.trips.forEach(t => {
      if (t.member_gender === 'Male') {
        nMen++;
      } else if (t.member_gender === 'Female') {
        nWomen++;
      }
    });

    const total = nMen + nWomen;
    const percentMen = nMen / total;
    const percentWomen = nWomen / total;

    const rectMen = d3.select('.rect--men');
    const rectWomen = d3.select('.rect--women');
    const gText = svg.append('g').attr('transform', `translate(0, 60)`);

    rectMen
      .transition()
      .attr('width', width * percentMen)
      .on('end', () => {
        gText
          .append('text')
          .attr('x', 50)
          .attr('class', 'big-percentage')
          .text(`${(percentMen * 100).toFixed(2)}%`);
      });

    rectWomen
      .transition()
      .attr('width', width * percentWomen)
      .attr('x', width * percentMen)
      .on('end', () => {
        gText
          .append('text')
          .attr('x', width * percentMen + 50)
          .attr('class', 'big-percentage')
          .text(`${(percentWomen * 100).toFixed(2)}%`);
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
