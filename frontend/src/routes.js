import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import React from 'react';
// import Help from './views/Help';
import Home from './views/Home';
import Layout from './views/Layout';

const Routes = () => (
  <Router basename="/go">
    <Layout>
      <Switch>
        {/* <Route exact path="/help" component={Help} /> */}
        <Route exact path="/:query?" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  </Router>
);

export default Routes;
