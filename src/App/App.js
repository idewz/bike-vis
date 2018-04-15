import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { csv } from 'd3-fetch';

import Dashboard from '../Dashboard';

import Station from '../models/Station';
import Trip from '../models/Trip';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import './App.css';
import logo from '../bike_white_48px.svg';

class App extends Component {
  constructor() {
    super();

    this.state = {
      stations: [],
      trips: [],
    };
  }

  async componentWillMount() {
    const station_data = await csv('../data/ford_gobike/stations.csv');
    const stations = station_data.map(s => new Station(s));

    const trip_data = await csv('../data/ford_gobike/mini.csv');
    this.setState({
      stations,
      trips: trip_data.map(t => new Trip(t, stations)),
    });
  }

  render() {
    const theme = createMuiTheme();

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
          </AppBar>
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
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
