import React, { useState, useCallback } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Modal from '../Modal';
import useStyles from './useStyles';

interface IResult {
  key: string;
  url: string;
  alias: string[];
  views: number;
}

interface ResultsProps {
  data: IResult[];
  title: string;
}

const Results: React.FC<ResultsProps> = ({ data, title }) => {
  const [selected, setSelected] = useState<IResult | null>(null);
  const clearSelected = useCallback(() => setSelected(null), []);
  const classes = useStyles();
  return (
    <div>
      {selected && (
        <Modal
          edit
          urlKey={selected.key}
          url={selected.url || selected.alias.join(',')}
          onClose={clearSelected}
        />
      )}

      <Paper className={classes.paper} data-e2e="main-table">
        <h3>{title}</h3>
        {!data.length ? (
          <p>No results found. Help others by adding it.</p>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Url</TableCell>
                <TableCell align="right">Views</TableCell>
                <TableCell align="right">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(r => (
                <TableRow key={r.key} className={classes.tableRow}>
                  <TableCell>{r.key}</TableCell>
                  <TableCell className={classes.urlCell}>
                    {r.alias && r.alias.length ? (
                      r.alias.map(alias => (
                        <a
                          key={alias}
                          className={classes.url}
                          href={`/${alias}`}
                        >
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
                  <TableCell align="right">{r.views}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      className={classes.editIcon}
                      onClick={() => setSelected(r)}
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
};

export default Results;
