import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NumberCardList from './components/NumberCardList';
import BarChart from './components/BarChart';

import { withStyles } from 'material-ui/styles';
import { blue, green } from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import BikeIcon from 'material-ui-icons/DirectionsBike';
import PlaceIcon from 'material-ui-icons/Place';
import RefreshIcon from 'material-ui-icons/Refresh';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
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

  ridesPerHour(trips) {
    if (trips === undefined || trips.length === 0) {
      return;
    }

    const bars = new Array(24).fill(0);

    trips.forEach(trip => {
      bars[trip.start_time.getHours()]++;
    });

    return bars;
  }

  ridesPerDay(trips) {
    if (trips === undefined || trips.length === 0) {
      return;
    }

    const bars = new Array(7).fill(0);

    trips.forEach(trip => {
      bars[trip.start_time.getDay()]++;
    });

    return bars;
  }

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
    const { trips, stations, classes } = this.props;
    const cards = [
      {
        title: 'Trips',
        value: this.props.trips.length.toString(),
        icon: BikeIcon,
        color: blue[500],
      },
      {
        title: 'Stations',
        value: this.props.stations.length.toString(),
        icon: PlaceIcon,
        color: green[500],
      },
    ];

    const hoursData = this.ridesPerHour(trips);
    const hoursBand = Array.from(new Array(24), (x, i) => i);

    const daysData = this.ridesPerDay(trips);
    const daysBand = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

    return (
      <Grid container>
        <NumberCardList cards={cards} />

        <Grid container spacing={24} justify="center" className={classes.grid}>
          <Grid item xs={8}>
            <Typography variant="headline">Number of Rides by Hour</Typography>
          </Grid>
          <Grid item xs={8}>
            <BarChart data={hoursData} bands={hoursBand} />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="headline">Number of Rides by Day</Typography>
          </Grid>
          <Grid item xs={8}>
            <BarChart data={daysData} bands={daysBand} />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="headline">Our data</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              placeholder="Index"
              label="Index"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <IconButton aria-label="Refresh" variant="flat" color="primary">
              <RefreshIcon onClick={this.handleRefreshClick} />
            </IconButton>
          </Grid>

          <Grid item xs={8}>
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
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  stations: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
};

const styles = theme => {
  return {
    grid: {
      marginTop: theme.spacing.unit * 3,
    },
  };
};

export default withStyles(styles, { withTheme: true })(Dashboard);
