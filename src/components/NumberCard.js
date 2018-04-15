import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

function NumberCard(props) {
  const classes = props.classes;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography
          className={classes.value}
          variant="display3"
          align="center"
          noWrap
        >
          {props.value}
        </Typography>
        <Grid
          container
          className={classes.title}
          align="center"
          justify="center"
        >
          {props.children} &nbsp;
          <Typography variant="title">{props.title}</Typography>
        </Grid>
      </CardContent>
    </Card>
  );
}

NumberCard.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

NumberCard.defaultProps = {
  children: undefined,
};

const style = theme => ({
  card: {
    height: 96,

    [theme.breakpoints.up('sm')]: {
      height: 104,
    },

    [theme.breakpoints.up('md')]: {
      height: 112,
    },

    [theme.breakpoints.up('lg')]: {
      height: 136,
    },
  },

  content: {
    paddingTop: `${theme.spacing.unit}px`,
    paddingBottom: `${theme.spacing.unit}px`,
  },

  title: {
    marginTop: theme.spacing.unit,
  },

  value: {
    fontSize: '2em',

    [theme.breakpoints.up('sm')]: {
      fontSize: '2.5em',
    },

    [theme.breakpoints.up('md')]: {
      fontSize: '2.7em',
    },

    [theme.breakpoints.up('lg')]: {
      fontSize: '3.8em',
    },
  },
});

export default withStyles(style)(NumberCard);
