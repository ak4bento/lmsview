
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('../bootstrap');

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import store from './store';
import { Main } from './components';

const UsersApp = () => (
  <Provider store={ store }>
    <Main />
  </Provider>
);

render( <UsersApp />, document.getElementById( 'app' ) );