import './style.css'
import Input from '../../common/input'
import { useState } from 'react'
import Button from '../../common/button'
import { toast } from 'react-toastify'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, db, provider, storage } from '../../../firebase'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'


function Login({toggle,setToggle}) {

  const navigate = useNavigate()

  const [email,setEmail] =useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)

  const loginWithEP = () => {
    setLoading(true)
    if(email && password) {

      signInWithEmailAndPassword(auth,email,password)
      .then((userCredentials) => {
        console.log(userCredentials.user)
        toast.success("login sucess")

        setEmail("")
        setPassword("")
        setLoading(false)
        navigate('/dashboard')
      }).catch((error) => {
        setLoading(false)
        toast.error(error.message)
      })
      
    }else {
      setLoading(false)
      toast.error("Please Enter your details")
    }
  }

  const loginInGoogle = () => {
    setLoading(true)
      try {

        signInWithPopup(auth, provider)
        .then((userCredentials) => {
          const gUser = userCredentials.user
          createDocument(gUser)
          setLoading(false)
        })
        .catch((error) => {
          toast.error(error.message)
          setLoading(false)
        })

      }catch(error) {
        toast.error(error.message)
        setLoading(false)
      }
  }

  async function createDocument(user) {
    if(!user) return

    const userRef = doc(db, "users", user.uid)
    const userData = await getDoc(userRef);
    //in google authentication we can't differenciate b/w login & sign up so first check the doc
    
    if(!userData.exists()) {
      try {
        await setDoc(userRef,{
          name:user.displayName,
          email:user.email,
          photoURL: user.photoURL,
          createdAt:new Date(),
        })

        toast.success("doc added")

      }catch(error) {

      }
    }else {
      toast.error("this is already a doc of this user")
    }
  }

  return (
    <div className='login__wrapper'>
      Login to Financely
      
      <p className='heading'>Email</p>
        <Input type="text" placeholder="Email" state={email} setState={setEmail} />

        <p className='heading'>Password</p>
        <Input type="password" placeholder="Password" state={password} setState={setPassword} />

        <Button text={loading ? "loading.." : "Login up with Email"} onClick={loginWithEP} disabled={loading}/>

        <p style={{margin:'0.2rem'}}>or</p>

        <Button text={loading ? "loading.." : "Login up with Google"} green="green" onClick={loginInGoogle}/>

      <p className='toggle__para' onClick={() => setToggle(!toggle)}>New User SignUp ?</p>
    </div>
  )
}

export default Login