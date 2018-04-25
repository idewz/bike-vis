import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

class Matrix extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    if (this.props.trips.length !== 0) {
      this.createChart();
    }
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const { stations } = this.props;
    const svg = d3.select(this.node);
    const width = svg.attr('width');
    const matrix = [];
    const xScale = d3.scaleBand().range([0, width]);
    const c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));
    const z = d3
      .scaleLinear()
      .domain([0, 4])
      .clamp(true);

    this.props.trips.forEach((t, i) => {
      matrix.push({
        x: stations.findIndex(e => e.id === t.start_station.id),
        y: stations.findIndex(e => e.id === t.end_station.id),
      });
    });

    const group_trips = d3
      .nest()
      .key(function(d) {
        return d.x;
      })
      .key(function(d) {
        return d.y;
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(matrix);

    xScale.domain(stations.map(e => e.id));

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');

    var column = svg
      .selectAll('.column')
      .data(stations)
      .enter()
      .append('g')
      .attr('class', 'column')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.id) + ') rotate(-90)';
      });

    column.append('line').attr('x1', -width);

    column
      .append('text')
      .attr('x', 6)
      .attr('y', xScale.bandwidth())
      .attr('dy', '.32em')
      .attr('text-anchor', 'start')
      .text(function(d, i) {
        return d.name;
      })
      .style('font-size', '3px');

    var row = svg
      .selectAll('.row')
      .data(group_trips)
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', function(d) {
        return 'translate(0,' + xScale(stations[d.key].id) + ')';
      })
      .each(get_row);

    row.append('line').attr('x2', width);

    row
      .append('text')
      .attr('x', -6)
      .attr('y', xScale.bandwidth())
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text(function(d, i) {
        return stations[d.key].name;
      })
      .style('font-size', '3px');

    function get_row(value) {
      var cell = d3.select(this);
      cell
        .selectAll('.cell')
        .data(value.values)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', function(d) {
          return xScale(stations[d.key].id);
        })
        .attr('width', xScale.bandwidth())
        .attr('height', xScale.bandwidth())
        .style('fill-opacity', function(d) {
          return z(d.value);
        })
        .style('fill', function(d) {
          return c(d.value);
        })
        .on('mouseover', d => handleMouseOver(d, value.key))
        .on('mouseout', handleMouseOut)
        .on('mousemove', handleMouseMove);
    }

    function handleMouseOver(d, key) {
      let text = '';
      const columnId = parseInt(d.key, 10);

      const columnSelector = `.column:nth-child(${columnId})`;
      d3
        .select(columnSelector)
        .select('text')
        .classed('active', true);

      d3.selectAll('.row text').classed('active', function(e, i) {
        return e.key === key;
      });

      text += `${stations[columnId].name}<br>${stations[key].name}<br/><br/>${
        d.value
      }`;

      tooltip.html(text);
      tooltip.style('visibility', 'visible');
    }

    function handleMouseOut(d) {
      d3.selectAll('text').classed('active', false);
      d3.selectAll('rect').attr('width', xScale.bandwidth());
      d3.selectAll('rect').attr('height', xScale.bandwidth());
      tooltip.style('visibility', 'hidden');
    }

    function handleMouseMove(d) {
      tooltip
        .style('top', d3.event.pageY - 32 + 'px')
        .style('left', d3.event.pageX + 8 + 'px');
    }
  }

  render() {
    return (
      <svg
        ref={node => (this.node = node)}
        width={1000}
        height={1000}
        className="matrix"
      />
    );
  }
}

Matrix.propTypes = {
  trips: PropTypes.array.isRequired,
  stations: PropTypes.array.isRequired,
};

export default Matrix;
