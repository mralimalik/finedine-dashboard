import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../const/constants.js";

const SelectVenueCountryDropdown = ({
  value,
  onChange,
  mainClassname,
  dropdownClass,
}) => {
  const [availableCountries, setAvailableCountries] = useState([]);
  // Fetch available countries from the backend
  const fetchAvailableCountries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (response.status === 200) {
        const countries = response.data.data.countries;
        setAvailableCountries(countries);
      }
    } catch (error) {
      console.error("Error fetching available countries:", error);
    }
  };
  useEffect(() => {
    fetchAvailableCountries();
  }, []);

  // Include the selected country in the dropdown options if it is not already present
  const options =
    value && !availableCountries.includes(value)
      ? [`${value} (Not Available)`, ...availableCountries]
      : availableCountries;

  return (
    <div className={mainClassname}>
      <label htmlFor="country">Country</label>
      <select
        id="country"
        name="country"
        value={value}
        onChange={onChange}
        required
        className={dropdownClass}
      >
        <option value="" disabled>
          Select Country
        </option>
        {options.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectVenueCountryDropdown;
