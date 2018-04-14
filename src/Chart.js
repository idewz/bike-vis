import React, { Component, Fragment } from 'react';
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

  renderRows() {
    const t = this.props.data[this.state.value];

    if (t === undefined) {
      return null;
    }

    const Row = ({ objKey, objVal }) => (
      <tr>
        <td>{objKey}</td>
        <td>{objVal instanceof Date ? objVal.toString() : objVal}</td>
      </tr>
    );

    const values = Object.keys(t).map(key => ({ key, val: t[key] }));

    return values.map(v => <Row key={v.key} objKey={v.key} objVal={v.val} />);
  }

  render() {
    if (this.props.data.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <p>We have {this.props.data.length} trips data</p>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </Fragment>
    );
  }
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart;
