import { useState } from 'react'
import './style.css'

function FileInput({accept, id, label, fileHandle}) {
    const [fileSelected, setFileSelected] = useState('')

    const onChange = (e) => {
        setFileSelected(e.target.value)
        fileHandle(e.target.files[0])
    } 
  return (
    <div className='custom__input'>
        <label htmlFor={id} className='label'>{fileSelected ? `${fileSelected}` : `${label}`}</label>
        <input type="file" accept={accept} id={id} onChange={onChange} style={{display:'none'}}/>
    </div>
  )
}

export default FileInput