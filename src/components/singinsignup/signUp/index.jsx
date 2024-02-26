import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import Button from '../../common/button'
import Input from '../../common/input'
import './style.css'
import { useState } from 'react'
import { auth, db, provider, storage } from '../../../firebase'
import { toast } from 'react-toastify'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import FileInput from '../../common/fileInput'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import defaultProfile from '../../../assets/default_pfp.jpg'

function SignUp({toggle, setToggle}) {
    const [name,setName] = useState('')
    const [email,setEmail] =useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [displayProfile,setDisplayProfile] = useState('')

    const signUpWithEmail = () => {
      console.log(name,email,password,confirmPassword)
      setLoading(true)
      //create a new account with email and pass and save in docs

      if(name && email && password && confirmPassword) {

        if(password === confirmPassword) {
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            
            const user = userCredentials.user
            console.log("user", user)
            setEmail("")
            setName("")
            setConfirmPassword("")
            setPassword("")

            //create a document in firestore
            createDocument(user)

            setLoading(false)
          }).catch((error) => {
            setLoading(false)
            console.log(error.message)
            toast.error(error.message)
          })
        }else {
          toast.error("Passwords not matching")
        }

      }else {
        setLoading(false)
        toast.error("Plaese fill in necessary details")
      }
    }

    const googleSignUp = () => {
      setLoading(true)
      try {

        signInWithPopup(auth, provider)
        .then((userCredentials) => {
          const gUser = userCredentials.user
          createDocument(gUser)
          toast.success("doc created")
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
          //upload profilepic
          const profileRef = ref(storage,`displayPic/${user.uid}/${Date.now()}`)
          await uploadBytes(profileRef, displayProfile ? displayProfile : defaultProfile)

          //get URL of profile
          const photoURL = await getDownloadURL(profileRef)
        
          await setDoc(userRef,{
            name:user.displayName ? user.displayName : name,
            email:user.email ? user.email : email,
            photoURL: user.photoURL ? user.photoURL : photoURL,
            createdAt:new Date(),
          })

          toast.success("doc added")

        }catch(error) {

        }
      }else {
        toast.error("this is already a doc of this user")
      }
    }

    const displayPicFileHandle = (file) => {
      console.log(file)
      setDisplayProfile(file)
    }

  return (
    <div className='signup__wrapper'>
        Sign Up to Financely
        <p className='heading'>Full Name</p>
        <Input type="text" placeholder="Name" state={name} setState={setName} />

        <p className='heading'>Email</p>
        <Input type="text" placeholder="Email" state={email} setState={setEmail} />

        <p className='heading'>Password</p>
        <Input type="password" placeholder="Password" state={password} setState={setPassword} />

        <p className='heading'>Confirm Password</p>
        <Input type="password" placeholder="Confirm Password" state={confirmPassword} setState={setConfirmPassword} />

        <FileInput 
          accept="image/*"
          id="display__img"
          label="Upload Display Picture"
          fileHandle={displayPicFileHandle}
        />

        <Button text={loading ? "loading.." : "Sign up with Email"} onClick={signUpWithEmail} disabled={loading}/>

        <p style={{margin:'0.2rem'}}>or</p>

        <Button text={loading ? "loading.." : "Sign up with Google"} green="green" onClick={googleSignUp}/>

        <p className='toggle__para' onClick={() => setToggle(!toggle)} disabled={loading}>Already a User Login!</p>
    </div>
  )
}

export default SignUp