import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './app'
import * as serviceWorker from './serviceWorker'
import 'normalize.css/normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
