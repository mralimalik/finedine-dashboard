import React, { useState, useEffect, useContext } from "react";
import "./MenuList.css";
import ToggleMenu from "../ToggleMenu/ToggleMenu.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../context/OrderContext.jsx";
import "./ResponsiveMenuList.css";
import { baseUrl } from "../../const/constants.js";
import { VenueContext } from "../../context/VenueContext.jsx";
import { MdDragHandle } from "react-icons/md";
import EditMenuSideSheet from "../EditMenuSideSheet/EditMenuSideSheet.jsx";
const MenuList = () => {
  const navigate = useNavigate();
  // holds the value of menu list and section (menuData)
  const { setMenuItems, menuItems, formatDate, menuData } =
    useContext(MenuContext);
  const { selectedVenue, setLoading } = useContext(AuthContext);
  const { orderSettings } = useContext(OrderContext);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const [activeEditMenuId, setActiveEditMenuId] = useState(null);

  const handleEditMenuSheet = (menuId) => {
    setActiveEditMenuId((prevId) => (prevId === menuId ? null : menuId));
  };

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
      setLoading(true);
      const token = localStorage.getItem("Token");
      const response = await axios.get(`${baseUrl}/menu/${selectedVenue._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.data || []);

      console.log("response", response.data.data);
      // setLoading(false);
    } catch (err) {
      // setLoading(false);

      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleMenuActive = async (index) => {
    try {
      setLoading(true);
      // Make a copy of the current menuItems
      const updatedMenus = [...menuItems];
      const selectedMenu = updatedMenus[index];

      // Toggle isActive value locally
      const newIsActiveStatus = !selectedMenu.isActive;

      // Make API call to update the isActive status
      const token = localStorage.getItem("Token");
      const response = await axios.patch(
        `${baseUrl}/menu/${selectedMenu._id}`,
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
    } finally {
      setLoading(false);
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

  const isOrderingEnabled = (venueOrderSettings, menuOrderSettings) => {
    const overallEnabled =
      venueOrderSettings?.settings?.dineIn?.orderEnabled ||
      // venueOrderSettings?.settings?.pickup?.orderEnabled ||
      venueOrderSettings?.settings?.delivery?.orderEnabled;

    const menuEnabled =
      menuOrderSettings?.dineIn?.orderEnabled ||
      // menuOrderSettings?.pickup?.orderEnabled ||
      menuOrderSettings?.delivery?.orderEnabled;

    return overallEnabled && menuEnabled;
  };

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
              <div className="menu-drag-handle-nograb">{<MdDragHandle />}</div>
              <div className="menu-card-list">
                <div className="title-row">
                  <p className="menu-title">{data.menuName}</p>
                  {data.isActive && <div className="active-menu-div">Live</div>}
                  {isOrderingEnabled(orderSettings, data.orderSettings) && (
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
                    <OrderInfo
                      menuOrderSettings={data?.orderSettings}
                    />
                  </div>
                </div>

                <div className="hidden show-orderinfo">
                  <OrderInfo
                    menuOrderSettings={data?.orderSettings}
                  />
                </div>
              </div>
            </div>

            <div className="toggle-menu-div">
              <ToggleMenu
                isMenuActive={data.isActive}
                onToggle={() => {
                  handleMenuActive(index);
                }}
                menuId={data._id}
                editMenu={() => handleEditMenuSheet(data._id)}
              />
            </div>
            {activeEditMenuId === data._id && (
              <EditMenuSideSheet
                menuId={data._id}
                initialMenuData={data}
                onClose={() => setActiveEditMenuId(null)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MenuList;

const OrderInfo = ({ venueOrderSettings, menuOrderSettings }) => {

  const dineInEnabled = menuOrderSettings?.dineIn?.orderEnabled;
  const deliveryEnabled = menuOrderSettings?.delivery?.orderEnabled;

  return (
    <>
      {dineInEnabled && <p className="mx-1">Dine-in QR</p>}

      {dineInEnabled && deliveryEnabled && <p className="mx-1">-</p>}
      {deliveryEnabled && <p className="mx-1">Delivery</p>}
    </>
  );
};
