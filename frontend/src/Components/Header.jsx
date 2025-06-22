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

const Header = ({ setIsSubmiting, setSubmitindStudentId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  )
  const [studentModal, setStudentModal] = useState(false)
  const [hasStudentData, setHasStudentData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const url = 'http://localhost:3000/api'

  const { isDarkMode, toggleTheme } = useTheme()

  useEffect(() => {
    const checkStudentData = async () => {
      if (!isAuthenticated) {
        setHasStudentData(false)
        return
      }

      setIsLoading(true)
      try {
        const res = await axios.get(`${url}/check`, {
          headers: {
            authorization: `${localStorage.getItem('token')}`
          }
        })
        setHasStudentData(res.data.status)
        const studendata = JSON.stringify(res.data.data)
        localStorage.setItem('studentdata', studendata)
      } catch (error) {
        console.error('Error checking student data:', error)
        setHasStudentData(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkStudentData()
  }, [isAuthenticated])

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

  const handleStudentAction = () => setStudentModal(true)
  const closeModal = () => setStudentModal(false)

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

          {isAuthenticated && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition hover:cursor-pointer ${
                isLoading
                  ? 'cursor-not-allowed opacity-70'
                  : isDarkMode
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
              onClick={handleStudentAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                <>
                  {hasStudentData ? (
                    <FiEdit2 className='w-5 h-5' />
                  ) : (
                    <FiUserPlus className='w-5 h-5' />
                  )}
                  <span>{hasStudentData ? 'Edit' : 'Add'} Details</span>
                </>
              )}
            </button>
          )}

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

      {studentModal && (
        <StudentDetailForm
          closeModal={closeModal}
          isEdit={hasStudentData}
          setIsSubmitting={setIsSubmiting}
          setSubmittingStudentId={setSubmitindStudentId}
          student={
            hasStudentData
              ? JSON.parse(localStorage.getItem('studentdata'))
              : null
          }
        />
      )}
    </>
  )
}

export default Header
