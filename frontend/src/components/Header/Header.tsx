import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Search from '../Search';
import useStyles from './useStyles';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const name = Cookies.get('user');
    if (name) {
      setName(name);
    }
  }, []);
  const classes = useStyles({});

  return (
    <>
      <AppBar
        position="static"
        style={{
          backgroundColor: '#fcf8e3',
          color: '#8a6d3b',
          textAlign: 'center',
          fontWeight: 'bold',
          padding: 10,
        }}
      >
        This is a static demo app, so nothing can be added or edited.
      </AppBar>
      <AppBar position="static">
        <Toolbar>
          <a className={classes.link} href="#">
            <Typography variant="h6" color="inherit">
              Go
            </Typography>
          </a>
          <a
            className={classes.link}
            href="https://github.com/alexbrazier/go-url"
          >
            Help
          </a>
          <div className={classes.grow} />
          <Search onSearch={onSearch} />

          {name && <span className={classes.name}>{name}</span>}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
