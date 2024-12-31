import { useState, useEffect, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../const/constants.js";
import { toast } from "react-toastify";
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

  // get menu item and sections data
  const getMenuesItemsandSections = async (menuId) => {
    // Get the token from localStorage
    const token = localStorage.getItem("Token");

    try {
      console.log(menuId);

      const response = await axios.get(
        `${baseUrl}/menu/menuitems/${menuId}`,

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
  const updateActiveSection = async (isActive, sectionId) => {
    // const sectionId = editSectionData._id;
    const apiUrl = `${baseUrl}/menu/menusection/${sectionId}`;
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
  // labels for item
  const [selectedLabels, setSelectedLabels] = useState([]);

  // clear fields after doing operations
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

  // add items in menu
  const createItem = async (menuId, selectedVenue, setLoading) => {
    const apiUrl = `${baseUrl}/menu/menuitem/${menuId}`;
    const venueId = selectedVenue._id;
    const token = localStorage.getItem("Token");
    console.log(price);

    try {
      setLoading(true);
      // Create FormData object
      const data = new FormData();
      data.append("itemName", itemName);
      data.append("venueId", venueId);
      data.append("itemImage", itemImage);
      data.append("price", JSON.stringify(price));
      data.append("isSold", isSoldOut);
      if (sectionParentId) data.append("parentId", sectionParentId);
      if (description) data.append("description", description);
      if (modifiers) data.append("modifiers", JSON.stringify(modifiers));
      if (selectedLabels) data.append("labels", JSON.stringify(selectedLabels));

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
        toast.success(`${itemName} added successfully`);

        // Increment the item count in the corresponding menu
        setMenuItems((prevMenuItems) =>
          prevMenuItems.map((menu) =>
            menu._id === menuId ? { ...menu, items: menu.items + 1 } : menu
          )
        );

        clearItemFields();
        closeSectionSheet();
      }
    } catch (error) {
      toast.error("Error adding item, try again");
      console.error("Error creating item:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // update menu section list if there is no parent id
  const updateMenuItems = (newItem) => {
    try {
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
    } catch (e) {}
  };

  // update or add item to section if there is parent Id
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

  // for edit item assiging variables
  const assignItemDataToVariables = (itemData) => {
    setName(itemData.itemName);
    setDescription(itemData.description);
    setItemImage(itemData.image);
    setPriceCalorie(itemData.price);
    setModifiers(itemData.modifiers);
    setIsSoldOut(itemData.isSold);
    setSelectedLabels(itemData.labels);
    console.log(selectedLabels);
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

  // to delete the section data from backend
  const handleItemDelete = async (menuId, itemId, setLoading, handleClose) => {
    try {
      setLoading(true);

      // Construct the URL for DELETE request
      const url = `${baseUrl}/menu/delete/${menuId}/item/${itemId}`;
      const token = localStorage.getItem("Token");

      // Perform the DELETE request
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMenuSectionsData((prevMenuSectionsData) =>
          deleteItemFromSectionsRecursively(prevMenuSectionsData, itemId)
        );
        handleClose();
        toast.success("Item deleted successfully");

        // Decrement the item count in the corresponding menu
        setMenuItems((prevMenuItems) =>
          prevMenuItems.map((menu) =>
            menu._id === menuId ? { ...menu, items: menu.items - 1 } : menu
          )
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting section:", error);
      toast.error("Failed to delete the item. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // after deleting item from backend, remove it from list too
  const deleteItemFromSectionsRecursively = (sections, itemId) => {
    return (
      sections
        .map((section) => {
          // Filter items in the current section
          if (section.items) {
            section.items = section.items.filter((item) => item._id !== itemId);
          }

          // Check and update subSections recursively
          if (section.subSections) {
            section.subSections = deleteItemFromSectionsRecursively(
              section.subSections,
              itemId
            );
          }

          return section;
        })
        // Remove any section or item at this level that matches the itemId
        .filter((section) => section._id !== itemId)
    );
  };

  // update item data in menu
  const updateItem = async (itemId, setLoading) => {
    const apiUrl = `${baseUrl}/menu/update/menuitem/${itemId}`;
    const token = localStorage.getItem("Token");
    console.log(price);

    try {
      setLoading(true);

      // Create FormData object
      const data = new FormData();
      data.append("itemName", itemName);
      data.append("itemImage", itemImage);
      data.append("price", JSON.stringify(price));
      data.append("isSold", isSoldOut);
      if (sectionParentId) data.append("parentId", sectionParentId);
      if (description) data.append("description", description);
      if (modifiers) data.append("modifiers", JSON.stringify(modifiers));
      if (selectedLabels) data.append("labels", JSON.stringify(selectedLabels));

      // Send the POST request
      const response = await axios.put(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const newUpdatedItem = response.data.data;

        // Update menu sections
        setMenuSectionsData((prevSections) =>
          updateSectionItemList(
            [...prevSections],
            newUpdatedItem,
            editItemData.parentId
          )
        );

        // setMenuSectionsData((prev)=>());
        console.log("API Response:", response.data.data);
        toast.success(`${itemName} updated successfully`);
        closeSectionSheet();
      }
    } catch (error) {
      toast.error("Error updating item, try again");
      console.error("Error creating item:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };
  const updateSectionItemList = (sections, newItem, oldParentId) => {
    // If the parentId has changed, remove the item from the old parent section
    if (newItem.parentId !== oldParentId) {
      sections.forEach((section) => {
        if (section.items) {
          section.items = section.items.filter(
            (item) => item._id !== newItem._id
          );
        }
        if (section.subSections) {
          updateSectionItemList(section.subSections, newItem, oldParentId);
        }
      });
    }

    // Add or update item in the new parent section
    sections.forEach((section) => {
      if (section._id === newItem.parentId) {
        section.items = section.items || [];
        const existingItemIndex = section.items.findIndex(
          (item) => item._id === newItem._id
        );
        if (existingItemIndex !== -1) {
          // Update existing item with the new data
          section.items[existingItemIndex] = newItem;
        } else {
          // Add the item if it doesn't exist in this section
          section.items.push(newItem);
        }
      }
      if (section.subSections) {
        updateSectionItemList(section.subSections, newItem, oldParentId);
      }
    });

    return sections;
  };

  // update item data in menu
  const updateActiveItem = async (itemId, setLoading, isActive) => {
    const apiUrl = `${baseUrl}/menu/update/menuitem/${itemId}`;
    const token = localStorage.getItem("Token");
    console.log(price);

    try {
      setLoading(true);

      // Create FormData object
      const data = new FormData();

      data.append("isActive", isActive);

      // Send the POST request
      const response = await axios.put(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("item enabled disabled",isActive);
        
      }
    } catch (error) {
      toast.error("Error updating item, try again");
      console.error("Error creating item:", error.response || error.message);
    } finally {
      setLoading(false);
    }
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
        updateActiveSection,
        handleItemDelete,
        updateItem,
        selectedLabels,
        setSelectedLabels,
        updateActiveItem
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
