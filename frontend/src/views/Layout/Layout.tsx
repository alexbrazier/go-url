import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../../components/Modal';
import Header from '../../components/Header';
import Alert from '../../components/Alert';
import { Variant } from '../../components/Alert/SnackbarContentWrapper';
import useStyles from './useStyles';

interface LayoutProps {
  flash: {
    message: string;
    variant: Variant;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, flash }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [query, onSearch] = useState<string>();
  const classes = useStyles({});
  const hideAdd = useCallback(() => setAddOpen(false), []);
  const history = useHistory();
  const location = useLocation();
  // Pre-populate field if not found
  const urlQuery =
    location.search.includes('message=') && location.pathname.slice(1);

  useEffect(() => {
    if (query === undefined) return;
    history.push(`/${query}`);
  }, [query, history]);

  return (
    <div>
      {flash.message && (
        <Alert variant={flash.variant} message={flash.message} />
      )}
      {addOpen && <Modal onClose={hideAdd} urlKey={urlQuery || undefined} />}
      <Header onSearch={onSearch} />
      {children}
      <Tooltip title="Add New URL">
        <Fab
          data-e2e="add-button"
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
export default connect(mapState)(Layout);
