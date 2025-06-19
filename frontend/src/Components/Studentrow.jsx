import React from 'react'

const StudentRow = ({ student, index }) => {
  const getRatingColor = rating => {
    if (!rating) return 'text-gray-600'
    if (rating < 1200) return 'text-gray-500'
    if (rating < 1400) return 'text-green-500'
    if (rating < 1600) return 'text-teal-500'
    if (rating < 1900) return 'text-blue-500'
    if (rating < 2100) return 'text-purple-500'
    if (rating < 2400) return 'text-yellow-500'
    return 'text-red-500'
  }


  return (
    <tr className='border-b hover:bg-gray-50 transition'>
      <td className='px-4 py-3 text-center'>{index + 1}</td>
      <td className='px-4 py-3 font-medium'>{student.name || 'N/A'}</td>
      <td className='px-4 py-3 text-gray-600'>{student.email}</td>
      <td className='px-4 py-3'>
        <a
          href={`https://codeforces.com/profile/${student.cfhandle}`}
          target='_blank'
          rel='noopener noreferrer'
          className={`font-medium ${getRatingColor(
            student.CurrRating
          )} hover:underline`}
        >
          {student.cfhandle}
        </a>
        {student.CurrRating && (
          <span className='ml-2 text-xs bg-gray-100 px-2 py-1 rounded'>
            {student.CurrRating}
          </span>
        )}
      </td>
      <td className='px-4 py-3 font-medium'>{student.totalsolvedprb}</td>
    </tr>
  )
}

export default StudentRow
