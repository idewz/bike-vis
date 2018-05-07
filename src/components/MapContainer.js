import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import MyMap from './MyMap';

class MapContainer extends Component {
  constructor() {
    super();

    this.state = {
      selectedId: undefined,
    };

    this.handleStationChange = this.handleStationChange.bind(this);
  }

  handleStationChange(selectedId) {
    this.setState({ selectedId });
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={8}>
          <MyMap
            stations={this.props.stations}
            handleStationChange={this.handleStationChange}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1SheoT7QbC2NwkAQnM50vckjfPJSXv6s&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `80vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {this.state.selectedId && (
            <Typography variant="headline">
              {
                this.props.stations.find(e => e.id === this.state.selectedId)
                  .name
              }
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
}

MapContainer.propTypes = {
  stations: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
};

export default MapContainer;
