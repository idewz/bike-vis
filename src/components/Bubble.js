import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';

import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import * as d3 from 'd3';
import { indigo, pink } from 'material-ui/colors';

class Bubble extends Component {
  constructor(props) {
    super(props);

    this.nodes = [];
    this.circles = [];
    this.state = {
      force: 'combine',
      checks: {
        gender: false,
        member: false,
      },
    };

    this.createChart = this.createChart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateForces = this.updateForces.bind(this);
    this.createForces = this.createForces.bind(this);
  }

  componentDidMount() {
    this.svg = d3.select(this.node);
    this.width = this.svg.attr('width');
    this.height = this.svg.attr('height');

    this.forceSimulation = undefined;
    this.forceStrength = 0.85;
    this.forces = this.createForces();

    if (this.props.trips.length !== 0) {
      this.createChart();
    }
  }

  componentDidUpdate() {
    const forcesName = this.state.force;

    if (this.state.checks[forcesName] === false) return;

    if (this.forceSimulation === undefined) {
      this.createChart();
    }

    this.updateForces(this.state.force);
  }

  handleChange(e, v) {
    let forcesName = e.target.value;
    if (this.timer) clearTimeout(this.timer);

    const checks = this.state.checks;
    checks[forcesName] = v;

    if (checks.gender && checks.member) {
      forcesName = 'both';
    } else if ((!checks.gender && !checks.member) === true) {
      forcesName = 'combine';
    }

    this.setState({ force: forcesName, checks });
  }

  createForces() {
    const { width, height, forceStrength } = this;

    return {
      both: createCombineForces(),
      combine: createCombineForces(),
      gender: createGenderForces(),
      member: createGenderForces(),
    };

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength),
      };
    }

    function createGenderForces() {
      return {
        x: d3.forceX(genderForceX).strength(forceStrength * 2),
        y: d3.forceY(height / 2).strength(forceStrength * 2),
      };

      function genderForceX(d) {
        return d.gender === 0 ? width / 4 : width / 4 * 3;
      }
    }
  }

  updateForces(forcesName) {
    this.forceSimulation
      .force('x', this.forces[forcesName].x)
      .force('y', this.forces[forcesName].y)
      .force('collide', d3.forceCollide(10))
      .alphaTarget(0.008)
      .restart();

    this.timer = setTimeout(() => {
      this.forceSimulation.stop();
    }, 10000);
  }

  createChart() {
    const { trips } = this.props;

    const nCircles = 250;
    const menTrips = trips.filter(e => e.member_gender === 0);
    const womenTrips = trips.filter(e => e.member_gender === 1);
    const nMen = Math.round(nCircles / trips.length * menTrips.length);
    const nWomen = Math.round(nCircles / trips.length * womenTrips.length);

    console.log(menTrips.length, womenTrips.length);
    console.log(nMen, nWomen);

    this.nodes = [
      ...range(nMen).map((e, i) => ({ index: i, gender: 0 })),
      ...range(nWomen).map((e, i) => ({ index: nMen + i, gender: 1 })),
    ];

    const createCircles = () => {
      this.circles = this.svg
        .selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('class', d => (d.gender === 0 ? 'men' : 'women'))
        .attr('r', 5)
        .style('fill', d => (d.gender === 0 ? indigo[500] : pink[400]));
    };

    const createForceSimulation = () => {
      this.forceSimulation = d3
        .forceSimulation()
        .force('x', this.forces.combine.x)
        .force('y', this.forces.combine.y)
        .force('collide', d3.forceCollide(12))
        .alphaDecay(0.05);

      this.forceSimulation.nodes(this.nodes).on('tick', () => {
        this.circles.attr('cx', d => d.x).attr('cy', d => d.y);
      });
    };

    createCircles(this.nodes);
    createForceSimulation();
  }

  render() {
    return (
      <Grid container className={this.props.classes.container}>
        <Grid item xs={8}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checks['gender']}
                  onChange={(e, v) => this.handleChange(e, v)}
                  value="gender"
                />
              }
              label="Gender"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checks['member']}
                  onChange={(e, v) => this.handleChange(e, v)}
                  value="member"
                />
              }
              label="Membership"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={8}>
          <svg ref={node => (this.node = node)} width={800} height={500} />
        </Grid>
      </Grid>
    );
  }
}

Bubble.propTypes = {
  classes: PropTypes.object.isRequired,
  trips: PropTypes.array.isRequired,
};

const styles = theme => {
  return {
    container: {
      margin: theme.spacing.unit * 2,
    },
  };
};

export default withStyles(styles, { withTheme: true })(Bubble);
