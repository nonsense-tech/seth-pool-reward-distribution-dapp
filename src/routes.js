import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import BlankPage from './containers/BlankPage';
import TransactionList from './containers/TransactionList';
import TransactionPage from './containers/TransactionPage';

export default () => (
  <Switch>
    <Route exact path="/blank-page" component={BlankPage} />
    <Route exact path="/transaction-list" component={TransactionList} />
    <Route exact path="/transaction" component={TransactionPage} />
    <Redirect to="/transaction-list" />
  </Switch>
);
