import React from "react";
import ReactDOM from "react-dom";
import App from "./content/App.jsx";

import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reduxStore/reducers/rootReducer";

import thunk from "redux-thunk";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase, reduxFirebase } from "react-redux-firebase";

// this place here is where we connect redux to the firebase
import firebaseConfig from './content/config/firebaseConfig'

/* 
 We could have many diffrent store enhancers/middleware here
 Thunk lets us return a function inside our action creators
 which can then interact with the database
 */
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(firebaseConfig),
    reactReduxFirebase(firebaseConfig)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);