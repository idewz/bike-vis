import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { blue, green } from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import BikeIcon from '@material-ui/icons/DirectionsBike';
import PlaceIcon from '@material-ui/icons/Place';

import BarChart from './BarChart';
import MenWomenChart from './MenWomenChart';
import NumberCardList from './NumberCardList';
import TimeMatrix from './TimeMatrix';

class Dashboard extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  getRideMatrix(trips) {
    if (trips.length === 0) {
      return [];
    }

    const matrix = [...Array(7)].map(e => Array(24).fill(0));

    trips.forEach(trip => {
      const day = trip.start_time.getDay();
      const hour = trip.start_time.getHours();
      matrix[day][hour]++;
    });

    return matrix;
  }

  ridesPerHour(trips) {
    const bars = new Array(24).fill(0);

    if (trips !== undefined && trips.length !== 0) {
      trips.forEach(trip => {
        bars[trip.start_time.getHours()]++;
      });
    }

    return bars;
  }

  ridesPerDay(trips) {
    const bars = new Array(7).fill(0);

    if (trips !== undefined && trips.length !== 0) {
      trips.forEach(trip => {
        bars[trip.start_time.getDay()]++;
      });
    }

    return bars;
  }

  render() {
    const { trips, classes } = this.props;
    const cards = [
      {
        title: 'Trips',
        value: this.props.trips.length.toLocaleString(),
        icon: BikeIcon,
        color: blue[500],
      },
      {
        title: 'Stations',
        value: this.props.stations.length.toLocaleString(),
        icon: PlaceIcon,
        color: green[500],
      },
    ];

    const hoursData = this.ridesPerHour(trips);
    const hoursBand = Array.from(new Array(24), (x, i) => i);

    const daysData = this.ridesPerDay(trips);
    const daysBand = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

    const rideMatrix = this.getRideMatrix(this.props.trips);

    return (
      <Grid container>
        <NumberCardList cards={cards} />

        <Grid container spacing={24} justify="center" className={classes.grid}>
          <Grid item xs={8}>
            <Typography variant="headline">Men vs Women</Typography>
          </Grid>
          <Grid item xs={8}>
            <MenWomenChart trips={trips} />
          </Grid>

          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="headline">Rides by Time of Day</Typography>
                <TimeMatrix matrix={rideMatrix} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="headline">
                  Duration by Time of Day
                </Typography>
                <TimeMatrix matrix={rideMatrix} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="headline">Number of Rides per Hour</Typography>
          </Grid>
          <Grid item xs={8}>
            <BarChart data={hoursData} bands={hoursBand} />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="headline">Number of Rides per Day</Typography>
          </Grid>
          <Grid item xs={8}>
            <BarChart data={daysData} bands={daysBand} />
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
