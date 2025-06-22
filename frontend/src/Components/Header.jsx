import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentDetailForm from './Studentdetailform'
import axios from 'axios'
import { useTheme } from '../Context/ThemeContext'
import {
  FiSun,
  FiMoon,
  FiDownload,
  FiEdit2,
  FiUserPlus,
  FiLogIn,
  FiLogOut
} from 'react-icons/fi'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  )

  const navigate = useNavigate()

  const { isDarkMode, toggleTheme } = useTheme()

  const handleAuth = () => {
    if (isAuthenticated) {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setHasStudentData(false)
      window.location.reload()
    } else {
      navigate('/auth')
    }
  }

  return (
    <>
      <header
        className={`flex justify-between items-center p-4 sticky top-0 z-40 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gray-900 border-gray-700 text-white'
            : 'bg-white border-gray-200 text-gray-800'
        } border-b shadow-sm`}
      >
        <h1
          className='text-xl font-bold hover:cursor-pointer'
          onClick={() => navigate('/')}
        >
          {' '}
          TLE Student Portal
        </h1>

        <div className='flex gap-3 items-center'>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-opacity-20 transition hover:cursor-pointer ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            aria-label='Toggle theme'
          >
            {isDarkMode ? (
              <FiSun className='w-5 h-5' />
            ) : (
              <FiMoon className='w-5 h-5' />
            )}
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition  hover:cursor-pointer ${
              isDarkMode
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
            onClick={handleAuth}
          >
            {isAuthenticated ? (
              <FiLogOut className='w-5 h-5' />
            ) : (
              <FiLogIn className='w-5 h-5' />
            )}
            <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </header>
    </>
  )
}

export default Header
