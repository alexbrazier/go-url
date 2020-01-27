import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {
  displayFlashError,
  displayFlashSuccess,
} from '../../redux/flash/actions';
import useStyles from './useStyles';

interface ModalProps {
  edit?: Boolean;
  urlKey?: string;
  url?: string;
  onClose: () => void;
  displayFlashSuccess: (message: string) => void;
  displayFlashError: (message: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  edit,
  urlKey: initialKey = '',
  url: initialUrl = '',
  onClose,
  displayFlashSuccess,
  displayFlashError,
}) => {
  const [urlKey, setKey] = useState(initialKey);
  const [url, setUrl] = useState(initialUrl);
  const [query, submit] = useState();
  const classes = useStyles({});

  useEffect(() => {
    if (!query) return;
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
      .catch(err =>
        displayFlashError(err.response.data.message || err.response.data),
      );
  }, [query, displayFlashSuccess, displayFlashError, onClose, edit]);
  return (
    <Dialog open onClose={onClose} data-e2e="modal">
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
        <Button onClick={onClose} color="secondary" data-e2e="cancel">
          Cancel
        </Button>
        <Button
          onClick={() => submit({ urlKey, url })}
          color="primary"
          data-e2e="submit"
        >
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

export default connect(
  null,
  mapDispatch,
  // @ts-ignore
)(Modal);
