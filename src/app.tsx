import React, { FC, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './home'
import { Package } from './package'

export const Inner: FC = () => {
  const location = useLocation()
  useEffect(() => {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
    const GA_MEASUREMENT_ID = 'UA-145009360-1'
    const { gtag } = window as any
    gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    })
  }, [location])

  const packageElement = <Package />

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/:name" element={packageElement} />
      <Route path="/:scope/:name" element={packageElement} />
    </Routes>
  )
}

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Inner />
    </BrowserRouter>
  )
}
