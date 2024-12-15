import React, { useState } from "react";
import Sidebar from "../../component/Sidebar/Sidebar.jsx";
import Navbar from "../../component/Navbar/Navbar.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import "./Main.css";
import { useContext, useRef, useEffect } from "react";
import { SidebarContext } from "../../context/SidebarContext.jsx";
import VenueSwitchPopUp from "../../component/VenueSwitchPopUp/VenueSwitchPopUp.jsx";
import MenuManagement from "../MenuManagement/MenuManagement.jsx";
import { VenueContext } from "../../context/VenueContext.jsx";
import { Outlet, useParams } from "react-router-dom"; // To render the nested routes
import { VenueContextProvider } from "../../context/VenueContext.jsx";
const Main = () => {

  // getting required variables from context
  const { setSwitch, showVeneueSwitchPopUp, venueSwitchRef } = useContext(SidebarContext);

  // getting venue id from param
  const { venueId } = useParams();

  const { venueModalRef, isModalOpen, setIsModalOpen } = useContext(VenueContext);

  // Close the pop-up when clicking outside
  const handleClickOutside = (event) => {
    if ( venueSwitchRef.current && !venueSwitchRef.current.contains(event.target)
    ) {
      if (showVeneueSwitchPopUp === true) {
        setSwitch(false);
      }
    }

    if ( venueModalRef.current &&!venueModalRef.current.contains(event.target) ) {
      if (isModalOpen === true) {
        console.log("Model open");
        setIsModalOpen(false);
      }
    } else {
      console.log("null model ref", venueModalRef.current);
    }
  };

  return (
    <VenueContextProvider venueId={venueId}>
      <div
        className="main-page"
        onClick={(e) => {
          handleClickOutside(e);
        }}
      >
        <Sidebar />
        <div className="sidebar-page">
          <VenueSwitchPopUp />
          <div>
            <Navbar />
            <Outlet />
          </div>
        </div>
      </div>
    </VenueContextProvider>
  );
};

export default Main;
