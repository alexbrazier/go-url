import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Routes from './routes';
import store from './redux';
import { init as initSentry } from '@sentry/browser';
import { SENTRY_DSN } from './config';
import 'typeface-roboto';
import './index.css';
// import * as serviceWorker from './serviceWorker';

if (SENTRY_DSN) {
  initSentry({ dsn: SENTRY_DSN });
}

const theme = createMuiTheme();

const App = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
