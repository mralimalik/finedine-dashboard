import { useState, useEffect, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode"; // QR code library
import JSZip from "jszip"; // Import JSZip library

export const TableContext = createContext();

export const TableContextProvider = ({ children }) => {
  // areas with tables list
  const [areas, setAreas] = useState([]);
  // to show add area side sheet
  const [isAreaSheetOpen, setIsAreaOpenSheet] = useState(false);
  // to open add table sheet
  const [openTableAddSheet, setOpenTableAddSheet] = useState(false);
  // to open edit table sheet
  const [openTableEditSheet, setOpenTableEditSheet] = useState(false);

  // to select tables from list for qr code
  const [selectedTables, setSelectedTables] = useState([]);

  // to edit table when i tap on any table list
  const [tableToEdit, setTableToEdit] = useState(null);

  const toggleAreaSideSheet = () => {
    setIsAreaOpenSheet(!isAreaSheetOpen);
  };
  const toggleAddTableSheet = () => {
    setOpenTableAddSheet(!openTableAddSheet);
  };
  const toggleEditTableSheet = () => {
    setOpenTableEditSheet(!openTableEditSheet);
  };

  const setTableForEditing = (table) => {
    console.log(table);

    setTableToEdit(table);
    toggleEditTableSheet();
  };

  // to create area
  const createArea = async (areaName, venueId, tableIds) => {
    if (!areaName) {
      return;
    }
    const token = localStorage.getItem("Token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/table/createArea",
        {
          areaName,
          venueId: venueId,
          tableIds,
        },
        config
      );
      if (response.status === 200) {
        const newArea = response.data.data; // The newly created area with its tables

        // Remove the tables from the existing areas' tables list
        setAreas((prev) => {
          return prev.map((area) => {
            // For each area, filter out the tables whose _id is in tableIds
            const updatedTables = area.tables.filter((table) => !tableIds.includes(table._id));

            // Update the area with the filtered tables
            return { ...area, tables: updatedTables };
          });
        }); // Add the new area with the new tables
        setAreas((prev) => [...prev, newArea]);
      }
    } catch (err) {
      console.log("error creating area", err);
    } finally {
    }
  };

  //to fetch all venue area with tables
  const fetchAreaWithTables = async (venueId) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.get(`http://localhost:3000/table/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAreas(response.data.data || []);

      console.log("response", response.data.data);
    } catch (err) {
      console.log("erorr in fetching area with tables".err);
    }
  };

  // Function to create automatic tables
  const createAutomaticTables = async (tableData) => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Send data to the backend
      const response = await axios.post(
        "http://localhost:3000/table/createAutomaticTable",
        tableData,
        config
      );

      if (response.status === 200) {
        console.log("Tables created successfully:", response.data.data);

        // Append the tables to the appropriate area's tables array
        const newTables = response.data.data;
        setAreas((prevAreas) =>
          prevAreas.map((area) => {
            if (area._id === tableData.areaId) {
              return {
                ...area,
                tables: [...(area.tables || []), ...newTables],
              };
            }
            return area;
          })
        );
        toggleAddTableSheet();
      }
    } catch (err) {
      console.log("Error creating tables:", err);
    }
  };

  // Function to create automatic tables
  const createCustomTables = async (tableData) => {
    try {
      const token = localStorage.getItem("Token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Send data to the backend
      const response = await axios.post("http://localhost:3000/table/createCustomTable", tableData, config);

      if (response.status === 200) {
        console.log("Tables created successfully:", response.data.data);

        // Append the tables to the appropriate area's tables array
        const newTables = response.data.data;
        // Loop through the new tables and update the areas where areaId matches
        setAreas((prevAreas) =>
          prevAreas.map((area) => {
            // Find tables with matching areaId and add them to the area's tables array
            const areaTables = newTables.filter((table) => table.areaId === area._id);
            if (areaTables.length > 0) {
              return {
                ...area,
                tables: [...(area.tables || []), ...areaTables],
              };
            }
            return area; // If no matching areaId, return the area unchanged
          })
        );
        toggleAddTableSheet();
      }
    } catch (err) {
      console.log("Error creating tables:", err);
    }
  };

  // to download qr code of selected tables
  const handleDownloadQRCode = (venueId) => {
    // Create a new JSZip instance to create a zip file
    const zip = new JSZip();

    // Create a folder named "QR_Codes" inside the zip file
    const folder = zip.folder("QR_Codes");

    // Iterate over the selected table IDs
    selectedTables.forEach((tableId) => {
      // Find the table object using the tableId by searching through all areas and their tables
      const table = areas.flatMap((area) => area.tables).find((table) => table._id === tableId);

      // If the table exists, generate a QR code for it
      if (table) {
        // Construct the URL for the QR code with the venueId and tableId
        const qrCodeUrl = `https://qr-menu-7ie2.vercel.app/${venueId}?table=${tableId}`;

        // Create a new canvas element to render the QR code
        const canvas = document.createElement("canvas");

        // Generate the QR code and render it on the canvas
        QRCode.toCanvas(canvas, qrCodeUrl, { width: 200 }, (error) => {
          if (error) {
            // Log an error if there's an issue generating the QR code
            console.error("Error generating QR code", error);
          } else {
            // Convert the canvas to a data URL, which represents the QR code image as a base64 string
            const dataUrl = canvas.toDataURL();

            // Remove the "data:image/png;base64," part of the data URL to get the base64 image data
            const imageData = dataUrl.split(",")[1];

            // Add the QR code image to the zip file in the folder "QR_Codes" with a filename using the table name
            folder.file(`${table.tableName}_QRCode.png`, imageData, { base64: true });
          }
        });
      }
    });

    // Once all the QR codes are generated, create and download the zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      // Create a link element to trigger the download of the zip file
      const link = document.createElement("a");

      // Create a URL for the zip content (blob URL) and set it as the link's href attribute
      link.href = URL.createObjectURL(content);

      // Set the download attribute to specify the name of the downloaded file
      link.download = "QR_Codes.zip";

      // Trigger a click event on the link to start the download
      link.click();
    });
  };

  // to select tables ids for operations (qr download, delete etc)
  const handleTableSelection = (tableId) => {
    setSelectedTables((prev) => {
      if (prev.includes(tableId)) {
        return prev.filter((id) => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };

  return (
    <TableContext.Provider
      value={{
        isAreaSheetOpen,
        setIsAreaOpenSheet,
        toggleAreaSideSheet,
        createArea,
        fetchAreaWithTables,
        areas,
        setAreas,
        createAutomaticTables,
        createCustomTables,
        openTableAddSheet,
        setOpenTableAddSheet,
        toggleAddTableSheet,
        handleDownloadQRCode,
        selectedTables,
        setSelectedTables,
        handleTableSelection,
        openTableEditSheet,
        setOpenTableEditSheet,
        toggleEditTableSheet,
        setTableForEditing,
        tableToEdit,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
