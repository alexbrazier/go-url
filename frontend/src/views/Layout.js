import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
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

const Layout = ({ children, onSearch, flash, classes, showAdd, addOpen }) => (
  <div>
    {flash.message && <Alert variant={flash.variant} message={flash.message} />}
    {addOpen && <Modal onClose={() => showAdd(false)} />}
    <Header onSearch={onSearch} />
    {children}
    <Tooltip title="Add New URL">
      <Button
        variant="fab"
        color="secondary"
        aria-label="Add"
        className={classes.button}
        onClick={() => showAdd(true)}
      >
        <AddIcon />
      </Button>
    </Tooltip>
  </div>
);

export default compose(
  connect(
    ({ flash }) => ({ flash }),
    dispatch => bindActionCreators({ searchResults }, dispatch),
  ),
  withState('addOpen', 'showAdd', false),
  withRouter,
  withHandlers({
    onSearch: ({ searchResults, history }) => query => {
      history.push(`/${query}`);
      axios
        .get('/api/search', { params: { q: query } })
        .then(({ data }) => searchResults(data));
    },
  }),
  withStyles(styles),
)(Layout);
