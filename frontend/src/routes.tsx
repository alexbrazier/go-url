import {
  Redirect,
  Route,
  HashRouter as Router,
  Switch,
} from 'react-router-dom';
import React from 'react';
import Home from './views/Home';
import Layout from './views/Layout';

const Routes = () => (
  <Router>
    <Layout>
      <Switch>
        <Route exact path="/:query?" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  </Router>
);

export default Routes;
