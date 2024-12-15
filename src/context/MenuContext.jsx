import { useState, useEffect, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  // show add new section or item sheet
  const [showSectionItemSheet, setShowSectionItemSheet] = useState(null);

  // all menu data
  const [menuItems, setMenuItems] = useState([]);
  // all menu items and section data
  const [menuData, setMenuSectionsData] = useState([]);

  //hold data to edit of that section on which i tap
  const [editSectionData, setEditSectionData] = useState(null);

  //select parent section id
  const [sectionParentId, setSectionParentId] = useState(null);

  //hold data to edit of that item on which i tap
  const [editItemData, setEditItemData] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMenuesItemsandSections = async (menuId) => {
    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      console.log(menuId);

      const response = await axios.get(
        `http://localhost:3000/menu/menuitems/${menuId}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle the response after successfully creating a venue
      if (response.data) {
        console.log("Data of items and secitons", response.data);
        setMenuSectionsData(response.data);
      }
    } catch (err) {
      console.log("Error creating menu with no item:", err);
    }
  };

  // updating section data in backend
  const updateActiveSection = async (isActive) => {
    const sectionId = editSectionData._id;
    const apiUrl = `http://localhost:3000/menu/menusection/${sectionId}`;
    const token = localStorage.getItem("Token");
    try {
      const body = {
        isActive: isActive,
      };
      // Send the PUT request
      const response = await axios.put(apiUrl, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data.data);

      closeSectionSheet();
    } catch (error) {
      console.error("Error updating section:", error.response || error.message);
    } finally {
    }
  };

  // to add new sheet
  const toggleSectionSheet = (sectionId) => {
    setEditSectionData(null);
    setSectionParentId(sectionId);
    setShowSectionItemSheet("SECTION");
  };

  const closeSectionSheet = () => {
    setShowSectionItemSheet(null);
    setEditItemData(null);
    setEditSectionData(null);
    clearItemFields();
  };

  // Open the sheet to edit the section
  const openEditSectionSheet = (sectionData) => {
    setEditSectionData(null);
    setEditSectionData(sectionData);
    setSectionParentId(sectionData.parentId);
    setShowSectionItemSheet("SECTION");
  };

  // for add or updaitng menu items;
  const [itemName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [itemImage, setItemImage] = useState(null);
  // set price for items
  const [price, setPriceCalorie] = useState([
    {
      name: "",
      price: 0,
      calories: 0,
    },
  ]);
  const [isSoldOut, setIsSoldOut] = useState(false);

  // set modifiers for item
  const [modifiers, setModifiers] = useState([]);

  const clearItemFields = () => {
    setName("");
    setDescription("");
    setItemImage("");
    setName("");
    setPriceCalorie([
      {
        name: "",
        price: 0,
        calories: 0,
      },
    ]);

    setModifiers([]);
    setIsSoldOut(false);
  };

  const createItem = async (menuId, selectedVenue) => {
    const apiUrl = `http://localhost:3000/menu/menuitem/${menuId}`;
    const venueId = selectedVenue._id;
    const token = localStorage.getItem("Token");
    console.log(price);

    try {
      // Create FormData object
      const data = new FormData();
      data.append("itemName", itemName);
      data.append("venueId", venueId);
      data.append("itemImage", itemImage);
      data.append("price", JSON.stringify(price));
      data.append("isSold",isSoldOut);
      if (sectionParentId) data.append("parentId", sectionParentId);
      if (description) data.append("description", description);
      if (modifiers) data.append("modifiers", JSON.stringify(modifiers));


      // Send the POST request
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("API Response:", response.data.data);
        updateMenuItems(response.data.data);
        alert("Item added successfully");
        clearItemFields();
        closeSectionSheet();
      }
    } catch (error) {
      console.error("Error creating item:", error.response || error.message);
    } finally {
    }
  };

  const updateMenuItems = (newItem) => {
    setMenuSectionsData((prevMenuData) => {
      const updatedMenuData = [...prevMenuData];

      if (!newItem.parentId) {
        console.error("Items must have a valid parentId!");
        updatedMenuData.push(newItem);
      } else {
        addItemToSection(updatedMenuData, newItem);
      }

      return updatedMenuData;
    });
  };

  const addItemToSection = (sections, newItem) => {
    for (let section of sections) {
      if (section._id === newItem.parentId) {
        if (!section.items) {
          section.items = [];
        }
        section.items.push(newItem);
        return true;
      }
      if (section.subSections && section.subSections.length > 0) {
        if (addItemToSection(section.subSections, newItem)) {
          return true;
        }
      }
    }
    console.error("Parent section not found for item!");
    return false;
  };
  // for edit item
  const assignItemDataToVariables = (itemData) => {
    setName(itemData.itemName);
    setDescription(itemData.description);
    setItemImage(itemData.image);
    setPriceCalorie(itemData.price);
    setModifiers(itemData.modifiers);
    setIsSoldOut(itemData.isSold);
  };
  // to add new sheet
  const toggleNewItemSheet = (sectionId) => {
    setEditItemData(null);
    setSectionParentId(sectionId);
    setShowSectionItemSheet("ITEM");
  };
  // to open edit item sheet
  const toggleEditItemSheet = (sectionData) => {
    setEditItemData(null);
    setEditItemData(sectionData);
    setSectionParentId(sectionData.parentId);
    setShowSectionItemSheet("ITEM");
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        setMenuItems,
        formatDate,
        menuData,
        setMenuSectionsData,
        getMenuesItemsandSections,
        showSectionItemSheet,
        toggleSectionSheet,
        sectionParentId,
        closeSectionSheet,
        setSectionParentId,
        openEditSectionSheet,
        editSectionData,
        price,
        setPriceCalorie,
        editItemData,
        setEditItemData,
        toggleNewItemSheet,
        itemName,
        setName,
        description,
        setDescription,
        itemImage,
        setItemImage,
        createItem,
        toggleEditItemSheet,
        clearItemFields,
        assignItemDataToVariables,
        modifiers,
        setModifiers,
        setShowSectionItemSheet,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
