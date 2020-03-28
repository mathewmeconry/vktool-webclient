import { createStore, applyMiddleware, combineReducers } from "redux"
import IndexReducer from "./reducers/IndexReducer"
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from "history"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage: localStorage,
    blacklist: ['router']
}

export default function configureStore(history: History<any>) {
    const persistedReducer = persistReducer(persistConfig, combineReducers({ ...IndexReducer, router: connectRouter(history) }))

    const store = createStore(
        persistedReducer,
        composeWithDevTools(
            applyMiddleware(thunkMiddleware, routerMiddleware(history))
        )
    )
    return { store, persistor: persistStore(store) }
}