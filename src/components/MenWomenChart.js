import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { indigo, pink, blueGrey } from 'material-ui/colors';
import NestedMap from './NestedMap';

class MenWomenChart extends Component {
  getData() {
    if (this.props.trips === undefined || this.props.trips.length === 0) {
      return [50, 50, 0];
    }

    const data = new Array(3).fill(0);

    this.props.trips.forEach(t => {
      if (t.member_gender !== -1) {
        data[t.member_gender]++;
      } else {
        data[2]++;
      }
    });

    return data;
  }

  render() {
    const colors = [indigo[500], pink[400], blueGrey[300]];
    const data = this.getData();
    const labels = ['Men', 'Women', 'Others'];

    return <NestedMap data={data} labels={labels} colors={colors} />;
  }
}

MenWomenChart.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default MenWomenChart;
