import React, { useEffect, useState } from "react";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useStudentStore from "../Context/studentStore";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";

const Heatmap = () => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const url = 'http://localhost:3000/api';
  const [year, setYear] = useState(new Date().getFullYear());
  const student = useStudentStore((state) => state.student);

  const handleChangeYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  const fetchData = async () => {
    try {
      if (!student?.userid) return;
      
      const res = await axios.get(`${url}/heatmapdata`, {
        params: {
          year: year,
          id: student._id
        }
      });
      
      setData(res.data.data || []);
    } catch (e) {
      console.error("Error fetching heatmap data:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, student?.userid]);

  const heatmapValues = data.map(item => ({
    date: item.date,
    count: item.count
  }));

  return (
    <div className={`p-4 md:p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Problem Solving Activity
        </h2>
        <select 
          value={year} 
          onChange={handleChangeYear}
          className={`px-3 py-2 rounded border transition-colors ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
          }`}
        >
          {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      
      {data.length > 0 ? (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <CalendarHeatmap
            startDate={new Date(`${year}-01-01`)}
            endDate={new Date(`${year}-12-31`)}
            values={heatmapValues}
            classForValue={(value) => {
              if (!value) return isDarkMode ? 'color-empty-dark' : 'color-empty';
              if (value.count >= 4) return 'color-scale-4';
              if (value.count === 3) return 'color-scale-3';
              if (value.count === 2) return 'color-scale-2';
              return 'color-scale-1';
            }}
            showWeekdayLabels
            gutterSize={2}
            horizontal={window.innerWidth > 768}
          />
        </div>
      ) : (
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          No data available for this year
        </div>
      )}

      <style jsx global>{`
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }
        .react-calendar-heatmap .color-empty {
          fill: ${isDarkMode ? '#334155' : '#f1f5f9'};
        }
        .react-calendar-heatmap .color-empty-dark {
          fill: #334155;
        }
        /* Green color scale */
        .react-calendar-heatmap .color-scale-1 {
          fill: #bbf7d0; /* light green */
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #86efac; /* medium light green */
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #4ade80; /* medium green */
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #22c55e; /* dark green */
        }
        /* Dark mode adjustments for green scale */
        .react-calendar-heatmap .color-scale-1-dark {
          fill: #14532d; /* dark green 1 */
        }
        .react-calendar-heatmap .color-scale-2-dark {
          fill: #166534; /* dark green 2 */
        }
        .react-calendar-heatmap .color-scale-3-dark {
          fill: #15803d; /* dark green 3 */
        }
        .react-calendar-heatmap .color-scale-4-dark {
          fill: #16a34a; /* dark green 4 */
        }
        @media (max-width: 768px) {
          .react-calendar-heatmap {
            transform: rotate(-90deg);
            transform-origin: center;
            height: 200px;
            width: 300px;
            margin: 0 auto;
          }
          .react-calendar-heatmap text {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Heatmap;