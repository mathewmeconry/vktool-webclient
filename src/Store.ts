import { createStore, applyMiddleware, combineReducers, Store, AnyAction } from "redux"
import IndexReducer from "./reducers/IndexReducer"
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from "history"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage'
import { UI } from "./actions/UIActions"
import { State } from "./reducers/IndexReducer"

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

    store.subscribe(workingSubscriber(store))
    return { store, persistor: persistStore(store) }
}

function workingSubscriber(store: Store<State, AnyAction>) {
    return () => {
        const state = store.getState()
        // @ts-ignore
        const working = Object.keys(state.data).find((k: string) => state.data[k].loading === true)
        const nextState = (!!working) ? 'dynamic' : 'nop'
        if (state.ui.working !== 'fixed' && state.ui.working !== nextState) {
            store.dispatch(UI.setWorking(nextState))
        }
    }
}