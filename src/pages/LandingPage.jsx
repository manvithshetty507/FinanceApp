import React, { useState } from 'react'
import SignUp from '../components/singinsignup/signUp'
import Login from '../components/singinsignup/login'


function LandingPage() {
  const [toggle,setToggle] = useState(true)

  return (

    <div className='wrapper'>
        {toggle ? <SignUp toggle={toggle} setToggle={setToggle} /> : <Login toggle={toggle} setToggle={setToggle}/>}
    </div>
  )
}

export default LandingPage