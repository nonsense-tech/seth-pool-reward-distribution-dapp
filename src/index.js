import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.scss';
import App from './App';
import Web3Connect from './containers/Web3Connect';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import store from './store';


ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <Web3Connect>
        <App>
          <Routes />
        </App>
      </Web3Connect>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
