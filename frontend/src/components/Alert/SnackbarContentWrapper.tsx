import React from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

import useStyles from './useStyles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export type Variant = 'success' | 'warning' | 'error' | 'info';

interface SnackbarContentWrapperProps {
  className?: string;
  message: React.ReactNode;
  onClose: (e: any, reason: string) => void;
  variant: Variant;
}

const SnackbarContentWrapper: React.FC<SnackbarContentWrapperProps> = props => {
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  const classes = useStyles();

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
          // @ts-ignore
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

export default SnackbarContentWrapper;
