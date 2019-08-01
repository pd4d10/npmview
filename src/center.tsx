import React, { FC, CSSProperties } from 'react'

export const Center: FC<{ style: CSSProperties }> = ({ style, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
