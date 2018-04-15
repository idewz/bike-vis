import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import NumberCard from '../components/NumberCard';

function NumberCardList(props) {
  const renderCard = card => {
    const classes = props.classes;

    return (
      <Grid item key={card.title} xs={8} md={4}>
        <NumberCard {...card}>
          <card.icon className={classes.icon} style={{ fill: card.color }} />
        </NumberCard>
      </Grid>
    );
  };

  return (
    <Grid container justify="center" spacing={24}>
      {props.cards.map(renderCard)}
    </Grid>
  );
}

NumberCardList.propTypes = {
  classes: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
};

const styles = theme => ({
  icon: {
    height: '1.4em',
    width: '1.4em',
    fill: props => props.color,
  },
});

export default withStyles(styles)(NumberCardList);
