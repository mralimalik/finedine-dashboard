import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../../context/SidebarContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../../assets/logo.jpg";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen }) => {
  let items = [
    "Dashboard",
    "Menu Management",
    "Operations",
    "Orders",
    "Venue Information",
    "Reports",
  ];

  // State for managing Orders section expansion
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);

  // Getting current venue data
  const { selectedVenue,userData } = useContext(AuthContext);

  // Getting selected item (route) index, handle venue switch popup from sidebar context
  const { selectedItemIndex, setSelectedItemIndex, handleVenuePopUp } =
    useContext(SidebarContext);

  // To navigate to any route
  const navigate = useNavigate();

  // To get location of the current link
  const location = useLocation();

  const handleItemClick = (index, item) => {
    setSelectedItemIndex(index);
    let venuePath;
    // If selectedVenue(current) is not null, then navigate with venueId param else no param
    if (selectedVenue) {
      venuePath = `/venue/${selectedVenue.venueId}`;
    } else {
      venuePath = `/venue`;
    }

    if (item === "Dashboard") {
      navigate(`${venuePath}/dashboard`);
      setExpansionFalse();
    } else if (item === "Menu Management") {
      navigate(`${venuePath}/menu-management`);
      setExpansionFalse();
    } else if (item === "Operations") {
      navigate(`${venuePath}/operations`);
      setExpansionFalse();
    } else if (item === "Orders") {
      // Toggle the expanded state when "Orders" is clicked
      setIsOrdersExpanded((prev) => !prev);
    } else if (item === "Venue Information") {
      navigate(`${venuePath}/venue-information`);
      setExpansionFalse();
    } else if (item === "Reports") {
      navigate(`${venuePath}/reports`);
      setExpansionFalse();
    }
  };
  const setExpansionFalse = () => {
    setIsOrdersExpanded(false);
  };

  const handleSubItemClick = (subItem) => {
    let venuePath;
    if (selectedVenue) {
      venuePath = `/venue/${selectedVenue.venueId}`;
    } else {
      venuePath = `/venue`;
    }

    if (subItem === "All Orders") {
      navigate(`${venuePath}/orders/all-orders`);
    } else if (subItem === "Order Settings") {
      navigate(`${venuePath}/orders/order-settings`);
    }
  };

  useEffect(() => {
    if (selectedVenue) {
      const venuePath = `/venue/${selectedVenue.venueId}`;
      // Check the current URL and map it to the correct sidebar item
      if (location.pathname.includes(`${venuePath}/dashboard`)) {
        setSelectedItemIndex(0); // Set "Dashboard" as selected
      } else if (location.pathname.includes(`${venuePath}/menu-management`)) {
        setSelectedItemIndex(1); // Set "Menu Management" as selected
      } else if (location.pathname.includes(`${venuePath}/operations`)) {
        setSelectedItemIndex(2); // Set "Operations" as selected
      } else if (location.pathname.includes(`${venuePath}/orders`)) {
        setSelectedItemIndex(3);
        console.log("navigatig order");
      } else if (location.pathname.includes(`${venuePath}/venue-information`)) {
        setSelectedItemIndex(4);
      }else if (location.pathname.includes(`${venuePath}/reports`)) {
        setSelectedItemIndex(5);
      }
      console.log("navigatig");
    }
  }, [location.pathname, setSelectedItemIndex, selectedVenue]);

  return (
    <div className={`sidebar `}>
      <div className="image-log flex justify-between items-center p-3">
        <img src={`${userData.businessLogo?userData.businessLogo:Logo}`} alt="" className="logo-img h-14  rounded-lg" />
        {/* <h3>Close</h3> */}
      </div>

      <div className="venue-switch cursor-pointer" onClick={handleVenuePopUp}>
        <p>{selectedVenue ? selectedVenue.venueName : "Create Venue Here"}</p>
      </div>

      {items.map((item, index) => (
        <div key={index}>
          <div
            className={`sidebar-item ${
              selectedItemIndex === index ? "sidebar-item-selected" : ""
            } cursor-pointer`}
            onClick={() => handleItemClick(index, item)}
          >
            <p className="font-normal font-sans">{item}</p>
          </div>
          {item === "Orders" && isOrdersExpanded && (
            <div className="sidebar-subitems cursor-pointer">
              <div
                className={`sidebar-item ${
                  location.pathname.includes("all-orders")
                    ? "sidebar-item-selected"
                    : ""
                }`}
                onClick={() => handleSubItemClick("All Orders")}
              >
                <p className="font-normal font-sans">All Orders</p>
              </div>
              <div
                className={`sidebar-item ${
                  location.pathname.includes("order-settings")
                    ? "sidebar-item-selected"
                    : ""
                }`}
                onClick={() => handleSubItemClick("Order Settings")}
              >
                <p className="font-normal font-sans">Order Settings</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* If Orders is clicked, show sub-items */}
    </div>
  );
};

export default Sidebar;
