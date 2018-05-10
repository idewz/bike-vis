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
import styles from './style.json';

class MyMap extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  handleMarkerClick(id) {
    this.props.handleStationChange(id);
  }

  renderMarker(station) {
    const { selectedId, destinations } = this.props;
    const match = selectedId === station.id;
    const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const index = destinations.findIndex(s => s.id === station.id);

    return (
      <Marker
        key={station.id}
        animation={match ? 4 : 0}
        label={index !== -1 ? labels[index] : undefined}
        position={{ lat: station.latitude, lng: station.longitude }}
        onClick={() => this.handleMarkerClick(station.id)}
      >
        {match && (
          <InfoWindow>
            <div>{station.name}</div>
          </InfoWindow>
        )}
      </Marker>
    );
  }

  renderMarkers() {
    return this.props.destinations.length
      ? this.props.stations
          .filter(
            s =>
              this.props.destinations.find(t => t.id === s.id) ||
              s.id === this.props.selectedId
          )
          .map(this.renderMarker)
      : this.props.stations.map(this.renderMarker);
  }

  findCenter(stations) {
    const s1 = stations[0];
    const coordinates = {
      x1: s1.latitude,
      y1: s1.longitude,
      x2: s1.latitude,
      y2: s1.longitude,
    };
    stations.forEach(s => {
      coordinates.x1 = Math.min(coordinates.x1, s.latitude);
      coordinates.y1 = Math.min(coordinates.y1, s.longitude);
      coordinates.x2 = Math.max(coordinates.x2, s.latitude);
      coordinates.y2 = Math.max(coordinates.y2, s.longitude);
    });

    const { x1, y1, x2, y2 } = coordinates;

    return { lat: x1 + (x2 - x1) / 2, lng: y1 + (y2 - y1) / 2 };
  }

  render() {
    const { selectedId, stations } = this.props;
    const stationNotFound = stations.findIndex(s => s.id === selectedId) === -1;
    let currentCenter = this.props.center;
    let currentZoom = this.props.zoom;

    if (stationNotFound && stations.length > 0) {
      currentCenter = this.findCenter(stations);
      currentZoom = 10;
    }

    return (
      <GoogleMap
        ref={node => (this.node = node)}
        defaultZoom={10}
        defaultOptions={{ styles }}
        center={currentCenter}
        zoom={currentZoom}
        onZoomChanged={() => {
          this.props.handleZoomChange(this.node.getZoom());
        }}
      >
        {stationNotFound && (
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {stations && this.renderMarkers()}
          </MarkerClusterer>
        )}
        {!stationNotFound && (stations && this.renderMarkers())}
      </GoogleMap>
    );
  }
}

MyMap.propTypes = {
  center: PropTypes.object,
  destinations: PropTypes.array,
  stations: PropTypes.array.isRequired,
  handleStationChange: PropTypes.func.isRequired,
  handleZoomChange: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
  zoom: PropTypes.number,
};

MyMap.defaultProps = {
  center: { lat: 37.78637526861584, lng: -122.40490436553954 },
  destinations: [],
  selectedId: 0,
  zoom: 10,
};

export default withScriptjs(withGoogleMap(MyMap));
