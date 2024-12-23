import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import { baseUrl } from "../../const/constants.js";
import { toast } from "react-toastify";
import { VenueContext } from "../../context/VenueContext.jsx";
import AddVenueModal from "../../component/AddVenueModal/AddVenueModal.jsx";
import { SelectVenueCountryDropdown } from "../../component/AddVenueModal/AddVenueModal.jsx";
const VenueInfoPage = () => {
  const [formData, setFormData] = useState({
    venueName: "",
    country: "",
  });

  const { selectedVenue, setLoading, setSelectedVenue, setUserVenues } =
    useContext(AuthContext);

  const { handleModalOpen, handleModalClose, isModalOpen } =
    useContext(VenueContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //   update the venue country or name
  const handleVenueUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("Token");

    // Prepare the payload
    const updateData = {
      venueName: formData.venueName,
      country: formData.country,
    };

    try {
      // Make the PUT request to update the venue
      const response = await axios.put(
        `${baseUrl}/venue/update/${selectedVenue.venueId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        handleVenueLocalUpdate();
        toast.success("Venue updated successfully!");
      }

      // Optionally, you can update the local state or redirect the user
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update venue. Please try again.");
      setLoading(false);
      console.error("Error updating venue:", error);
    }
  };
  
  // update the local variables
  const handleVenueLocalUpdate = () => {
    // update the selected venue map
    setSelectedVenue((prev) => ({
      ...prev,
      venueName: formData.venueName,
      country: formData.country,
    }));

    // update venue name in all user venues list
    setUserVenues((allvenues) =>
      allvenues.map((venue) => {
        return venue.venueId === selectedVenue.venueId
          ? {
              ...venue,
              venueName: formData.venueName,
              country: formData.country,
            }
          : venue;
      })
    );
  };

  useEffect(() => {
    if (selectedVenue) {
      setFormData({
        venueName: selectedVenue.venueName || "",
        country: selectedVenue.country || "",
      });
    }
  }, [selectedVenue]);

  return (
    <>
      {selectedVenue && (
        <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div>
            <h3 className="text-lg font-semibold mb-6">Venue Information</h3>
            <form onSubmit={handleVenueUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="venueName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Venue Name
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <SelectVenueCountryDropdown
                  value={formData.country}
                  mainClassname={
                    "flex flex-col my-2 gap-2 font-medium text-gray-700"
                  }
                  dropdownClass={"border py-2 px-2 outline-none rounded-md"}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <button
                type="submit"
                className="px-5 py-1 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      {!selectedVenue && (
        <div
          className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer"
          onClick={handleModalOpen}
        >
          {!selectedVenue && <h3>Create Venue</h3>}
          <AddVenueModal isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      )}
    </>
  );
};

export default VenueInfoPage;
