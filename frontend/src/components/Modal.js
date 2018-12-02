import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {
  compose,
  defaultProps,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { connect } from 'react-redux';
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

const Modal = ({
  edit,
  onChangeKey,
  onChangeUrl,
  urlKey,
  url,
  onClose,
  onSubmitForm,
  classes,
}) => (
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
          onChange={onChangeKey}
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
        onChange={onChangeUrl}
        value={url}
      />
    </DialogContent>
    <DialogActions className={classes.actions}>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button onClick={onSubmitForm} color="primary">
        {edit ? 'Update' : 'Add'}
      </Button>
    </DialogActions>
  </Dialog>
);

const enhance = compose(
  connect(
    null,
    dispatch =>
      bindActionCreators({ displayFlashSuccess, displayFlashError }, dispatch),
  ),
  withStateHandlers(({ urlKey, url }) => ({ urlKey, url }), {
    onChangeKey: () => event => ({ urlKey: event.target.value }),
    onChangeUrl: () => event => ({ url: event.target.value }),
  }),
  withHandlers({
    onSubmitForm: ({
      edit,
      urlKey,
      url,
      onClose,
      displayFlashSuccess,
      displayFlashError,
    }) => () => {
      axios({
        method: edit ? 'put' : 'post',
        url: `/${urlKey}`,
        data: { url },
      })
        .then(({ data }) => {
          displayFlashSuccess(
            `Successfully set ${data.key} to ${data.url || data.alias}`,
          );
          onClose();
        })
        .catch(err => displayFlashError(err.response.data.message));
    },
  }),
  defaultProps({
    urlKey: '',
    url: '',
  }),
  withStyles(styles),
);

export default enhance(Modal);
