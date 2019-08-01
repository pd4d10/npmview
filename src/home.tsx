import React, { FC } from 'react'
import { Entry } from './entry'
import { Center } from './center'

export const Home: FC = () => {
  return (
    <Center style={{ height: '100vh' }}>
      <Entry />
    </Center>
  )
}
