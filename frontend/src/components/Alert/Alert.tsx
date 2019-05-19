import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { clearFlash } from '../../redux/flash/actions';
import SnackbarContentWrapper, { Variant } from './SnackbarContentWrapper';

interface AlertProps {
  variant: Variant;
  message: React.ReactNode;
  clearFlash: () => void;
}

const Alert: React.SFC<AlertProps> = ({ variant, message, clearFlash }) => {
  const onClose = (_: any, reason: string) =>
    reason === 'clickaway' && clearFlash();
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContentWrapper
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};

const mapDispatch = {
  clearFlash,
};

export default connect(
  null,
  mapDispatch,
)(Alert);
