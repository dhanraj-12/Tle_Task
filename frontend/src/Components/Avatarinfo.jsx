import React from 'react'
import { useTheme } from '../Context/ThemeContext'

const Avatarinfo = ({ studentData }) => {
  const { isDarkMode } = useTheme()

  if (!studentData) {
    return (
      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}
      >
        Loading user data...
      </div>
    )
  }

  const avatar = studentData.avatar || 'https://via.placeholder.com/150'
  const name = studentData.name || 'Anonymous'
  const email = studentData.email || 'No email provided'

  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <img
        src={avatar}
        alt='User Avatar'
        className='w-16 h-16 rounded-full border-2 border-opacity-50 hover:border-opacity-100 transition-all duration-300'
        style={{
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb'
        }}
      />
      <div className='flex flex-col'>
        <h2
          className={`text-xl font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          {name}
        </h2>
        <p
          className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {email}
        </p>
        {studentData.cfhandle && (
          <a
            href={`https://codeforces.com/profile/${studentData.cfhandle}`}
            target='_blank'
            rel='noopener noreferrer'
            className={`text-sm mt-1 transition-colors duration-300 hover:underline ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            @{studentData.cfhandle}
          </a>
        )}
      </div>
    </div>
  )
}

export default Avatarinfo
