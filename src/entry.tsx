import React, { useState, FC } from 'react'
import { InputGroup, Button } from '@blueprintjs/core'
import useReactRouter from 'use-react-router'

export const Entry: FC<{ afterChange?: Function }> = ({ afterChange }) => {
  const { history } = useReactRouter()
  const [name, setName] = useState('')

  return (
    <InputGroup
      large
      placeholder="e.g. react, react@16.8.0"
      leftIcon="search"
      rightElement={
        <Button
          icon="arrow-right"
          minimal
          onClick={() => {
            afterChange && afterChange()
            history.push(`/${name}`)
          }}
        />
      }
      value={name}
      onChange={(e: any) => {
        setName(e.target.value)
      }}
    />
  )
}
