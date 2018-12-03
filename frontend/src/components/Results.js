import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Modal from './Modal';

const Results = ({
  data,
  editModalOpen,
  openEditModal,
  closeEditModal,
  selected,
  title,
  classes,
}) => (
  <div>
    {editModalOpen && (
      <Modal
        edit
        urlKey={selected.key}
        url={selected.url || selected.alias.join(',')}
        onClose={closeEditModal}
      />
    )}

    <Paper className={classes.paper}>
      <h3>{title}</h3>
      {!data.length ? (
        <p>No results found. Help others by adding it.</p>
      ) : (
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Url</TableCell>
              <TableCell numeric>Views</TableCell>
              <TableCell numeric>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(r => (
              <TableRow key={r.key} className={classes.tableRow}>
                <TableCell>{r.key}</TableCell>
                <TableCell>
                  {r.alias && r.alias.length ? (
                    r.alias.map(alias => (
                      <a key={alias} className={classes.url} href={`/${alias}`}>
                        {alias}
                        <LaunchIcon className={classes.launchIcon} />
                      </a>
                    ))
                  ) : (
                    <a className={classes.url} href={`/${r.key}`}>
                      {r.url}
                      <LaunchIcon className={classes.launchIcon} />
                    </a>
                  )}
                </TableCell>
                <TableCell numeric>{r.views}</TableCell>
                <TableCell numeric>
                  <IconButton
                    className={classes.editIcon}
                    onClick={() => openEditModal(r)}
                  >
                    <EditIcon className={classes.edit} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  </div>
);

const styles = {
  paper: {
    padding: 15,
  },
  url: {
    color: 'grey',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  launchIcon: {
    width: 10,
  },
  edit: {
    color: 'grey',
  },
  editIcon: {
    padding: 3,
  },
  tableRow: {
    height: 'initial',
  },
};

const enhance = compose(
  withStateHandlers(
    { editModalOpen: false },
    {
      openEditModal: () => selected => ({ editModalOpen: true, selected }),
      closeEditModal: () => () => ({ editModalOpen: false }),
    },
  ),
  withStyles(styles),
);

export default enhance(Results);
