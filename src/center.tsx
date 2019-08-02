import React, { FC, CSSProperties, HTMLAttributes } from 'react'

export const Center: FC<
  HTMLAttributes<HTMLDivElement> & { style: CSSProperties }
> = ({ style, ...rest }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...rest}
    />
  )
}
