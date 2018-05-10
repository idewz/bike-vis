import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import { withStyles } from 'material-ui/styles';
import { blue, green, orange } from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import BikeIcon from '@material-ui/icons/DirectionsBike';
import PlaceIcon from '@material-ui/icons/Place';
import TimerIcon from '@material-ui/icons/Timer';

import BarChart from './BarChart';
import MapContainer from './MapContainer';
import MemberChart from './MemberChart';
import MenWomenChart from './MenWomenChart';
import NumberCardList from './NumberCardList';
import TimeMatrix from './TimeMatrix';
import { niceNumber } from '../utils';

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

  averageDuration() {
    const { trips } = this.props;

    if (trips === undefined || trips.length === 0) {
      return 0;
    }

    const total = trips.reduce(
      (previousValue, currentValue) => previousValue + currentValue.duration,
      0
    );

    return total / 60 / trips.length;
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
      {
        title: 'Avg Duration (min)',
        value: niceNumber(this.averageDuration(), 1),
        icon: TimerIcon,
        color: orange[800],
      },
    ];

    const hoursData = this.ridesPerHour(trips);
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const hoursBand = [
      ...hours.map(h => `${h} am`),
      ...hours.map(h => `${h} pm`),
    ];

    const daysData = this.ridesPerDay(trips);
    const daysBand = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const rideMatrix = this.getRideMatrix(this.props.trips);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const marks = Object.assign(
      {},
      new Array(13)
        .fill(0)
        .map((e, i) => (i >= 12 ? months[i - 12] : months[i]))
    );

    // TODO: Make it smaller
    return (
      <Grid container>
        <Grid container spacing={24} justify="center" className={classes.grid}>
          <Grid item xs={11} className={classes.slider}>
            <Range
              defaultValue={[0, 12]}
              value={this.props.sliderValue}
              min={0}
              max={12}
              marks={marks}
              pushable
              onChange={this.props.handleSliderChange}
              onAfterChange={this.props.handleSliderAfterChange}
            />
          </Grid>

          <NumberCardList cards={cards} />

          <Grid item xs={11}>
            <Typography variant="headline">Gender</Typography>
          </Grid>
          <Grid item xs={11}>
            <MenWomenChart trips={trips} />
          </Grid>
          <Grid item xs={11}>
            <Typography variant="headline">User Type</Typography>
          </Grid>
          <Grid item xs={11}>
            <MemberChart trips={trips} />
          </Grid>

          <Grid item xs={11}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="headline">Rides by Time of Day</Typography>
                <TimeMatrix matrix={rideMatrix} unit="trips" />
              </Grid>

              <Grid item xs={6}>
                <Grid item xs={12}>
                  <BarChart data={hoursData} bands={hoursBand} />
                </Grid>

                <Grid item xs={12}>
                  <BarChart data={daysData} bands={daysBand} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={11}>
            <Typography variant="headline">Stations</Typography>
          </Grid>
          <Grid item xs={11}>
            <MapContainer
              stations={this.props.stations}
              stationIndices={this.props.stationIndices}
              trips={this.props.trips}
            />
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
  stationIndices: PropTypes.object.isRequired,
  trips: PropTypes.array.isRequired,
  sliderValue: PropTypes.array.isRequired,
  handleSliderChange: PropTypes.func.isRequired,
  handleSliderAfterChange: PropTypes.func.isRequired,
};

const styles = theme => {
  return {
    grid: {
      marginTop: theme.spacing.unit * 3,
    },
    slider: {
      marginBottom: theme.spacing.unit * 3,
    },
  };
};

export default withStyles(styles, { withTheme: true })(Dashboard);
