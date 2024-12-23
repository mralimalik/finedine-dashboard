import PersonalInfoForm from "./PersonalInfoForm";

import React from "react";
import { ToastContainer } from "react-toastify";
const Profile = () => {
  return (
    <div>
      <div className="p-4 bg-white shadow-md text-xl font-semibold">Account Settings</div>
      <PersonalInfoForm />
      <ToastContainer/>
    </div>
  );
};

export default Profile;
