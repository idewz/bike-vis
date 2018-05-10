import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { csv } from 'd3';

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/Menu/MenuItem';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Bubble from '../Bubble';
import Dashboard from '../Dashboard';
import DataViewer from '../DataViewer';

import Areas from '../../models/Areas';
import Station from '../../models/Station';
import Trip from '../../models/Trip';

import './App.css';
import logo from '../../bike_black_48px.svg';
import MapContainer from '../MapContainer';

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 8,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },
  },
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      filterArea: 0,
      filterGender: -1,
      filterMonth: [0, 12],

      allStations: [],
      allTrips: [],
      stations: [],
      stationIndices: {},
      trips: [],
      value: '/',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleAreaChange = this.handleAreaChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
  }

  async componentWillMount() {
    const station_data = await csv('../data/ford_gobike/stations.csv');
    const stations = [];
    station_data.forEach(s => {
      stations[s.id] = new Station(s, Areas);
    });

    const trip_data = await csv('../data/ford_gobike/2017.csv');
    const definedStations = stations.filter(e => e !== undefined);
    const stationIndices = definedStations.reduce((acc, cur, i) => {
      acc[cur.id] = i;
      return acc;
    }, {});

    const trips = trip_data.map(
      t => new Trip(t, definedStations, stationIndices)
    );

    this.setState({
      allStations: definedStations,
      allTrips: trips,
      areaTrips: trips,
      stations: definedStations,
      stationIndices,
      trips,
    });
  }

  resetFilter() {
    this.setState({
      stations: this.state.allStations,
      trips: this.state.allTrips,
    });
  }

  resetMonthFilter() {
    this.setState({ filterMonth: [0, 12] });
  }

  applyFilter(field, value) {
    console.log(`apply filter ${field} = ${value}`);
    if (field === 'area') {
      this.filterByArea(value);
    } else if (field === 'gender') {
      this.filterByGender(value);
    } else if (field === 'month') {
      this.filterByMonthRange(value);
    }
  }

  filterByArea(area) {
    this.resetMonthFilter();

    if (area === 0) {
      this.resetFilter();
      this.setState({ filterArea: area });
      return;
    }

    const trips = this.state.allTrips.filter(
      t => t.start_station.area.id === area || t.end_station.area.id === area
    );
    const stations = this.state.allStations.filter(s => s.area.id === area);
    const stationIndices = stations.reduce((acc, cur, i) => {
      acc[cur.id] = i;
      return acc;
    }, {});

    this.setState({
      filterArea: area,
      stations,
      stationIndices,
      areaTrips: trips,
      trips,
    });
  }

  filterByGender(gender) {
    if (gender === -1) {
      this.resetFilter();
      this.setState({ filterGender: gender });
      return;
    }

    const trips =
      this.state.filterArea === -1 ? this.state.allTrips : this.state.areaTrips;

    const filteredTrips = trips.filter(t => t.member_gender === gender);

    this.setState({
      filterGender: gender,
      trips: filteredTrips,
    });
  }

  filterByMonthRange([start, end]) {
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

    const isNextYear = end >= 12;
    const endMonth = isNextYear ? end - 12 : end;
    console.log(`filtering data from ${months[start]} to ${months[endMonth]}`);

    if (start === 0 && end === 0) {
      this.resetMonthFilter();
      this.resetFilter();
      return;
    }

    const trips =
      this.state.filterArea === -1 ? this.state.allTrips : this.state.areaTrips;

    const filteredTrips = trips.filter(
      t => t.start_time.getMonth() >= start && t.start_time.getMonth() < end
    );

    this.setState({
      filterMonth: [start, end],
      trips: filteredTrips,
    });
  }

  handleSliderChange(e) {
    this.setState({ filterMonth: e });
  }

  handleSliderAfterChange(e) {
    this.applyFilter('month', e);
  }

  handleTabChange(event, value, history) {
    this.setState({ value });
    history.push(value);
  }

  handleAreaChange(event) {
    const areaId = event.target ? event.target.value : (Math.random() * 3) | 0;
    this.applyFilter('area', areaId);
  }

  render() {
    const { classes } = this.props;
    const areas = [{ id: 0, name: 'All' }, ...Areas];

    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <AppBar position="sticky" color="primary" className={classes.appBar}>
            <Toolbar className={classes.appBar}>
              <img src={logo} className="App-logo" alt="logo" />
              <Typography
                variant="title"
                color="inherit"
                onClick={() =>
                  this.applyFilter('gender', (Math.random() * 2) | 0)
                }
              >
                Bike Sharing
              </Typography>
              <TextField
                id="select-area"
                select
                className={classes.textField}
                value={this.state.filterArea}
                onChange={this.handleAreaChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                margin="normal"
              >
                {areas.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Toolbar>
            <Route
              render={({ history }) => (
                <Tabs
                  value={this.state.value}
                  onChange={(e, v) => this.handleTabChange(e, v, history)}
                >
                  <Tab value="/" label="Dashboard" />
                  <Tab value="/data" label="Data" />
                  <Tab value="/members" label="Members" />
                  <Tab value="/stations" label="Stations" />
                </Tabs>
              )}
            />
          </AppBar>
          <main className={this.props.classes.root}>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Dashboard
                    stations={this.state.stations}
                    trips={this.state.trips}
                    handleSliderChange={this.handleSliderChange}
                    handleSliderAfterChange={this.handleSliderAfterChange}
                    sliderValue={this.state.filterMonth}
                  />
                )}
              />
              <Route
                path="/members"
                render={() => <Bubble trips={this.state.trips} />}
              />
              <Route
                path="/stations"
                render={() => (
                  <MapContainer
                    stations={this.state.stations}
                    stationIndices={this.state.stationIndices}
                    trips={this.state.trips}
                  />
                )}
              />
              <Route
                path="/data"
                render={() => <DataViewer trips={this.state.trips} />}
              />
            </Switch>
          </main>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const styles = theme => {
  return {
    root: {
      marginTop: theme.spacing.unit * 3,
    },
    appBar: {
      color: 'black',
      backgroundColor: 'white',
      justifyContent: 'space-between',
    },
    textField: {
      width: 160,
    },
    menu: {
      width: 200,
    },
  };
};

export default withStyles(styles, { withTheme: true })(App);
