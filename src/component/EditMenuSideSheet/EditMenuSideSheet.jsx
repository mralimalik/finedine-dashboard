import React, { useContext, useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import ReuseTextField from "../ReuseTextField/ReuseTextField.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { baseUrl } from "../../const/constants.js";
import axios from "axios";
import { MenuContext } from "../../context/MenuContext.jsx";
const EditMenuSideSheet = ({ menuId, initialMenuName, onClose }) => {
  const { setLoading } = useContext(AuthContext);
  const { setMenuItems } = useContext(MenuContext);
  const [menuName, setMenuName] = useState(initialMenuName || "");

  const handleUpdateMenu = async () => {
    setLoading(true);
    console.log(menuId);
    
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.patch(`${baseUrl}/menu/${menuId}`, {
        menuName,
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        // to update that menu  name in list
        setMenuItems((prevItems) =>
          prevItems.map((menu) =>
            menu._id === menuId ? { ...menu, menuName } : menu
          )
        );
        toast.success("Menu Updated");
        onClose();
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Failed to update menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="  fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-40"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white w-[400px] h-full flex flex-col px-3 py-3 ">
        <div className="flex flex-col h-full gap-3">
          <div className="flex gap-3 items-center">
            <RiCloseLargeFill size={"20"} className="cursor-pointer" onClick={onClose} />
            <h3 className="text-lg">Menu</h3>
          </div>
          <ReuseTextField
            required={true}
            label={"Name"}
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
        </div>
        <div className="item-buttons">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="add-button"
            onClick={handleUpdateMenu}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMenuSideSheet;
