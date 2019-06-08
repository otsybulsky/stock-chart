import React, { useState, useEffect, useRef } from 'react'
import s from './DropdownSelect.m.scss'

const DropdownSelect = ({ items, value, onChange }) => {
  const node = useRef()

  let valueTitle = items[0].name
  if (value) {
    valueTitle = items.filter(item => item.id === value)[0].name
  } else {
    value = '0'
  }

  const [isActive, setControlActive] = useState(false)

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('mousedown', handleClick)
    } else {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [isActive])

  const onKeyDown = e => {
    if (e.keyCode === 27) {
      setControlActive(false)
    }
  }

  const handleClick = e => {
    if (node.current && node.current.contains(e.target)) {
      // inside click
      return
    }
    // outside click
    setControlActive(false)
  }

  const onSelect = selectedId => {
    setControlActive(false)
    if (selectedId !== value) {
      onChange(selectedId)
    }
  }

  return (
    <div ref={node} className={`dropdown ${isActive ? 'is-active' : ''}`}>
      <div
        className={`${s.custom} dropdown-trigger`}
        onClick={() => setControlActive(!isActive)}
      >
        <span>{valueTitle}</span>
        <span className="icon is-small">
          <i className="fas fa-angle-down" aria-hidden="true" />
        </span>
      </div>
      <div className="dropdown-menu" id="group-menu" role="menu">
        <div className="dropdown-content">
          {items.map(item => (
            <a
              href
              key={item.id}
              className={`dropdown-item ${
                item.id === value ? 'is-active' : ''
              }`}
              onClick={() => onSelect(item.id)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DropdownSelect
