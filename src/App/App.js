import React, { Component } from 'react';
import Chart from '../Chart';
import { csv } from 'd3-fetch';
import Trip from '../Trip';

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
    const trips = await csv(
      '../data/ford_gobike/201803_fordgobike_tripdata.csv',
    );

    this.setState({ data: trips.map(Trip) });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bike Sharing</h1>
        </header>
        <p className="App-intro" />
        <Chart data={this.state.data} />
      </div>
    );
  }
}

export default App;
