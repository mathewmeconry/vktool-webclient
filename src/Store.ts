import { createStore, applyMiddleware, combineReducers } from "redux";
import IndexReducer from "./reducers/IndexReducer";
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from "history";
import { composeWithDevTools } from "remote-redux-devtools";

export default function configureStore(history: History<any>) {
    return createStore(
        combineReducers({ ...IndexReducer, router: connectRouter(history) }),
        composeWithDevTools(
            applyMiddleware(thunkMiddleware, routerMiddleware(history))
        )
    )
}