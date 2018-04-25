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
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Bubble from '../components/Bubble';
import Dashboard from '../Dashboard';
import Station from '../models/Station';
import Trip from '../models/Trip';

import './App.css';
import logo from '../bike_white_48px.svg';

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
      stations: [],
      trips: [],
      value: '/',
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  async componentWillMount() {
    const station_data = await csv('../data/ford_gobike/stations.csv');
    const stations = [];
    station_data.forEach(s => {
      stations[s.id] = new Station(s);
    });

    const trip_data = await csv('../data/ford_gobike/mini.csv');
    this.setState({
      stations: stations.filter(e => e !== undefined),
      trips: trip_data.map(t => new Trip(t, stations)),
    });
  }

  handleTabChange(event, value, history) {
    this.setState({ value });
    history.push(value);
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <img src={logo} className="App-logo" alt="logo" />
              <Typography variant="title" color="inherit">
                Bike Sharing
              </Typography>
            </Toolbar>
            <Route
              render={({ history }) => (
                <Tabs
                  value={this.state.value}
                  onChange={(e, v) => this.handleTabChange(e, v, history)}
                >
                  <Tab value="/" label="Dashboard" />
                  <Tab value="/member" label="Member" />
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
                path="/member"
                render={() => <Bubble trips={this.state.trips} />}
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
  };
};

export default withStyles(styles, { withTheme: true })(App);
