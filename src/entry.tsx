import React, { useState, FC } from 'react'
import { InputGroup, Button } from '@blueprintjs/core'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'

const examples = ['react', 'react@15', 'react@15.0.0']

export const Entry: FC<{ afterChange?: Function }> = ({ afterChange }) => {
  const { history } = useReactRouter()
  const [name, setName] = useState('')

  return (
    <>
      <InputGroup
        large
        placeholder="package or package@version"
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
        style={{ minWidth: 400 }}
      />
      <div style={{ paddingTop: 10 }}>
        <span style={{ fontSize: 16 }}>e.g.</span>
        {examples.map(name => (
          <Link
            to={name}
            key={name}
            style={{ paddingLeft: 20, fontSize: 16 }}
            onClick={() => {
              afterChange && afterChange()
            }}
          >
            {name}
          </Link>
        ))}
      </div>
    </>
  )
}
