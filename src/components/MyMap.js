/* eslint-disable no-undef */
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

    this.renderLineMarker = this.renderLineMarker.bind(this);
    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  getSymbol(to, from) {
    const pos1 = new google.maps.LatLng(from.position.lat, from.position.lng);
    const pos2 = new google.maps.LatLng(to.position.lat, to.position.lng);

    const projection = this.node.getProjection();
    const p1 = projection.fromLatLngToPoint(pos1);
    const p2 = projection.fromLatLngToPoint(pos2);
    const curvature = 0.1;

    const e = new google.maps.Point(p2.x - p1.x, p2.y - p1.y);
    const m = new google.maps.Point(e.x / 2, e.y / 2);
    let o;

    if (e.y >= 0) {
      o = new google.maps.Point(-e.y, e.x);
    } else {
      o = new google.maps.Point(e.y, -e.x);
    }

    const c = new google.maps.Point(
      m.x + curvature * o.x,
      m.y + curvature * o.y
    );
    const pathDef = 'M 0,0 q ' + c.x + ',' + c.y + ' ' + e.x + ',' + e.y;

    const zoom = this.props.zoom;
    const scale = 1 / Math.pow(2, -zoom);
    const symbol = {
      path: pathDef,
      scale: scale,
      strokeWeight: 0.7,
      fillColor: 'None',
      strokeColor: 'yellow',
      strokeOpacity: 0.8,
    };

    return symbol;
  }

  handleMarkerClick(id) {
    this.props.handleStationChange(id);
  }

  renderLineMarker(station) {
    const { selectedId } = this.props;
    const from = this.props.stations.find(s => s.id === selectedId);
    const to = station;
    const symbol = this.getSymbol(from, to);

    return (
      <Marker
        key={station.id}
        icon={symbol}
        position={station.position}
        zIndex={-100}
      />
    );
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
        position={station.position}
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

  renderMarkers(func = this.renderMarker) {
    return this.props.destinations.length
      ? this.props.stations
          .filter(
            s =>
              this.props.destinations.find(t => t.id === s.id) ||
              s.id === this.props.selectedId
          )
          .map(func)
      : this.props.stations.map(func);
  }

  render() {
    const { selectedId, stations } = this.props;
    const stationNotFound = stations.findIndex(s => s.id === selectedId) === -1;

    return (
      <GoogleMap
        ref={node => (this.node = node)}
        defaultZoom={10}
        defaultOptions={{ styles }}
        defaultCenter={this.props.center}
        center={this.props.center}
        zoom={this.props.zoom}
        onZoomChanged={() => {
          this.props.handleZoomChange(this.node.getZoom());
        }}
      >
        {stationNotFound && (
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {stations && this.renderMarkers()}
          </MarkerClusterer>
        )}
        {!stationNotFound &&
          (stations && this.renderMarkers(this.renderLineMarker))}
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
