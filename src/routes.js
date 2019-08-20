import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import BlankPage from './containers/BlankPage';

export default () => (
  <Switch>
    <Route exact path="/blank-page" component={BlankPage} />
    <Redirect to="/wallet/balance" />
  </Switch>
);
