import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Chart extends Component {
  constructor() {
    super();
    this.state = { value: 0 };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    if (this.props.data.length === 0) {
      return null;
    }

    const t = this.props.data[this.state.value];

    if (t) {
      console.log(t);
    }

    return (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <p>We have {this.props.data.length} trips data</p>
      </div>
    );
  }
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart;
