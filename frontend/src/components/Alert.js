import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import { clearFlash } from '../redux/flash/actions';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const CustomSnackbarContent = props => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

const SnackbarContentWrapper = withStyles(styles)(CustomSnackbarContent);

const Alert = ({ variant, message, onClose }) => (
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

Alert.propTypes = {
  message: PropTypes.node,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const enhance = compose(
  connect(
    null,
    dispatch => bindActionCreators({ clearFlash }, dispatch),
  ),
  withHandlers({
    onClose: ({ clearFlash }) => (e, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      clearFlash();
    },
  }),
);

export default enhance(Alert);
