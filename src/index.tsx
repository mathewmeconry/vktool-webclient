import './fontawesome_init'

import React from 'react'
import ReactDOM, { render } from 'react-dom'
import Root from './Root'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Root />
    , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()