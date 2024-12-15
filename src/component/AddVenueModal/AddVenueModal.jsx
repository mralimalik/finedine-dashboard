import React, { useState, useContext } from "react";
import "./AddVenueModel.css";
import { VenueContext } from "../../context/VenueContext.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
const AddVenueModal = ({ isOpen, onClose }) => {
  // for venue modal dialog ref
  const { venueModalRef } = useContext(VenueContext);

  // getting all venues, selected current venue, seting current venue
  const { setUserVenues, selectedVenue, userVenues, setSelectedVenue } = useContext(AuthContext);

  const [venueName, setVenueName] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!venueName || !country) {
      // setError("Both venue name and country are required.");
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      const response = await axios.post(
        "http://localhost:3000/venue/createVenue",
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
          // if currentVenue is  empty then merge, and also set current venue with data
          setUserVenues((prev) => [...(prev || []), response.data.data]);
          setSelectedVenue(response.data.data);
          //after setting then navigate with venueId
          navigate(`/venue/${response.data.data.venueId}/dashboard`);
        }
        onClose();
      }
    } catch (err) {
      console.log("Error creating venue:", err);
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
            <label htmlFor="country">Country</label>
            <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
              <option value="" disabled>
                Select Country
              </option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
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
