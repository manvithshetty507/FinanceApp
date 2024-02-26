import './style.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import photo from '../../../assets/default_pfp.jpg'
import { doc, getDoc } from 'firebase/firestore';

function Header() {
  const [theme, setTheme] = useState('default');

  const [user] = useAuthState(auth);
  const navigate = useNavigate()

  const [imageURL, setImageURL] = useState("")
  console.log("imageURL",imageURL)

  useEffect(() => {
    if (user) {
      console.log("current user",user.uid)
      navigate('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        try {
          const docRef = doc(db, "users", user.uid)
          const docSnap = await getDoc(docRef); // Fix the typo here
  
          console.log("doc",docSnap.data())
          if (docSnap.exists()) {
            setImageURL(docSnap.data().photoURL);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    };
  
    fetchData();
  }, [user]);
  

  const handleThemeChange = (e) => {

    setTheme(e.target.value);
    if (e.target.value === 'dark') {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    } else if (e.target.value === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark', 'theme-light');
    }

  };

  const logoutUser = () => {
    signOut(auth)
    .then((res) => {
      toast.success("logged out")
      navigate('/')
    })
    .catch((error) => {
      toast.error(error.message)
    })
  }

  return (
    <div className='navbar'>
      Financely
      <div className='right'>
        <div className='theme__selector'>
          <label htmlFor="themeSelect" style={{fontSize:"0.8rem"}}>Choose Theme: </label>
          <select id="themeSelect" value={theme} onChange={handleThemeChange} className="theme-select">
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {user &&
          <>
            {
              user  &&
              <img src={imageURL ? imageURL : photo} alt="pfp"
               style={{width:'1.5rem', height:'1.5rem', borderRadius:'50%', marginRight:'0.5rem'}}
               />
            }
            <div className='logout'>
              <button onClick={logoutUser}>Logout</button>
            </div>
          </>
        }
      </div>
      
    </div>
  )
}

export default Header