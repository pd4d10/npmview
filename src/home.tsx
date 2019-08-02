import React, { FC } from 'react'
import { Entry } from './entry'
import { Center } from './center'
import { H1 } from '@blueprintjs/core'

export const Home: FC = () => {
  return (
    <Center style={{ height: '100vh', flexDirection: 'column' }}>
      <H1 style={{ paddingBottom: 20 }}>npmview</H1>
      <Entry />
      <div style={{ height: '30vh' }} />
    </Center>
  )
}
