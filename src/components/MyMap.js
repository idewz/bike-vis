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

    this.state = {};

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  handleMarkerClick(id) {
    this.props.handleStationChange(id);
  }

  renderMarker(station) {
    const match = this.props.selectedId === station.id;
    return (
      <Marker
        key={station.id}
        animation={match ? 4 : 0}
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
    return this.props.stations.map(this.renderMarker);
  }

  render() {
    return (
      <GoogleMap
        ref={node => (this.node = node)}
        defaultZoom={10}
        defaultCenter={this.props.center}
        center={this.props.center}
        zoom={this.props.zoom}
        onZoomChanged={() => {
          this.props.handleZoomChange(this.node.getZoom());
        }}
      >
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {this.props.stations && this.renderMarkers()}
        </MarkerClusterer>
      </GoogleMap>
    );
  }
}

MyMap.propTypes = {
  center: PropTypes.object,
  stations: PropTypes.array.isRequired,
  handleStationChange: PropTypes.func.isRequired,
  handleZoomChange: PropTypes.func.isRequired,
  selectedId: PropTypes.number,
  zoom: PropTypes.number,
};

MyMap.defaultProps = {
  center: { lat: 37.78637526861584, lng: -122.40490436553954 },
  selectedId: 0,
  zoom: 10,
};

export default withScriptjs(withGoogleMap(MyMap));
