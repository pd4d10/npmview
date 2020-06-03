import React, { FC } from 'react'
import { Router, Route } from 'react-router-dom'
import { Home } from './home'
import { Package } from './package'
import { createBrowserHistory } from 'history'

const h = createBrowserHistory()
const GA_MEASUREMENT_ID = 'UA-145009360-1'

// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
h.listen((location) => {
  const { gtag } = window as any
  if (gtag) {
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    })
  }
})

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
