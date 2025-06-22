import React, { useEffect } from 'react'
import { useTheme } from '../Context/ThemeContext'
import Heatmap from './Heatmap'
import useStudentStore from '../Context/studentStore'
import axios from 'axios'
import RatingGraph from './RatingGraph'
import Barchart from './BarChart'
import ContestTable from './ContestTable'
import Avatarinfo from './Avatarinfo'
import Header from './Header'
import { ResponsiveContainer } from 'recharts'

const Profilepage = () => {
  const token = localStorage.getItem('token')
  const { isDarkMode } = useTheme()
  const url = 'http://localhost:3000/api'

  const fetchdetails = async () => {
    try {
      const res = await axios.get(`${url}/check`, {
        headers: {
          authorization: `${localStorage.getItem('token')}`
        }
      })
      if (res.data.status) {
        const studentData = res.data.data
        useStudentStore.getState().setStudent(studentData)
      }
    } catch (e) {
      console.error('Error fetching student data:', e)
    }
  }

  useEffect(() => {
    fetchdetails()
  }, [])

  const student = useStudentStore(state => state.student)
  const studentData = JSON.parse(JSON.stringify(student))

  if (!token) {
    return (
      <>
        <Header />
        <div
          className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Please log in to view your profile
          </h1>
        </div>
      </>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <Header />

      <div className='container mx-auto px-4 py-6 max-w-7xl'>
        {/* Profile Header Section */}
        <div
          className={`p-6 rounded-xl shadow-md mb-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <Avatarinfo studentData={studentData} />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Heatmap Card */}

            {/* Rating Graph Card */}
            <div
              className={`rounded-xl shadow-md p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {' '}
              <ResponsiveContainer width='100%'>
                <RatingGraph studentData={studentData} />
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Problems Solved Card */}
            <div
              className={`rounded-xl shadow-md p-6 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
              >
                Solved Problems by Rating
              </h2>
              <div className='w-full  min-h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <Barchart studentData={studentData} />
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl shadow-md p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Submission Heatmap
          </h2>
          <div className='overflow-auto'>
            <Heatmap studentData={studentData} />
          </div>
        </div>

        {/* Contest Table Section */}
        <div
          className={`rounded-xl shadow-md p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Contest History
          </h2>
          <ContestTable studentData={studentData} />
        </div>
      </div>
    </div>
  )
}

export default Profilepage
