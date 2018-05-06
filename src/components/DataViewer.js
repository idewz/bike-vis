import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import InfoIcon from '@material-ui/icons/InfoOutline';
import RefreshIcon from '@material-ui/icons/Refresh';

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
        Math.random() * Math.floor(this.props.trips.length + 1)
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
      <Grid container spacing={24} justify="center">
        <Grid item xs={8}>
          <Typography variant="headline">
            Our data &nbsp;
            <a href="https://github.com/idewz/cs560-project/tree/master/public/data/ford_gobike">
              <InfoIcon style={{ fontSize: '0.7em' }} />
            </a>
          </Typography>
          <Typography variant="subheading">
            anonymized history trips data from Ford GoBike{' '}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            placeholder="Index"
            label={`Index (0-${this.props.trips.length - 1})`}
            value={this.state.value}
            onChange={this.handleChange}
          />
          <IconButton
            aria-label="Refresh"
            variant="flat"
            color="primary"
            onClick={this.handleRefreshClick}
          >
            <RefreshIcon />
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
        </Grid>
      </Grid>
    );
  }
}

DataViewer.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default DataViewer;
