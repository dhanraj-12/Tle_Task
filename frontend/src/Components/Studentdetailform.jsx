import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDetailForm = ({ closeModal, isEdit, setIsSubmitting, setSubmittingStudentId, student }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [cfhandle, setCfhandle] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && student) {
            setName(student.name || "");
            setEmail(student.email || "");
            setCfhandle(student.cfhandle || "");
            setMobile(student.phnumber || "");
        }
    }, [isEdit, student]);

    const handleSubmit = async () => {
        if (!name || !email || !cfhandle || !mobile) {
            alert("Please fill all required fields");
            return;
        }

        closeModal();
        setLoading(true);
        setIsSubmitting(true);
        
        // Set the student ID for loading state
        if (isEdit) {
            setSubmittingStudentId(student._id);
        } else {
            setSubmittingStudentId('new'); // Special ID for new students
        }

        try {
            const url = isEdit ? "http://localhost:3000/api/edit" : "http://localhost:3000/api/add";
            await axios.post(url, {
                name,
                email,
                cfhandle,
                phnumber: mobile
            }, {
                headers: {
                    "authorization": `${localStorage.getItem("token")}`
                }
            });
            window.location.reload(); // Refresh to show updated data
        } catch (e) {
            alert(e.response?.data?.message || "Failed to submit details");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
            setSubmittingStudentId(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-950/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? "Edit Student Details" : "Add Student Details"}
                </h2>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Codeforces Handle" 
                        value={cfhandle} 
                        onChange={(e) => setCfhandle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Mobile Number" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button 
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        disabled={loading}
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isEdit ? "Update Details" : "Submit Details"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailForm;