import { createStore, applyMiddleware, combineReducers, Store, AnyAction } from "redux"
import IndexReducer from "./reducers/IndexReducer"
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from "history"
import { composeWithDevTools } from "redux-devtools-extension"
export default function configureStore(history: History<any>) {
    const store = createStore(
        combineReducers({ ...IndexReducer, router: connectRouter(history) }),
        composeWithDevTools(
            applyMiddleware(thunkMiddleware, routerMiddleware(history))
        )
    )

    return { store }
}
