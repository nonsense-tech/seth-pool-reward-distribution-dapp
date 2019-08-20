import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const middlewares = [thunk];

export default createStore(
  combineReducers({
    ...reducers,
  }),
  compose(applyMiddleware(...middlewares))
);
