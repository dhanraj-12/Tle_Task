import React from 'react'

const LoadingRow = ({ index, isDarkMode }) => {
  return (
    <tr
      className={`border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <td
        className={`px-6 py-4 text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        {index + 1}
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td>
      <td className='px-6 py-4'>
        <div
          className={`h-5 rounded animate-pulse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        ></div>
      </td> 
    </tr>
  )
}

export default LoadingRow
