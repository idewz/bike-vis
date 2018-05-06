import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

class MyMap extends Component {
  constructor(props) {
    super(props);

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
  }

  renderMarker(station) {
    return (
      <Marker
        key={station.id}
        position={{ lat: station.latitude, lng: station.longitude }}
      />
    );
  }

  renderMarkers() {
    return this.props.stations.map(this.renderMarker);
  }

  render() {
    const station = this.props.stations[0];
    const center = station
      ? { lat: station.latitude, lng: station.longitude }
      : { lat: 0, lng: 0 };

    if (station === undefined) {
      return null;
    }

    return (
      <GoogleMap defaultZoom={9} defaultCenter={center}>
        {this.props.isMarkerShown && (
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {this.renderMarkers()}
          </MarkerClusterer>
        )}
      </GoogleMap>
    );
  }
}

MyMap.propTypes = {
  stations: PropTypes.array.isRequired,
  isMarkerShown: PropTypes.bool,
};

MyMap.defaultProps = {
  isMarkerShown: true,
};

export default withScriptjs(withGoogleMap(MyMap));
