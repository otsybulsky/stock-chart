import React, { useState, useEffect } from 'react'
import s from './GeySymbol.m.scss'

const GetSymbol = ({ closeModal }) => {
  const [symbol, setSymbol] = useState('')

  const onChange = e => setSymbol(e.target.value.toUpperCase())

  const onKeyDown = e => {
    if (e.keyCode === 27) {
      closeModal({})
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    closeModal({ symbol })
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className={s.container}>
      <form onSubmit={onSubmit}>
        <input
          autoFocus
          className="input is-primary"
          type="text"
          placeholder="Enter symbol"
          value={symbol}
          onChange={onChange}
        />
      </form>
    </div>
  )
}

export default GetSymbol
