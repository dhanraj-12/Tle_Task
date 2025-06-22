import React, { useEffect, useState } from 'react'
import ContestRow from './ContestRow'
import axios from 'axios'
import { useTheme } from '../Context/ThemeContext'

const ContestTable = ({ studentData }) => {
  const { isDarkMode } = useTheme()
  const url = 'http://localhost:3000/api'
  const [range, setRange] = useState(150)
  const [contests, setContests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!studentData?._id) {
      setError('No student data available')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const res = await axios.get(`${url}/${studentData._id}/contests`, {
        params: { range: range }
      })
      setContests(res.data.contest || [])
    } catch (e) {
      console.error('Error fetching contests:', e)
      setError('Failed to load contests')
      setContests([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [range, studentData?._id])

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center h-64 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDarkMode ? 'border-blue-400' : 'border-blue-600'
          }`}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`text-center p-4 rounded-xl ${
          isDarkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-500'
        }`}
      >
        <p>{error}</p>
        <button
          onClick={fetchData}
          className={`mt-2 px-4 py-2 rounded transition-colors ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl shadow-sm overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4'>
        <h2
          className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Contest History
        </h2>
        <select
          value={range}
          onChange={e => setRange(Number(e.target.value))}
          className={`px-3 py-2 rounded border transition-colors ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        >
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={180}>Last 6 Months</option>
          <option value={360}>Last Year</option>
        </select>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                Contest
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                Rank
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                Old Rating
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                New Rating
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                Unsolved
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? 'divide-gray-600' : 'divide-gray-200'
            }`}
          >
            {contests.length > 0 ? (
              contests
                .slice()
                .reverse()
                .map(contest => (
                  <ContestRow
                    key={contest._id}
                    contest={contest}
                    isDarkMode={isDarkMode}
                  />
                ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No contests found for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContestTable
