import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../components/Modal';
import Header from '../components/Header';
import Alert from '../components/Alert';
import { searchResults } from '../redux/search/actions';

const styles = {
  button: {
    position: 'fixed',
    right: 23,
    bottom: 23,
  },
};

const Layout = ({ children, history, searchResults, flash, classes }) => {
  const [addOpen, showAdd] = useState(false);
  const [query, onSearch] = useState();

  useEffect(() => {
    if (query === undefined) return;
    history.push(`/${query}`);
    axios
      .get('/api/search', { params: { q: query } })
      .then(({ data }) => searchResults(data));
  }, [query]);

  return (
    <div>
      {flash.message && (
        <Alert variant={flash.variant} message={flash.message} />
      )}
      {addOpen && <Modal onClose={() => showAdd(false)} />}
      <Header onSearch={onSearch} />
      {children}
      <Tooltip title="Add New URL">
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.button}
          onClick={() => showAdd(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

const mapState = ({ flash }) => ({ flash });
const mapDispatch = {
  searchResults,
};

export default compose(
  connect(
    mapState,
    mapDispatch,
  ),
  withRouter,
  withStyles(styles),
)(Layout);
