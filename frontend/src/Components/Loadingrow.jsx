import React from 'react';

const LoadingRow = ({ index }) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 text-center">{index + 1}</td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  );
};

export default LoadingRow;