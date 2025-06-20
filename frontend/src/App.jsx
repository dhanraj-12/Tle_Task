import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './Components/Auth'
import HomePage from './Components/HomePage'
import Profilepage from './Components/Profilepage'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/profile' element={<Profilepage/>}> </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
