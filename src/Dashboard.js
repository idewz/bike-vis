import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NumberCardList from './components/NumberCardList';

import { blue, green } from 'material-ui/colors';
import BikeIcon from 'material-ui-icons/DirectionsBike';
import PlaceIcon from 'material-ui-icons/Place';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  renderRows() {
    const t = this.props.trips[this.state.value];

    if (t === undefined) {
      return null;
    }

    const Row = ({ objKey, objVal }) => (
      <tr>
        <td>{objKey}</td>
        <td>{objVal instanceof Object ? objVal.toString() : objVal}</td>
      </tr>
    );

    const values = Object.keys(t).map(key => ({ key, val: t[key] }));

    return values.map(v => <Row key={v.key} objKey={v.key} objVal={v.val} />);
  }

  render() {
    const cards = [
      {
        title: 'Trips',
        value: this.props.trips.length.toString(),
        icon: BikeIcon,
        color: blue[500],
      },
      {
        title: 'Stations',
        value: this.props.stations.length.toString(),
        icon: PlaceIcon,
        color: green[500],
      },
    ];

    return (
      <Fragment>
        <NumberCardList cards={cards} />
        {this.props.trips.length !== 0 && (
          <Fragment>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>{this.renderRows()}</tbody>
            </table>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  stations: PropTypes.array.isRequired,
  trips: PropTypes.array.isRequired,
};

export default Dashboard;
