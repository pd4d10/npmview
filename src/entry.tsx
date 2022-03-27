import React, { useState, FC, useRef, useEffect } from 'react'
import { InputGroup, Button, Classes } from '@blueprintjs/core'
import { Link, useNavigate } from 'react-router-dom'

const examples = ['react', 'react@15', 'react@15.0.0']

export const Entry: FC<{ afterChange?: Function }> = ({ afterChange }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    // console.log(inputRef.current)
    inputRef.current && inputRef.current.focus()
  }, [])

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          afterChange && afterChange()
          navigate(`/${name}`)
        }}
      >
        <InputGroup
          inputRef={inputRef as any}
          large
          placeholder="package or package@version"
          leftIcon="search"
          rightElement={<Button icon="arrow-right" minimal type="submit" />}
          value={name}
          onChange={(e: any) => {
            setName(e.target.value)
          }}
          style={{ minWidth: 400 }}
        />
      </form>
      <div style={{ paddingTop: 10 }} className={Classes.TEXT_LARGE}>
        <span>e.g.</span>
        {examples.map((name) => (
          <Link
            to={'/' + name}
            key={name}
            style={{ paddingLeft: 20 }}
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
