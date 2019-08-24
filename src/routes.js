import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import BlankPage from './containers/BlankPage';
import TransactionList from './containers/Transaction/List';
import TransactionCreate from './containers/Transaction/Create';
import TransactionConfirm from './containers/Transaction/Confirm';

export default () => (
  <Switch>
    <Route exact path="/blank-page" component={BlankPage} />
    <Route exact path="/transactions" component={TransactionList} />
    <Route exact path="/transactions/create" component={TransactionCreate} />
    <Route exact path="/transactions/:id" component={TransactionConfirm} />
    <Redirect to="/transactions" />
  </Switch>
);
