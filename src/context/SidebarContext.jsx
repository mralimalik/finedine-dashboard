import { useState, useEffect, createContext, useRef } from "react";

export const SidebarContext = createContext();

export const SidebarContextProvider = ({ children }) => {
  // storing selected route item index in side bar
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // storing all venues pop up bool value
  const [showVeneueSwitchPopUp, setSwitch] = useState(false);

  // storing ref of that pop up
  const venueSwitchRef = useRef(null);

  const selectSidebarItem = (index) => {
    setSelectedItemIndex(index);
  };

  const handleVenuePopUp = () => {
    setSwitch(!showVeneueSwitchPopUp);
    console.log("showing pop up", showVeneueSwitchPopUp);
  };
  return (
    <SidebarContext.Provider
      value={{
        selectedItemIndex,
        setSelectedItemIndex,
        selectSidebarItem,
        showVeneueSwitchPopUp,
        handleVenuePopUp,
        setSwitch,
        venueSwitchRef,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
