import React, { Component } from 'react';
import Chart from '../Chart';
import { csv } from 'd3-fetch';
import Trip from '../Trip';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';

import './App.css';
import logo from '../bike_white_48px.svg';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
    };
  }

  async componentWillMount() {
    const trips = await csv('../data/ford_gobike/mini.csv');

    this.setState({ data: trips.map(Trip) });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Bike Sharing</h1>
              <nav>
                <Link to="/">Home</Link>
                <Link to="/debug">Debug</Link>
              </nav>
            </header>
          </div>
          <Switch>
            <Route exact path="/" component={null} />
            <Route
              path="/debug"
              render={() => <Chart data={this.state.data} />}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
