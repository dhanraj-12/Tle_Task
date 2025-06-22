import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStudentStore from '../Context/studentStore'
import StudentDetailForm from './Studentdetailform'
import axios from 'axios'

const StudentRow = ({
  student,
  index,
  isDarkMode,
  setIsSubmitting,
  setSubmittingStudentId,
  setIsDeleting,
  ondelete
}) => {
  const [studentModal, setStudentModal] = React.useState(false)

  const url = "http://localhost:3000/api"
  const navigate = useNavigate()
  const handleviewmore = () => {
    const studentData = JSON.parse(JSON.stringify(student))
    useStudentStore.getState().setStudent(studentData)
    navigate('/profile')
  }

  const getRatingColor = rating => {
    if (!rating) return isDarkMode ? 'text-gray-400' : 'text-gray-600'
    if (rating < 1200) return isDarkMode ? 'text-gray-400' : 'text-gray-500'
    if (rating < 1400) return 'text-green-500'
    if (rating < 1600) return 'text-teal-500'
    if (rating < 1900) return 'text-blue-500'
    if (rating < 2100) return 'text-purple-500'
    if (rating < 2400) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getRatingBadgeColor = rating => {
    if (!rating) return isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    if (rating < 1200) return isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
    if (rating < 1400)
      return isDarkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-100'
    if (rating < 1600)
      return isDarkMode ? 'bg-teal-900 bg-opacity-30' : 'bg-teal-100'
    if (rating < 1900)
      return isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100'
    if (rating < 2100)
      return isDarkMode ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-100'
    if (rating < 2400)
      return isDarkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-100'
    return isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-100'
  }

  const handledit = () => {
    setStudentModal(true)
  }

  const closeModal = () => {
    setStudentModal(false)
  }

  const handldelete = async () => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(`${url}/delete`, {
        data: {
          id: student._id
        }
      });
      
      ondelete(student._id);
    } catch(e) {
      console.error('Error deleting student:', e);
      alert('Failed to delete student. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <tr
        className={`border-b transition ${
          isDarkMode
            ? 'hover:bg-gray-700 border-gray-700'
            : 'hover:bg-gray-50 border-gray-200'
        }`}
      >
        <td
          className={`px-6 py-4 text-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {index + 1}
        </td>
        <td
          className={`px-6 py-4 font-medium ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {student.name || 'N/A'}
        </td>
        <td
          className={`px-6 py-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {student.email}
        </td>
        <td
          className={`px-6 py-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {student.phnumber}
        </td>
        <td className='px-6 py-4'>
          <div className='flex items-center'>
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
              <span
                className={`ml-2 text-xs px-2 py-1 rounded ${getRatingBadgeColor(
                  student.CurrRating
                )} ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {student.CurrRating}
              </span>
            )}
          </div>
        </td>
        <td
          className={`px-6 py-4 font-medium ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {student.totalsolvedprb}
        </td>
        <td
          className={`px-6 py-4 font-medium  hover:cursor-pointer ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
          onClick={handleviewmore}
        >
          view More
        </td>
        <td
          className={`px-6 py-4 font-medium  hover:cursor-pointer ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
          onClick={handledit}
        >
          Edit details
        </td>
        <td
          className={`px-6 py-4 font-medium  hover:cursor-pointer ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
          onClick={handldelete}
        >
          delete student
        </td>
      </tr>
      {studentModal && (
        <StudentDetailForm
          closeModal={closeModal}
          setIsSubmitting={setIsSubmitting}
          setSubmittingStudentId={setSubmittingStudentId}
          isEdit={true}
          student={student}
        />
      )}
    </>
  )
}

export default StudentRow
