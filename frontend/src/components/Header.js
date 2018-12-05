import React from 'react';
import Cookies from 'js-cookie';
import { compose, lifecycle } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Search from './Search';

const styles = {
  grow: {
    flexGrow: 1,
  },
  name: {
    marginLeft: 20,
    fontWeight: 500,
  },
  link: {
    textDecoration: 'none',
    padding: 10,
    color: 'white',
    marginLeft: 30,
    fontWeight: '600',
  },
};

const Header = ({ classes, onSearchResults, onSearch, name }) => (
  <AppBar position="static">
    <Toolbar>
      <a className={classes.link} href="/go">
        <Typography variant="h6" color="inherit">
          Go
        </Typography>
      </a>
      <a className={classes.link} href="/help">
        Help
      </a>
      <div className={classes.grow} />
      <Search onResults={onSearchResults} onSearch={onSearch} />

      {name && <span className={classes.name}>{name}</span>}
    </Toolbar>
  </AppBar>
);

export default compose(
  lifecycle({
    componentDidMount() {
      const name = Cookies.get('user');
      if (name) {
        this.setState({ name });
      }
    },
  }),
  withStyles(styles),
)(Header);
