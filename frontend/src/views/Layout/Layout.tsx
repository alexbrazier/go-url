import React, { useState, useEffect } from 'react';
import { compose } from 'recompose'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import Alert from '../../components/Alert';
import styles from './styles';
import { Variant } from '../../components/Alert/SnackbarContentWrapper';

interface LayoutProps extends WithStyles<typeof styles> {
  history: string[];
  flash: {
    message: string;
    variant: Variant;
  };
}

const Layout: React.FC<LayoutProps> = ({
  children,
  history,
  flash,
  classes,
}) => {
  const [addOpen, showAdd] = useState(false);
  const [query, onSearch] = useState();

  useEffect(() => {
    if (query === undefined) return;
    history.push(`/${query}`);
  }, [query, history]);

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
export default compose(
  connect(mapState),
  withStyles(styles),
  withRouter,
)(Layout);
