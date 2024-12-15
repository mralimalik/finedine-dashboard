import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const ModifierContext = createContext();

export const ModifierContextProvider = ({ children }) => {
  const { selectedVenue } = useContext(AuthContext);

  // All modifiers group data
  const [allModifierData, setModifierData] = useState([]);

  // Set price for modifier group item
  const [modifierPrices, setModifierPriceCalorie] = useState([
    {
      name: "",
      price: 0,
      calories: 0,
    },
  ]);

  //  fetch modifiers
  const fetchModifiersByVenue = async (venueId) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.get(
        `http://localhost:3000/modifier/${venueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   if (response.status === 200) {
      setModifierData(response.data.data);
      console.log("all modifiers", response.data.data);

      //   }
    } catch (error) {
      console.error("Error fetching modifiers:", error);
    }
  };

  useEffect(() => {
    if (selectedVenue) {
      fetchModifiersByVenue(selectedVenue._id);
    }
  }, [selectedVenue]);

  return (
    <ModifierContext.Provider
      value={{
        allModifierData,
        modifierPrices,
        setModifierData,
        setModifierPriceCalorie,
        fetchModifiersByVenue,
      }}
    >
      {children}
    </ModifierContext.Provider>
  );
};
