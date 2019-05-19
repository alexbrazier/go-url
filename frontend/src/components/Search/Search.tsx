import React, { useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import styles from './styles';

interface SearchProps extends WithStyles<typeof styles> {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ classes, onSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        onChange={e => setQuery(e.target.value)}
        value={query}
        onKeyPress={({ key }) => key === 'Enter' && onSearch(query)}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
    </div>
  );
};

export default withStyles(styles)(Search);
