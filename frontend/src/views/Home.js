import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { bindActionCreators } from 'redux';
import { compose, lifecycle, withState } from 'recompose';
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

const Home = ({ search, querySearchResults, popular, classes }) => (
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

export default compose(
  connect(
    ({ flash, search }) => ({ flash, search }),
    dispatch => bindActionCreators({ displayFlashError }, dispatch),
  ),
  withState('querySearchResults', 'onSearchResults', null),
  lifecycle({
    componentDidMount() {
      axios
        .get('/api/popular')
        .then(({ data }) => this.setState({ popular: data }));
      const { search } = this.props.location;
      const { message } = qs.parse(search.slice(1));
      if (message) {
        this.props.displayFlashError(message);
      }
      const { query } = this.props.match.params;
      if (query) {
        axios
          .get('/api/search', { params: { q: query } })
          .then(({ data }) => this.props.onSearchResults(data));
      }
    },
  }),
  withStyles(styles),
  withRouter,
)(Home);
