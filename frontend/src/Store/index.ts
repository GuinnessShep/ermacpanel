import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import RootReducer from "./RootReducer";

export const state = createStore(RootReducer, applyMiddleware(thunk));
