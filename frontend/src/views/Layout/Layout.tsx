import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import Alert from '../../components/Alert';
import { Variant } from '../../components/Alert/SnackbarContentWrapper';
import useStyles from './useStyles';

interface LayoutProps {
  history: string[];
  flash: {
    message: string;
    variant: Variant;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, history, flash }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [query, onSearch] = useState();
  const classes = useStyles();
  const hideAdd = useCallback(() => setAddOpen(false), []);

  useEffect(() => {
    if (query === undefined) return;
    history.push(`/${query}`);
  }, [query, history]);

  return (
    <div>
      {flash.message && (
        <Alert variant={flash.variant} message={flash.message} />
      )}
      {addOpen && <Modal onClose={hideAdd} />}
      <Header onSearch={onSearch} />
      {children}
      <Tooltip title="Add New URL">
        <Fab
          color="secondary"
          aria-label="Add"
          className={classes.button}
          onClick={() => setAddOpen(true)}
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
  withRouter,
)(Layout);
