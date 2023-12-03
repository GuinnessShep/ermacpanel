import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {applyMiddleware, createStore} from "redux";
import RootReducer from "./Store/RootReducer";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import moment from "moment-timezone";

const store = createStore(RootReducer, applyMiddleware(thunk));

moment.tz.setDefault(process.env.REACT_APP_TIMEZONE);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"),
);
