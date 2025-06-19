import React from "react";
import StudentTable from "./StudentTable";
import Header from "./Header";
import { useState } from "react";


const HomePage = ()=> {
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [submitindStudentId, setSubmitindStudentId] = useState(null);
    
    return(
        <>  
            <Header
            setIsSubmiting={setIsSubmiting}
            setSubmitindStudentId={setSubmitindStudentId}
            ></Header>
            <StudentTable 
            isSubmiting={isSubmiting}
            submitindStudentId={submitindStudentId}
            ></StudentTable>
        </>
    )
}

export default HomePage;