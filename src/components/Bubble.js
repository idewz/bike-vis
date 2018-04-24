import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';

import * as d3 from 'd3';
import { indigo, pink, blueGrey } from 'material-ui/colors';

class Bubble extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  colors = [indigo[500], pink[400], blueGrey[300]];

  createChart() {
    const { trips } = this.props;
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const forceStrength = 0.85;
    let circles;
    let forceSimulation;

    const nCircles = 500;
    const menTrips = trips.filter(e => e.member_gender === 0);
    const womenTrips = trips.filter(e => e.member_gender === 1);
    const nMen = Math.round(nCircles / trips.length * menTrips.length);
    const nWomen = Math.round(nCircles / trips.length * womenTrips.length);

    const forces = {
      combine: createCombineForces()
    };

    console.log(menTrips.length);
    console.log(womenTrips.length);
    console.log(nMen, nWomen);

    const nodes = [
      ...range(nMen).map((e, i) => ({ index: i, gender: 0 })),
      ...range(nWomen).map((e, i) => ({ index: nMen + i, gender: 1 }))
    ];

    createCircles(nodes);
    createForceSimulation();

    function createCircles() {
      circles = svg
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', d => (d.gender === 0 ? 'men' : 'women'))
        .attr('r', 5)
        .style('fill', d => (d.gender === 0 ? indigo[500] : pink[400]));
    }

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength)
      };
    }

    function createForceSimulation() {
      forceSimulation = d3
        .forceSimulation()
        .force('x', forces.combine.x)
        .force('y', forces.combine.y)
        .force('collide', d3.forceCollide(10));

      forceSimulation.nodes(nodes).on('tick', () => {
        circles.attr('cx', d => d.x).attr('cy', d => d.y);
      });
    }
  }

  render() {
    return (
      <Fragment>
        <form>
          <label htmlFor="gender_checkbox">Gender</label>
          <input id="gender_checkbox" type="checkbox" />
        </form>
        <svg ref={node => (this.node = node)} width={800} height={500} />
      </Fragment>
    );
  }
}

Bubble.propTypes = {
  trips: PropTypes.array.isRequired
};

export default Bubble;
