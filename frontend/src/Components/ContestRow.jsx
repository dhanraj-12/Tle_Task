import React from "react";
import { useTheme } from "../Context/ThemeContext";

const ContestRow = ({ contest }) => {
  const { isDarkMode } = useTheme();

  const newRatingColor = contest.newRating >= contest.oldRating 
    ? "text-green-500" 
    : "text-red-500";

  return (
    <tr className={isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"}>
      <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        {contest.contestName}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        {contest.rank}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        {contest.oldRating}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap ${newRatingColor}`}>
        {contest.newRating}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
        {contest.unsolvedCount}
      </td>
    </tr>
  );
};

export default ContestRow;