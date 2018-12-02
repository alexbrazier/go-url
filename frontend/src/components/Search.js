import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 300,
      '&:focus': {
        width: 400,
      },
    },
  },
});

const Search = ({ classes, onSearch, onUpdateSearch, query }) => (
  <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder="Search…"
      onChange={onUpdateSearch}
      value={query}
      onKeyPress={({ key }) => key === 'Enter' && onSearch(query)}
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
    />
  </div>
);

export default compose(
  withStateHandlers(
    { query: '' },
    {
      onUpdateSearch: () => event => ({ query: event.target.value }),
    },
  ),
  withStyles(styles),
)(Search);
