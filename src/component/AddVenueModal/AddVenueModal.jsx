import React, { useState, useContext } from "react";
import "./AddVenueModel.css";
import { VenueContext } from "../../context/VenueContext.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../const/constants.js";
import { toast } from "react-toastify";
import SelectVenueCountryDropdown from "../SelectVenueCountryDropdown/SelectVenueCountryDropdown.jsx";
const AddVenueModal = ({ isOpen, onClose }) => {
  const [venueName, setVenueName] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  // for venue modal dialog ref
  const { venueModalRef } = useContext(VenueContext);

  // getting all venues, selected current venue, setting current venue
  const {
    setUserVenues,
    selectedVenue,
    userVenues,
    setSelectedVenue,
    setLoading,
  } = useContext(AuthContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!venueName || !country) {
      // setError("Both venue name and country are required.");
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/venue/createVenue`,
        { venueName, country },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle the response after successfully creating a venue
      if (response.data?.data) {
        console.log("Venue created successfully:", response.data.data);

        if (selectedVenue) {
          // if currentVenue is not empty then merge
          setUserVenues((prev) => [...prev, response.data.data]);
        } else {
          // if currentVenue is empty then merge, and also set current venue with data
          setUserVenues((prev) => [...(prev || []), response.data.data]);
          setSelectedVenue(response.data.data);
          // after setting then navigate with venueId
          navigate(`/venue/${response.data.data.venueId}/dashboard`);
        }
        toast.success("Venue created successfully");
        onClose();
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log("Error creating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={venueModalRef}>
        <div className="modal-header">
          <h2>Add New Venue</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="venueName">Name of your venue</label>
            <input
              type="text"
              id="venueName"
              placeholder="Enter venue name"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <SelectVenueCountryDropdown
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVenueModal;
