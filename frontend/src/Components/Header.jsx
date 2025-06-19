import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentDetailForm from './Studentdetailform'
import axios from 'axios'

const Header = ({ setIsSubmiting, setSubmitindStudentId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  )
  const [studentModal, setStudentModal] = useState(false)
  const [hasStudentData, setHasStudentData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const url = 'http://localhost:3000/api'

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
        console.log(res.data)
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


  const handledownload = async() => {
    try {

      const res = await axios.get(`${url}/export`, {
        responseType: 'blob',
      })
      
      const url2 = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url2;
      link.setAttribute('download', 'student_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch(e) {
      console.error('Error downloading data:', e);
      alert('Failed to download data. Please try again later.');
    }
  }


  return (
    <>
      <header className='flex justify-end p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-40'>
        <div className='flex gap-4'>
          <button
          className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors'
          onClick={handledownload}
          >
            Download Data
          </button>
          {isAuthenticated && (
            <button
              className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
              onClick={handleStudentAction}
              disabled={isLoading}
            >
              {isLoading
                ? 'Checking...'
                : hasStudentData
                ? 'Edit Details'
                : 'Add Details'}
            </button>
          )}
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            onClick={handleAuth}
          >
            {isAuthenticated ? 'Logout' : 'Login/Signup'}
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
