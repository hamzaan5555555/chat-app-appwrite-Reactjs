import Room from './pages/Room'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import Login from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import PrivateRoutes from './components/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import './App.css'

function App() {

  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Register" element={<RegisterPage/>} />

        <Route element={<PrivateRoutes/>}>
        <Route path="/" element={<Room/>} />

        </Route>




      </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App




