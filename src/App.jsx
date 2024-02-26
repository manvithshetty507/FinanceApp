import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import DashBoard from './pages/DashBoard'
import Header from './components/common/header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <ToastContainer />
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<DashBoard />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
