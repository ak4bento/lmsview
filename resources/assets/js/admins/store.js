import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';

import Reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(Reducers, composeEnhancers(applyMiddleware(Thunk)));
