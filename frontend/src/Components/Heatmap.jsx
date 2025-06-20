import React, { useEffect, useState } from "react";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import useStudentStore from "../Context/studentStore";
import axios from "axios";

const Heatmap = () => {
  const [data, setData] = useState([]);
  const url = 'http://localhost:3000/api';
  const [year, setYear] = useState(2025);
  const student = useStudentStore((state) => state.student);
  console.log("Student Data:", student);
  const studentData = JSON.parse(JSON.stringify(student));
  const handleChangeYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  const fetchData = async () => {
    try {
      if (!student?.userid) return;
      
      const res = await axios.get(`${url}/heatmapdata`, {
        params: {
          year: year,
          id: studentData._id
        }
      });
      
      setData(res.data.data || []);
    } catch (e) {
      console.error("Error fetching heatmap data:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, student?.userid]); // Only re-run when year or userid changes

  // Format data for the heatmap
  console.log("Data",data);

  const heatmapValues = data.map(item => ({
    date: item.date,
    count: item.count
  }));

  console.log("Heatmap data:", heatmapValues);

  return (
    <div style={{ padding: 20 }}>
      <select value={year} onChange={handleChangeYear}>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
      
      {data.length > 0 ? (
        <CalendarHeatmap
          startDate={new Date(`${year}-01-01`)}
          endDate={new Date(`${year}-12-31`)}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            if (value.count >= 4) return 'color-scale-4';
            if (value.count === 3) return 'color-scale-3';
            if (value.count === 2) return 'color-scale-2';
            return 'color-scale-1';
          }}
        />
      ) : (
        <p>No data available for this year</p>
      )}
    </div>
  );
};

export default Heatmap;