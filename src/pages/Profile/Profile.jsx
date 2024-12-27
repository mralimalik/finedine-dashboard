import PersonalInfoForm from "./PersonalInfoForm.jsx";

import React from "react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
const Profile = () => {
  useEffect(() => {
    console.log("hello");
   
  }, [])
  
  return (
    <div>
      <div className="p-4 bg-white shadow-md text-xl font-semibold">Account Settings</div>
      <PersonalInfoForm />
      <ToastContainer/>
    </div>
  );
};

export default Profile;
