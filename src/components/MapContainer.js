import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MyMap from './MyMap';

class MapContainer extends Component {
  render() {
    return (
      <MyMap
        stations={this.props.stations}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1SheoT7QbC2NwkAQnM50vckjfPJSXv6s&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ width: '70%', height: `80vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

MapContainer.propTypes = {
  stations: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
};

export default MapContainer;
