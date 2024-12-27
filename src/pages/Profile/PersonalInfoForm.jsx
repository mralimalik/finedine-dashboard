import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import { baseUrl } from "../../const/constants.js";
import { toast } from "react-toastify";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator.jsx";
const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessLogo: null,
    companyName: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName:"",
  });

  const { userData, setLoading, loading } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName.trim()) {
      formErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      formErrors.lastName = "Last Name is required";
    }
    if (!formData.companyName.trim()) {
      formErrors.companyName = "Company Name is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, businessLogo: e.target.files[0] });
  };

  // updates the profile name
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("Token");

      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("companyName", formData.companyName);
      if (formData.businessLogo) {
        formDataToSend.append("businessLogo", formData.businessLogo);
      }

      const response = await axios.put(
        `${baseUrl}/user/update`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error updating user info:", error.message);
      toast.error("Error updating user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        businessLogo: userData.businessLogo || null,
        companyName: userData.companyName || "",
      });
    }
    console.log("hello", userData);

  }, [userData]);

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
      <form onSubmit={handleProfileUpdate}>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            disabled={true}
            type="text"
            id="email"
            name="email"
            value={userData?.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-400"
          />
          <div className="mt-4">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>
          <div className="item-image-div my-2">
            <label
              htmlFor="logo"
              className="block text-base font-medium text-gray-700 my-2"
            >
              Business Logo
            </label>{" "}
            <div
              className="image-picker-div h-28 w-44 bg-violet-200 rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
              onClick={() => document.getElementById("businessLogo").click()}
            >
              <input
                className="hidden"
                type="file"
                id="businessLogo"
                name="businessLogo"
                onChange={handleImageChange}
              />
              {!formData.businessLogo && <h2>Pick Image</h2>}
              {formData.businessLogo ? (
                formData.businessLogo instanceof File ? (
                  <img
                    src={URL.createObjectURL(formData.businessLogo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={formData.businessLogo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-1 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
        >
          Save
        </button>
      </form>
      <LoadingIndicator loading={loading} />
    </div>
  );
};

export default PersonalInfoForm;
