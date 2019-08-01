import React, { FC } from 'react'
import { Router, Route } from 'react-router-dom'
import { Home } from './home'
import { Package } from './package'
import { createBrowserHistory } from 'history'

const h = createBrowserHistory()

export const App: FC = () => {
  return (
    <div>
      <Router history={h}>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/:name" component={Package} />
          <Route exact path="/:scope/:name" component={Package} />
        </div>
      </Router>
    </div>
  )
}
