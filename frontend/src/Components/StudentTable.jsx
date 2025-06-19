import React, { useState, useEffect, useCallback } from 'react';
import StudentRow from './Studentrow';
import LoadingRow from './Loadingrow';

const StudentTable = ({isSubmiting,submitindStudentId}) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // Number of items per page


  const url = "http://localhost:3000/api";
  const fetchStudents = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${url}/studentslist?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      setStudents(prev => [...prev, ...data.data]);
      setHasMore(page < data.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== 
        document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      setPage(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Leaderboard</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Codeforces Handle</th>
              <th className="px-4 py-2">Problems Solved</th>
            </tr>
          </thead>
          <tbody>
          {students.map((student, index) => (
          isSubmiting && submitindStudentId === student._id ? (
            <LoadingRow key={student._id} index={index} />
          ) : (
            <StudentRow key={student._id} student={student} index={index} />
          )
        ))}
        {/* Loading state for new student being added */}
        {isSubmiting && submitindStudentId === 'new' && (
                    <LoadingRow key="loading-new" index={students.length} />
                )}
          </tbody>
        </table>
        
        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {!hasMore && (
          <div className="text-center my-4 text-gray-500">
            No more students to load
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;