import React, { useState } from 'react'
import s from './DropdownSelect.m.scss'
import { string } from 'postcss-selector-parser'

const DropdownSelect = ({ items, value, onChange }) => {
  let valueTitle = items[0].name
  if (value) {
    valueTitle = items.filter(item => item.id === value)[0].name
  } else {
    value = '0'
  }

  const [isActive, setControlActive] = useState(false)

  const onSelect = selectedId => {
    setControlActive(false)
    if (selectedId !== value) {
      onChange(selectedId)
    }
  }

  return (
    <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
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
