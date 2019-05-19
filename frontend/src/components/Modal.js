import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { displayFlashError, displayFlashSuccess } from '../redux/flash/actions';

const styles = {
  textField: {
    marginTop: 10,
  },
  actions: {
    marginTop: 15,
  },
};

const Modal = ({ edit, onClose, classes }) => {
  const [urlKey, setKey] = useState('');
  const [url, setUrl] = useState('');
  const [query, submit] = useState({ urlKey, url });

  useEffect(() => {
    axios({
      method: edit ? 'put' : 'post',
      url: `/${query.urlKey}`,
      data: { url: query.url },
    })
      .then(({ data }) => {
        displayFlashSuccess(
          `Successfully set ${data.key} to ${data.url || data.alias}`,
        );
        onClose();
      })
      .catch(err => displayFlashError(err.response.data.message));
  }, [query]);
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{edit ? `Edit ${urlKey}` : 'Add new url'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {edit
            ? `You are editing the link for "${urlKey}". Please remember that this will change the url for everyone, so only do so if the url is wrong.`
            : 'Enter key and url to add new link'}
        </DialogContentText>
        {!edit && (
          <TextField
            id="key"
            label="Key"
            type="text"
            className={classes.textField}
            fullWidth
            autoComplete="off"
            onChange={e => setKey(e.target.value)}
            value={urlKey}
          />
        )}
        <TextField
          id="url"
          label="Url"
          type="text"
          className={classes.textField}
          fullWidth
          autoComplete="off"
          onChange={e => setUrl(e.target.value)}
          value={url}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => submit({ urlKey, url })} color="primary">
          {edit ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatch = {
  displayFlashSuccess,
  displayFlashError,
};

const enhance = compose(
  connect(
    null,
    mapDispatch,
  ),
  withStyles(styles),
);

export default enhance(Modal);
