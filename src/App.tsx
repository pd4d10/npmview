import React from 'react'
import { Router, Route } from 'react-router-dom'
import { Home } from './home'
import { Package } from './package'
import { createHashHistory } from 'history'

const h = createHashHistory()

export const App: React.FC = () => {
  return (
    <div>
      <Router history={h}>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/:name" component={Package} />
        </div>
      </Router>
    </div>
  )
}
