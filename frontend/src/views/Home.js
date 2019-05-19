import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Results from '../components/Results';
import { displayFlashError } from '../redux/flash/actions';

const styles = {
  container: {
    maxWidth: 800,
    margin: '20px auto',
  },
};

const Home = ({ search, classes, match, location, displayFlashError }) => {
  const [querySearchResults, setQuerySearchResults] = useState('');
  const [popular, setPopular] = useState();

  useEffect(() => {
    axios.get('/api/popular').then(({ data }) => setPopular(data));
    const { search } = location;
    const { message } = qs.parse(search.slice(1));
    if (message) {
      displayFlashError(message);
    }
    const { query } = match.params;
    if (query) {
      axios
        .get('/api/search', { params: { q: query } })
        .then(({ data }) => setQuerySearchResults(data));
    }
  }, []);
  return (
    <div>
      {(search.results || querySearchResults) && (
        <div className={classes.container}>
          <Results
            data={search.results || querySearchResults}
            title="Search Results"
          />
        </div>
      )}
      {popular && (
        <div className={classes.container}>
          <Results data={popular} title="Most Popular" />
        </div>
      )}
    </div>
  );
};

const mapState = ({ flash, search }) => ({ flash, search });

const mapDispatch = {
  displayFlashError,
};

export default compose(
  connect(
    mapState,
    mapDispatch,
  ),
  withStyles(styles),
  withRouter,
)(Home);
