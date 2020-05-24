import { createStore, applyMiddleware, combineReducers, Store, AnyAction } from "redux"
import IndexReducer from "./reducers/IndexReducer"
import thunkMiddleware from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from "history"
import { composeWithDevTools } from "redux-devtools-extension"
import { UI } from "./actions/UIActions"
import { State } from "./reducers/IndexReducer"

export default function configureStore(history: History<any>) {
    const store = createStore(
        combineReducers({ ...IndexReducer, router: connectRouter(history) }),
        composeWithDevTools(
            applyMiddleware(thunkMiddleware, routerMiddleware(history))
        )
    )

    store.subscribe(workingSubscriber(store))
    return { store }
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