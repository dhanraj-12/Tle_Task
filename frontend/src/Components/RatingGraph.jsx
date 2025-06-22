import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";

const getColorByRating = (rating) => {
  if (!rating) return '#808080';
  if (rating < 1200) return '#808080';
  if (rating < 1400) return '#008000';
  if (rating < 1600) return '#03A89E';
  if (rating < 1900) return '#0000FF';
  if (rating < 2100) return '#AA00AA';
  if (rating < 2300) return '#FF8C00';
  if (rating < 2400) return '#FF0000';
  if (rating < 2600) return '#FF0000';
  if (rating < 3000) return '#FF0000';
  return '#000000';
};

const ratingRanges = [
  { min: 0, max: 1200, color: 'rgba(205,204,205,0.2)' },
  { min: 1200, max: 1400, color: 'rgba(118,254,119,255)' },
  { min: 1400, max: 1600, color: 'rgba(119,221,187,255)' },
  { min: 1600, max: 1900, color: 'rgba(171,171,255,255)' },
  { min: 1900, max: 2100, color: 'rgba(255,136,255,255)' },
  { min: 2100, max: 2300, color: 'rgba(254,204,137,255)' },
  { min: 2300, max: 2400, color: 'rgba(254,186,85,255)' },
  { min: 2400, max: 2600, color: 'rgba(254,119,118,255)' },
  { min: 2600, max: 3000, color: 'rgba(254,119,118,255)' },
  { min: 3000, max: 5000, color: 'rgba(170,1,1,255)' },
];

const CustomTooltip = ({ active, payload, label }) => {
  const { isDarkMode } = useTheme();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`p-3 rounded-lg shadow-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {data.contestName}
        </p>
        <p className="text-sm">
          Rating: <span style={{ color: getColorByRating(data.newRating) }}>
            {data.newRating} ({data.newRating - data.oldRating > 0 ? '+' : ''}{data.newRating - data.oldRating})
          </span>
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Rank: {data.rank}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Date: {new Date(data.date).toLocaleDateString()}
        </p>
      </div>
    );
  }
  return null;
};

const RatingGraph = ({ studentData }) => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(360);
  const url = "http://localhost:3000/api";

  const fetchData = async () => {
    if (!studentData?._id) {
      setError("No student data available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${url}/${studentData._id}/contests`, {
        params: { range: range }
      });

      if (res.data?.contest) {
        const formattedData = res.data.contest.map(contest => ({
          ...contest,
          date: new Date(contest.date).toLocaleDateString(),
          ratingChange: contest.newRating - contest.oldRating
        }));
        setData(formattedData);
      } else {
        setError("No contest data available");
      }
    } catch (e) {
      console.error("Error fetching contests:", e);
      setError(e.response?.data?.message || "Failed to load contest data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, studentData?._id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          isDarkMode ? 'border-blue-400' : 'border-blue-600'
        }`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <p className={isDarkMode ? 'text-red-400' : 'text-red-500'}>{error}</p>
        <button 
          onClick={fetchData}
          className={`mt-2 px-4 py-2 rounded transition-colors ${
            isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'
      }`}>
        No contest data available for this period
      </div>
    );
  }

  const ratings = data.map(item => item.newRating);
  const minRating = Math.max(0, Math.min(...ratings) - 200);
  const maxRating = Math.max(...ratings) + 200;

  return (
    <div className={`p-4 rounded-xl shadow-lg transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 text-center ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Codeforces Rating Graph for <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
          {studentData.cfhandle}
        </span>
      </h2>

      <div className="flex justify-center mb-4">
        <select 
          value={range} 
          onChange={(e) => setRange(Number(e.target.value))}
          className={`px-3 py-2 rounded border transition-colors ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
          }`}
        >
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={180}>Last 6 Months</option>
          <option value={360}>Last Year</option>
        </select>
      </div>

      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} 
              strokeOpacity={0.5} 
            />
            <XAxis 
              dataKey="date" 
              tick={{ 
                fontSize: 10,
                fill: isDarkMode ? '#9ca3af' : '#6b7280'
              }} 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <YAxis 
              domain={[minRating, maxRating]} 
              tick={{ 
                fill: isDarkMode ? '#9ca3af' : '#6b7280'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {ratingRanges.map((range, index) => (
              <ReferenceArea
                key={index}
                y1={range.min}
                y2={range.max}
                fill={range.color}
                stroke="none"
                ifOverflow="visible"
              />
            ))}
            
            <Line
              type="monotone"
              dataKey="newRating"
              stroke={isDarkMode ? '#60a5fa' : '#3b82f6'}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ 
                r: 5, 
                stroke: isDarkMode ? '#3b82f6' : '#2563eb', 
                strokeWidth: 2 
              }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingGraph;