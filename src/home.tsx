import React, { FC } from 'react'
import { Entry } from './entry'

export const Home: FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Entry />
    </div>
  )
}
