import React, { Component } from "react";
import PropTypes from "prop-types";

import * as d3 from "d3";
import { indigo, pink, blueGrey } from "material-ui/colors";

class NewChart extends Component {
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
    const width = svg.attr("width");
    const height = svg.attr("height");
  }

  updateChart() {
    const { trips } = this.props;
    const svg = d3.select(this.node);
    const width = svg.attr("width");
    const height = svg.attr("height");
    const margin = { top: 80, right: 180, bottom: 100, left: 80 };
    const matrix = [];
    const xScale = d3.scaleBand().range([0, width]);
    const z = d3
      .scaleLinear()
      .domain([0, 4])
      .clamp(true);
    const c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));
    const stations = this.props.stations.filter(e => e !== undefined);

    this.props.trips.forEach((t, i) => {
      matrix.push({
        x: stations.findIndex(e => e.id === t.start_station.id),
        y: stations.findIndex(e => e.id === t.end_station.id)
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

    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "#eee");

    var column = svg
      .selectAll(".column")
      .data(stations)
      .enter()
      .append("g")
      .attr("class", "column")
      .attr("transform", function(d) {
        return "translate(" + xScale(d.id) + ") rotate(-90)";
      });

    column.append("line").attr("x1", -width);

    column
      .append("text")
      .attr("x", 6)
      .attr("y", xScale.bandwidth())
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) {
        return d.name;
      })
      .style("font-size", "3px");

    var row = svg
      .selectAll(".row")
      .data(group_trips)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", function(d) {
        return "translate(0," + xScale(stations[d.key].id) + ")";
      })
      .each(get_row);

    row.append("line").attr("x2", width);

    row
      .append("text")
      .attr("x", -6)
      .attr("y", xScale.bandwidth())
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) {
        return stations[d.key].name;
      })
      .style("font-size", "3px");

    function get_row(value) {
      var cell = d3.select(this);

      cell
        .selectAll(".cell")
        .data(value.values)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d) {
          return xScale(stations[d.key].id);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", xScale.bandwidth())
        // .style("fill-opacity", function(d) {
        //   return z(d.value);
        // })
        .style("fill", function(d) {
          return c(d.value);
        });
    }
  }

  render() {
    return <svg ref={node => (this.node = node)} width={1500} height={1500} />;
  }
}

NewChart.propTypes = {
  trips: PropTypes.array.isRequired,
  stations: PropTypes.array.isRequired
};

export default NewChart;
