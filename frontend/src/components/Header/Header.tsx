import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Search from '../Search';
import styles from './styles';

interface HeaderProps extends WithStyles<typeof styles> {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ classes, onSearch }) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const name = Cookies.get('user');
    if (name) {
      setName(name);
    }
  }, []);

  return (
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
        <Search onSearch={onSearch} />

        {name && <span className={classes.name}>{name}</span>}
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
