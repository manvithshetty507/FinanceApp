import './style.css'

function Button({text, onClick ,green, disabled}) {
  return (
    <button onClick={onClick} className={green ? "btn btn-green" : "btn"} disabled={disabled}>
      {text}
    </button>
  )
}

export default Button