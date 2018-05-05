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
import Matrix from '../Matrix';

import Areas from '../../models/Areas';
import Station from '../../models/Station';
import Trip from '../../models/Trip';

import './App.css';
import logo from '../../bike_black_48px.svg';

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
      areaId: 0,
      allStations: [],
      allTrips: [],
      stations: [],
      trips: [],
      value: '/',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleAreaChange = this.handleAreaChange.bind(this);
  }

  async componentWillMount() {
    const station_data = await csv('../data/ford_gobike/stations.csv');
    const stations = [];
    station_data.forEach(s => {
      stations[s.id] = new Station(s, Areas);
    });

    const trip_data = await csv('../data/ford_gobike/mini.csv');
    const definedStations = stations.filter(e => e !== undefined);
    const trips = trip_data.map(t => new Trip(t, definedStations));

    this.setState({
      allStations: definedStations,
      allTrips: trips,
      stations: definedStations,
      trips,
    });
  }

  filterDataByArea(areaId) {
    if (areaId === 0) {
      this.setState({
        stations: this.state.allStations,
        trips: this.state.allTrips,
      });
    } else {
      const trips = this.state.allTrips.filter(t => {
        return (
          t.start_station.area.id === areaId || t.end_station.area.id === areaId
        );
      });
      const stations = this.state.allStations.filter(s => s.area.id === areaId);

      this.setState({ stations, trips });
    }

    this.setState({ areaId });
  }

  handleTabChange(event, value, history) {
    this.setState({ value });
    history.push(value);
  }

  handleAreaChange(event) {
    const areaId = event.target.value || (Math.random() * 3) | 0;
    this.filterDataByArea(areaId);
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
                onClick={this.handleAreaChange}
              >
                Bike Sharing
              </Typography>
              <TextField
                id="select-area"
                select
                className={classes.textField}
                value={this.state.areaId}
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
                  <Matrix
                    stations={this.state.stations}
                    trips={this.state.trips}
                  />
                )}
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
