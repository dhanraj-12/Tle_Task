import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";

const StudentDetailForm = ({ closeModal, isEdit, setIsSubmitting, setSubmittingStudentId, student }) => {
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cfhandle: "",
        mobile: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && student) {
            setFormData({
                name: student.name || "",
                email: student.email || "",
                cfhandle: student.cfhandle || "",
                mobile: student.phnumber || ""
            });
        }
    }, [isEdit, student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.cfhandle.trim()) newErrors.cfhandle = "Codeforces handle is required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        closeModal();
        setLoading(true);
        setIsSubmitting(true);
        setSubmittingStudentId(isEdit ? student._id : 'new');

        try {
            const url = isEdit ? "http://localhost:3000/api/edit" : "http://localhost:3000/api/add";
            await axios.post(url, {
                name: formData.name,
                email: formData.email,
                cfhandle: formData.cfhandle,
                phnumber: formData.mobile
            }, {
                headers: {
                    "authorization": `${localStorage.getItem("token")}`
                }
            });
            window.location.reload();
        } catch (e) {
            alert(e.response?.data?.message || "Failed to submit details");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
            setSubmittingStudentId(null);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900/80' : 'bg-black/50'}`}>
            <div className={`p-6 rounded-lg shadow-xl w-full max-w-md mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {isEdit ? "Edit Student Details" : "Add Student Details"}
                    </h2>
                    <button 
                        onClick={closeModal}
                        className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {['name', 'email', 'cfhandle', 'mobile'].map((field) => (
                        <div key={field}>
                            <input
                                name={field}
                                type={field === 'email' ? 'email' : 'text'}
                                placeholder={
                                    field === 'cfhandle' ? 'Codeforces Handle' : 
                                    field.charAt(0).toUpperCase() + field.slice(1)
                                }
                                value={formData[field]}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                                    errors[field] ? 'border-red-500 focus:ring-red-300' : 
                                    isDarkMode ? 
                                        'bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-white' : 
                                        'bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900'
                                }`}
                                required
                            />
                            {errors[field] && (
                                <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button 
                        onClick={closeModal}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isDarkMode ? 
                                'bg-gray-700 text-gray-200 hover:bg-gray-600' : 
                                'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                            loading ? 
                                'bg-indigo-400 cursor-not-allowed' : 
                                'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : isEdit ? "Update" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailForm;