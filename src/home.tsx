import React, { FC, useState } from 'react'
import { InputGroup, Button } from '@blueprintjs/core'
import { RouteComponentProps } from 'react-router'

export const Home: FC<RouteComponentProps> = ({ history }) => {
  const [name, setName] = useState('')
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <InputGroup
        large
        placeholder="Search npm packages"
        leftIcon="search"
        rightElement={
          <Button
            icon="arrow-right"
            minimal
            onClick={() => {
              history.push(`/${name}`)
            }}
          />
        }
        value={name}
        onChange={(e: any) => {
          setName(e.target.value)
        }}
      />
    </div>
  )
}
