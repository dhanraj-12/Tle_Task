import React, { useState, useEffect, useCallback } from 'react'
import StudentRow from './Studentrow'
import LoadingRow from './Loadingrow'
import { useTheme } from '../Context/ThemeContext'
import { FiDownload } from 'react-icons/fi'
import axios from 'axios'

const StudentTable = ({ isSubmiting, submitindStudentId }) => {
  const { isDarkMode } = useTheme()
  const [students, setStudents] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10

  const url = 'http://localhost:3000/api'

  const fetchStudents = useCallback(async () => {
    if (!hasMore || loading) return

    setLoading(true)
    try {
      const response = await fetch(
        `${url}/studentslist?page=${page}&limit=${limit}`
      )
      const data = await response.json()

      setStudents(prev => [...prev, ...data.data])
      setHasMore(page < data.totalPages)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  useEffect(() => {
    fetchStudents()
  }, [page, fetchStudents])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 100 ||
        loading
      ) {
        return
      }
      setPage(prev => prev + 1)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading])

  const handledownload = async () => {
    try {
      const res = await axios.get(`${url}/export`, {
        responseType: 'blob'
      })

      const url2 = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url2
      link.setAttribute('download', 'student_data.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error downloading data:', e)
      alert('Failed to download data. Please try again later.')
    }
  }

  return (
    <div
      className={`container mx-auto px-4 py-8 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Student Leaderboard
      </h1>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition hover:cursor-pointer ${
          isDarkMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        }`}
        onClick={handledownload}
      >
        <FiDownload className='w-5 h-5' />
        <span>Export</span>
      </button>
      <div className='overflow-x-auto rounded-lg shadow'>
        <table
          className={`min-w-full ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
          }`}
        >
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Rank
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Codeforces Handle
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Problems Solved
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                Profiles
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {students.map((student, index) =>
              isSubmiting && submitindStudentId === student._id ? (
                <LoadingRow
                  key={student._id}
                  index={index}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <StudentRow
                  key={student._id}
                  student={student}
                  index={index}
                  isDarkMode={isDarkMode}
                />
              )
            )}
            {isSubmiting && submitindStudentId === 'new' && (
              <LoadingRow
                key='loading-new'
                index={students.length}
                isDarkMode={isDarkMode}
              />
            )}
          </tbody>
        </table>

        {loading && (
          <div className='flex justify-center my-6 p-4'>
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDarkMode ? 'border-indigo-400' : 'border-indigo-600'
              }`}
            ></div>
          </div>
        )}

        {!hasMore && (
          <div
            className={`text-center my-6 p-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            You've reached the end of the leaderboard
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentTable
