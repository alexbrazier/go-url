import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Results from '../../components/Results';
import { displayFlashError } from '../../redux/flash/actions';
import useStyles from './useStyles';

interface HomeProps extends RouteComponentProps<{ query: string }> {
  displayFlashError: (message: string) => void;
  search: {
    results?: any;
  };
}

const Home: React.FC<HomeProps> = ({
  search,
  match,
  location,
  displayFlashError,
}) => {
  const [querySearchResults, setQuerySearchResults] = useState();
  const [popular, setPopular] = useState();
  const classes = useStyles({});

  useEffect(() => {
    import('../../mocks/data.json').then(data => setPopular(data.default));
  }, []);

  useEffect(() => {
    const search = location.search;
    const { message } = qs.parse(search.slice(1));
    if (message) {
      displayFlashError(message);
    }
  }, [location.search, displayFlashError]);

  useEffect(() => {
    const query = match.params.query;
    if (query) {
      import('../../mocks/data.json')
        .then(data =>
          data.default.filter(
            res => res.key.includes(query) || res.url.includes(query),
          ),
        )
        .then(data => setQuerySearchResults(data));
    }
  }, [match.params.query]);

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
  withRouter,
)(Home);
