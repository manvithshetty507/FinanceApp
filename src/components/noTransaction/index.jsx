import './style.css'
import no_tran_src from '../../assets/no_transaction.jpg'

function NoTransaction() {
  return (
    <div className='image__container'>
      <img src={no_tran_src} alt="no_transaction" />  
    </div>
  )
}

export default NoTransaction