import React, { useState, useEffect, useContext } from "react";
import "./MenuList.css";
import ToggleMenu from "../ToggleMenu/ToggleMenu.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../context/OrderContext.jsx";
import "./ResponsiveMenuList.css";
const MenuList = () => {
  const navigate = useNavigate();
  const { setMenuItems, menuItems, formatDate } = useContext(MenuContext);
  const { selectedVenue } = useContext(AuthContext);
  const { orderSettings } = useContext(OrderContext);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const updatedItems = [...menuItems]; // Create a shallow copy of the array
    const draggedItem = updatedItems[draggedIndex]; // Get the dragged item

    // Remove the dragged item from the array
    updatedItems.splice(draggedIndex, 1);

    // Insert the dragged item at the target position
    updatedItems.splice(targetIndex, 0, draggedItem);

    // Update the state
    setMenuItems(updatedItems);
    setDraggedIndex(null); // Reset dragged index
  };

  // Fetch menus
  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.get(
        `http://localhost:3000/menu/${selectedVenue._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMenuItems(response.data.data || []);

      console.log("response", response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  // const handleMenuActive = async (index) => {
  //   const updatedMenus = [...menuItems];
  //   updatedMenus[index].isActive = !updatedMenus[index].isActive;

  //   setMenuItems(updatedMenus);
  // };

  const handleMenuActive = async (index) => {
    try {
      // Make a copy of the current menuItems
      const updatedMenus = [...menuItems];
      const selectedMenu = updatedMenus[index];

      // Toggle isActive value locally
      const newIsActiveStatus = !selectedMenu.isActive;

      // Make API call to update the isActive status
      const token = localStorage.getItem("Token");
      const response = await axios.patch(
        `http://localhost:3000/menu/${selectedMenu._id}`,
        { isActive: newIsActiveStatus }, // Send only the isActive field
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the menu item with the response data
      updatedMenus[index].isActive = newIsActiveStatus;
      setMenuItems(updatedMenus);

      console.log(`Menu ${selectedMenu._id} `, response.data.data);
    } catch (error) {
      console.error("Error updating menu isActive:", error);
      alert("Failed to update menu. Please try again.");
    }
  };

  // Navigate to MenuEditor with the selected menuId
  const handleMenuClick = (menuId) => {
    try {
      navigate(`/venue/${selectedVenue.venueId}/menu-management/${menuId}`);
      console.log("navigated");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [selectedVenue]);

  return (
    <div>
      {menuItems.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p>{selectedVenue ? "No Menu Created" : "Create Venue First"}</p>
        </div>
      ) : (
        menuItems.map((data, index) => (
          <div
            className="card-div my-2"
            draggable
            key={index}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => handleMenuClick(data._id)}
          >
            <div className="card-left-div ">
              <div className="menu-drag-handle-nograb">---</div>
              <div className="menu-card-list">
                <div className="title-row">
                  <p className="menu-title">{data.menuName}</p>
                  {data.isActive && <div className="active-menu-div">Live</div>}
                  {(orderSettings?.settings?.dineIn?.orderEnabled ||
                    orderSettings?.settings?.pickup?.orderEnabled ||
                    orderSettings?.settings?.delivery?.orderEnabled) && (
                    <div className="active-order-menu-div">
                      Ordering Enabled
                    </div>
                  )}
                </div>

                <div className="availability-text">Availability: Always</div>

                <div className="menu-info-row">
                  <p>
                    {data.sections} Sections, {data.items} Items - Last updated
                    on {formatDate(data.updatedAt)} -{" "}
                  </p>

                  <div className="flex hide-orderinfo">
                    <OrderInfo orderSettings={orderSettings} />
                  </div>
                </div>

                <div className="hidden show-orderinfo">
                  <OrderInfo orderSettings={orderSettings} />
                </div>
              </div>
            </div>

            <div className="toggle-menu-div">
              <ToggleMenu
                isMenuActive={data.isActive}
                onToggle={() => {
                  handleMenuActive(index);
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MenuList;

// Reusable OrderInfo component
const OrderInfo = ({ orderSettings }) => {
  return (
    <>
      {orderSettings?.settings?.dineIn.orderEnabled && <p>Dine-in QR -</p>}
      {orderSettings?.settings?.pickup.orderEnabled && <p>Pick-up -</p>}
      {orderSettings?.settings?.delivery.orderEnabled && <p>Delivery</p>}
    </>
  );
};
