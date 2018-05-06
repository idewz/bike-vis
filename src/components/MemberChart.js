import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { green } from 'material-ui/colors';
import NestedMap from './NestedMap';

class MemberChart extends Component {
  getData() {
    if (this.props.trips === undefined || this.props.trips.length === 0) {
      return [50, 50];
    }

    const data = new Array(2).fill(0);

    this.props.trips.forEach(t => {
      data[t.user_type]++;
    });

    return data;
  }

  render() {
    const colors = [green[800], green[500]];
    const data = this.getData();
    const labels = ['Subscriber', 'Customer'];

    return (
      <NestedMap data={data} labels={labels} colors={colors} unit="trips" />
    );
  }
}

MemberChart.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default MemberChart;
