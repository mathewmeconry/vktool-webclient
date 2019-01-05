import { createStore, applyMiddleware } from "redux";
import IndexReducer from "./reducers/IndexReducer";
import thunkMiddleware from 'redux-thunk'

export default function configureStore() {
    return createStore(IndexReducer, applyMiddleware(thunkMiddleware))
}