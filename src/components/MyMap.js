import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

class MyMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoIndex: undefined,
    };

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  handleMarkerClick(id) {
    this.setState({ infoIndex: id });
    this.props.handleStationChange(id);
  }

  renderMarker(station) {
    return (
      <Marker
        key={station.id}
        position={{ lat: station.latitude, lng: station.longitude }}
        onClick={() => this.handleMarkerClick(station.id)}
      >
        {this.state.infoIndex === station.id && (
          <InfoWindow>
            <div>{station.name}</div>
          </InfoWindow>
        )}
      </Marker>
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
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {this.renderMarkers()}
        </MarkerClusterer>
      </GoogleMap>
    );
  }
}

MyMap.propTypes = {
  stations: PropTypes.array.isRequired,
  handleStationChange: PropTypes.func.isRequired,
};

export default withScriptjs(withGoogleMap(MyMap));
