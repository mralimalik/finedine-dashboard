import { useState, useEffect, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
export const VenueContext = createContext();

export const VenueContextProvider = ({ children, venueId }) => {
  // for storing add venue dialog to show or not
  const [isModalOpen, setIsModalOpen] = useState(false);

  // for storing add venue dialog ref
  const venueModalRef = useRef(null);

// for handling charges of venue sale
  const [extraCharges, setExtraCharges] = useState([]);


  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("Function running again as venueId changed");
  }, [venueId]);

  return (
    <VenueContext.Provider
      value={{
        isModalOpen,
        venueModalRef,
        handleModalOpen,
        handleModalClose,
        setIsModalOpen,
        venueId,
        extraCharges,
        setExtraCharges
      }}
    >
      {children}
    </VenueContext.Provider>
  );
};
