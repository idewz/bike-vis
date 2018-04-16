import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import RefreshIcon from 'material-ui-icons/Refresh';

class DataViewer extends Component {
  constructor(props) {
    super(props);

    this.state = { value: 0 };

    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleRefreshClick = event => {
    this.setState({
      value: Math.floor(
        Math.random() * Math.floor(this.props.trips.length + 1),
      ),
    });
  };

  renderRows() {
    const t = this.props.trips[this.state.value];

    if (t === undefined) {
      return null;
    }

    const Row = ({ objKey, objVal }) => (
      <tr>
        <td>{objKey}</td>
        <td>{objVal instanceof Object ? objVal.toString() : objVal}</td>
      </tr>
    );

    const values = Object.keys(t).map(key => ({ key, val: t[key] }));

    return values.map(v => <Row key={v.key} objKey={v.key} objVal={v.val} />);
  }

  render() {
    return (
      <Fragment>
        <TextField
          placeholder="Index"
          label={`Index (0-${this.props.trips.length - 1})`}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <IconButton aria-label="Refresh" variant="flat" color="primary">
          <RefreshIcon onClick={this.handleRefreshClick} />
        </IconButton>
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

DataViewer.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default DataViewer;
