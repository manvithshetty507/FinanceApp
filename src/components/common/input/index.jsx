import React from 'react'
import './style.css'

function Input({ type, state, setState, placeholder }) {
  return (
    <input 
        type={type}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder} 
        className='input__box'
    />
  )
}

export default Input;
