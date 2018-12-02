import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Routes from './routes';
import store from './redux';
import 'typeface-roboto';
import './index.css';
// import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const App = (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
