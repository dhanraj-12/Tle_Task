import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './Components/Auth'
import HomePage from './Components/HomePage'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
