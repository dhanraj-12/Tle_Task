import React, { useEffect } from "react";
import Heatmap from "./Heatmap";
import useStudentStore from "../Context/studentStore";
import axios from "axios";
const Profilepage = () => {
    const url = 'http://localhost:3000/api';
    
    const fetchdetails = async()=>{
        try{
            const res = await axios.get(`${url}/check`, {
                headers: {
                  authorization: `${localStorage.getItem('token')}`
                }
            })
            if(res.data.status){
                const studentData = res.data.data;
                useStudentStore.getState().setStudent(studentData);
                // console.log(useStudentStore.getState().student);
            }
            }catch(e) {
            console.error("Error fetching student data:", e);
        }
        
    }
    
    useEffect(()=>{
        fetchdetails();
    },[]);
    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Hi there 👋</h1>

            <div className="bg-white  shadow-md rounded-xl p-4">
                <h2 className="text-xl font-medium mb-4">Submission Heatmap</h2>
                
                <div className="overflow-auto">
                    <Heatmap />
                </div>
            </div>
        </div>
    );
};

export default Profilepage;
