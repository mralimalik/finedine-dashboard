import React, { useState, useEffect } from "react";
import "./AddNewSectionSheet.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Select from "react-select"; // Import React-Select
import { MenuContext } from "../../context/MenuContext.jsx";
import { Menu } from "../../../../backend/src/models/menu.model.js";
const AddNewSectionSheet = ({}) => {
  const { menuId } = useParams();
  const { selectedVenue } = useContext(AuthContext);

  // all menu items and section data
  const {
    menuData,
    setMenuSectionsData,
    sectionParentId,
    setSectionParentId,
    closeSectionSheet,
    editSectionData,
  } = useContext(MenuContext);

  // for input data
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [dropdownOption, setDropdownOptions] = useState([]);

  // handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // handle section change
  const handleParentChange = (selectedOption) => {
    setSectionParentId(selectedOption ? selectedOption.value : null);
  };

  const createSection = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = `http://localhost:3000/menu/menusection/${menuId}`;
    const venueId = selectedVenue._id;
    const token = localStorage.getItem("Token");

    try {
      // Create FormData object
      const data = new FormData();
      data.append("sectionName", formData.name);
      data.append("venueId", venueId);
      if (sectionParentId) data.append("parentId", sectionParentId);
      data.append("itemImage", formData.image);

      // Send the POST request
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data.data);

      updateMenuSections(response.data.data);
      // Reset form on success
      setFormData({ name: "", image: null, parentId: null });

      closeSectionSheet();
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // updating sections or subsections after getting response create section
  const updateMenuSections = (newSection) => {
    setMenuSectionsData((prevMenuData) => {
      const updatedMenuData = [...prevMenuData];

      if (!newSection.parentId) {
        // Add to root level if parentId is null
        updatedMenuData.push(newSection);
      } else {
        // Add to parent section
        addSectionToParent(updatedMenuData, newSection);
      }

      return updatedMenuData;
    });
  };
  const addSectionToParent = (sections, newSection) => {
    for (let section of sections) {
      if (section._id === newSection.parentId) {
        if (!section.subSections) {
          section.subSections = [];
        }
        section.subSections.push(newSection);
        return true;
      }
      if (section.subSections && section.subSections.length > 0) {
        if (addSectionToParent(section.subSections, newSection)) {
          return true;
        }
      }
    }
    return false;
  };

  // updating section data in backend
  const updateSectionData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sectionId = editSectionData._id;
    const oldParentId = editSectionData.parentId; // Existing parentId
    const apiUrl = `http://localhost:3000/menu/menusection/${sectionId}`;
    const venueId = selectedVenue._id;
    const token = localStorage.getItem("Token");

    try {
      // Create FormData object
      const data = new FormData();
      data.append("sectionName", formData.name);
      data.append("venueId", venueId);
      if (sectionParentId) data.append("parentId", sectionParentId);
      if (formData.image instanceof File) {
        data.append("itemImage", formData.image);
      }

      // Send the PUT request
      const response = await axios.put(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data.data);
      const updatedSection = response.data.data;

      // Update the section in the menuData (including subsections)
      setMenuSectionsData((prevMenuData) => {
        const updatedMenuData = updateSectionInMenu(
          prevMenuData,
          updatedSection,
          oldParentId
        );
        console.log(updatedMenuData);

        return updatedMenuData;
      });

      closeSectionSheet();
    } catch (error) {
      console.error("Error updating form:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };
  // updating section data on frontend
  const updateSectionInMenu = (sections, updatedSection, oldParentId) => {
    return sections.map((section) => {
      // If the section matches the updated section, update its properties
      if (section._id === updatedSection._id) {
        return {
          ...section,
          sectionName: updatedSection.sectionName,
          image: updatedSection.image,
          parentId: updatedSection.parentId,
        };
      }
      // If the section has subsections, check them recursively
      if (section.subSections) {
        // Add the section to the new parent if the parentId has changed
        if (oldParentId !== updatedSection.parentId) {
          // Remove the section from its old parent
          section.subSections = section.subSections.filter(
            (subSection) => subSection._id !== updatedSection._id
          );

          const newParent = findParentById(sections, updatedSection.parentId);
          if (newParent) {
            newParent.subSections = newParent.subSections || [];
            console.log("newparent editSectionData", editSectionData);

            newParent.subSections.push({
              ...updatedSection,
              subSections: editSectionData.subSections || [],
              items: editSectionData.items || [],
            });
            console.log("newparent subsection", newParent.subSections);
          }
        }

        // Recursively update subsections
        section.subSections = updateSectionInMenu(
          section.subSections,
          updatedSection,
          oldParentId
        );
      }

      return section;
    });
  };

  // Helper function to find parent by ID
  const findParentById = (sections, parentId) => {
    for (let section of sections) {
      if (section._id === parentId) {
        return section;
      }
      if (section.subSections) {
        const parent = findParentById(section.subSections, parentId);
        if (parent) return parent;
      }
    }
    return null;
  };

  const initializeDropdownOptions = (menuData) => {
    if (menuData && menuData.length > 0) {
      const extractSections = (sections) => {
        const options = [];
        sections.forEach((section) => {
          if (
            section.type === "SECTION" &&
            section._id !== editSectionData?._id
          ) {
            options.push({
              value: section._id,
              label: section.sectionName,
            });

            if (section.subSections && section.subSections.length > 0) {
              options.push(...extractSections(section.subSections));
            }
          }
        });
        return options;
      };

      const filteredOptions = extractSections(menuData);
      setDropdownOptions(filteredOptions);
    }
  };

  // Initialize form data if editSectionData exists
  useEffect(() => {
    if (editSectionData) {
      setFormData({
        name: editSectionData.sectionName || "",
        image: editSectionData.image,
      });
    } else {
      setFormData({
        name: "",
        image: null,
      });
    }
  }, [editSectionData]);

  useEffect(() => {
    initializeDropdownOptions(menuData);
  }, [menuData, editSectionData]);

  return (
    <div className="add-section-container">
      <h2>Add New Section</h2>
      <form
        onSubmit={(e) => {
          if (editSectionData) {
            updateSectionData(e);
          } else {
            createSection(e);
          }
        }}
      >
        {/* Form Fields */}
        <div className="form-group flex flex-col">
          <label htmlFor="name">
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-2 py-1 border outline-none rounded-md"
          />
        </div>

        <div className="form-group flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            className="px-2 py-1 border outline-none rounded-md resize-none"
          ></textarea>
        </div>

        <div className="form-group flex flex-col">
          <label htmlFor="image">Image</label>
          <div
            className="h-24 w-40 bg-violet-300 rounded-md relative overflow-hidden object-cover cursor-pointer flex items-center justify-center"
            onClick={() => document.getElementById("image").click()}
          >
            {!formData.image && (
              <p className="text-sm absolute ">Choose Image</p>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Image Preview */}
            {formData.image ? (
              formData.image instanceof File ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Assign Section (optional)</label>
          <Select
            value={
              dropdownOption.find(
                (option) => option.value === sectionParentId
              ) || null
            }
            onChange={handleParentChange}
            options={dropdownOption}
            placeholder="Select sub section..."
            className="form-select"
            classNamePrefix="select"
            isClearable
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={closeSectionSheet}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {loading ? "Saving.." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewSectionSheet;
