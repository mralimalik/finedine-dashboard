import { useState, useEffect, createContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode"; // QR code library
import JSZip from "jszip"; // Import JSZip library
import { qrlink, baseUrl } from "../const/constants.js";
import { toast } from "react-toastify";
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
        `${baseUrl}/table/createArea`,
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
            const updatedTables = area.tables.filter(
              (table) => !tableIds.includes(table._id)
            );

            // Update the area with the filtered tables
            return { ...area, tables: updatedTables };
          });
        }); // Add the new area with the new tables
        setAreas((prev) => [...prev, newArea]);

        toast.success("Area added");
      }
    } catch (err) {
      toast.error("Error adding area,try again");
      console.log("error creating area", err);
    } finally {
    }
  };

  //to fetch all venue area with tables
  const fetchAreaWithTables = async (venueId) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.get(`${baseUrl}/table/${venueId}`, {
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
        `${baseUrl}/table/createAutomaticTable`,
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
        toast.success("Tables added successfully");
        toggleAddTableSheet();
      }
    } catch (err) {
      toast.error("Something went wrong");

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
      const response = await axios.post(
        `${baseUrl}/table/createCustomTable`,
        tableData,
        config
      );

      if (response.status === 200) {
        console.log("Tables created successfully:", response.data.data);

        // Append the tables to the appropriate area's tables array
        const newTables = response.data.data;
        // Loop through the new tables and update the areas where areaId matches
        setAreas((prevAreas) =>
          prevAreas.map((area) => {
            // Find tables with matching areaId and add them to the area's tables array
            const areaTables = newTables.filter(
              (table) => table.areaId === area._id
            );
            if (areaTables.length > 0) {
              return {
                ...area,
                tables: [...(area.tables || []), ...areaTables],
              };
            }
            return area; // If no matching areaId, return the area unchanged
          })
        );
        toast.success("Tables added successfully");

        toggleAddTableSheet();
      }
    } catch (err) {
      toast.error("Something went wrong");

      console.log("Error creating tables:", err);
    }
  };

  // to download qr code of selected tables
  // const handleDownloadQRCode = (venueId) => {
  //   // Create a new JSZip instance to create a zip file
  //   const zip = new JSZip();

  //   // Create a folder named "QR_Codes" inside the zip file
  //   const folder = zip.folder("QR_Codes");

  //   // Iterate over the selected table IDs
  //   selectedTables.forEach((tableId) => {
  //     // Find the table object using the tableId by searching through all areas and their tables
  //     const table = areas
  //       .flatMap((area) => area.tables)
  //       .find((table) => table._id === tableId);

  //     // If the table exists, generate a QR code for it
  //     if (table) {
  //       // Construct the URL for the QR code with the venueId and tableId
  //       const qrCodeUrl = `${qrlink}${venueId}?table=${tableId}`;

  //       // Create a new canvas element to render the QR code
  //       const canvas = document.createElement("canvas");

  //       // Generate the QR code and render it on the canvas
  //       QRCode.toCanvas(canvas, qrCodeUrl, { width: 200 }, (error) => {
  //         if (error) {
  //           // Log an error if there's an issue generating the QR code
  //           console.error("Error generating QR code", error);
  //         } else {
  //           // Convert the canvas to a data URL, which represents the QR code image as a base64 string
  //           const dataUrl = canvas.toDataURL();

  //           // Remove the "data:image/png;base64," part of the data URL to get the base64 image data
  //           const imageData = dataUrl.split(",")[1];

  //           // Add the QR code image to the zip file in the folder "QR_Codes" with a filename using the table name
  //           folder.file(`${table.tableName}_QRCode.png`, imageData, {
  //             base64: true,
  //           });
  //         }
  //       });
  //     }
  //   });

  //   // Once all the QR codes are generated, create and download the zip file
  //   zip.generateAsync({ type: "blob" }).then((content) => {
  //     // Create a link element to trigger the download of the zip file
  //     const link = document.createElement("a");

  //     // Create a URL for the zip content (blob URL) and set it as the link's href attribute
  //     link.href = URL.createObjectURL(content);

  //     // Set the download attribute to specify the name of the downloaded file
  //     link.download = "QR_Codes.zip";

  //     // Trigger a click event on the link to start the download
  //     link.click();
  //   });
  // };

  // Function to generate a QR code with added text and white background
  // const generateQRCodeWithText = async (venueId, tableId, tableName) => {
  //   try {
  //     // Generate the QR code as a data URL
  //     const url = await QRCode.toDataURL(
  //       `${qrlink}${venueId}?table=${tableId}`,
  //       {
  //         color: {
  //           dark: "#8A2BE2", // Blue-Violet color for the QR code
  //           light: "#FFFFFF", // White background
  //         },
  //         width: 300, // Set the width of the QR code
  //         margin: 1, // Set margin around the QR code
  //       }
  //     );

  //     // Create a canvas to combine QR code and table name
  //     const canvas = document.createElement("canvas");
  //     const img = new Image();
  //     img.src = url;

  //     return new Promise((resolve, reject) => {
  //       img.onload = () => {
  //         // Set canvas size based on the image size, plus space for table name
  //         canvas.width = img.width;
  //         canvas.height = img.height + 40; // Extra space for table name below the QR code

  //         const ctx = canvas.getContext("2d");

  //         // Fill the canvas with a white background
  //         ctx.fillStyle = "#FFFFFF";
  //         ctx.fillRect(0, 0, canvas.width, canvas.height);

  //         // Draw the QR code onto the canvas
  //         ctx.drawImage(img, 0, 0);

  //         // Set font and draw the table name below the QR code
  //         ctx.font = "20px Arial";
  //         ctx.fillStyle = "#000000"; // Black text color
  //         ctx.fillText(`Table: ${tableName}`, 10, img.height + 30);

  //         // Resolve the promise with the base64 image data
  //         resolve(canvas.toDataURL());
  //       };

  //       img.onerror = (error) => reject(error); // Handle error if image fails to load
  //     });
  //   } catch (error) {
  //     console.error("Error generating QR code:", error);
  //     throw error;
  //   }
  // };
  const generateQRCodeWithText = async (venueId, tableId, tableName) => {
    try {
      // Generate the QR code as a data URL with text in the center
      const url = await QRCode.toDataURL(
        `${qrlink}${venueId}?table=${tableId}`,
        {
          color: {
            dark: "#8A2BE2", // Blue-Violet color for the QR code
            light: "#FFFFFF", // White background
          },
          width: 300, // Set the width of the QR code
          margin: 1, // Set margin around the QR code
        }
      );

      // Create a canvas to overlay text on the QR code
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = url;

      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Set canvas size based on the image size
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");

          // Draw the QR code onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set font and measure text width
          ctx.font = "22px Arial";
          const textWidth = ctx.measureText(tableName).width;
          const textX = (canvas.width - textWidth) / 2;
          const textY = canvas.height / 2 + 10; // Center vertically

          // Draw white background behind the text
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(textX - 10, textY - 30, textWidth + 20, 50);

          // Draw the table name centered in the QR code
          ctx.fillStyle = "#000000"; // Black text color
          ctx.fillText(`${tableName}`, textX, textY);

          // Resolve the promise with the base64 image data
          resolve(canvas.toDataURL());
        };

        img.onerror = (error) => reject(error); // Handle error if image fails to load
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  };

  // to downlaod qr code in zip
  const handleDownloadQRCode = async (venueId) => {
    // Create a new JSZip instance to create a zip file
    const zip = new JSZip();

    // Create a folder named "QR_Codes" inside the zip file
    const folder = zip.folder("QR_Codes");

    // Iterate over the selected table IDs and generate QR codes with table names
    const promises = selectedTables.map(async (tableId) => {
      // Find the table object using the tableId
      const table = areas
        .flatMap((area) => area.tables)
        .find((table) => table._id === tableId);

      if (table) {
        try {
          // Generate the QR code with table name and white background
          const imageData = await generateQRCodeWithText(
            venueId,
            tableId,
            table.tableName
          );

          // Add the generated QR code image to the zip file
          folder.file(
            `${table.tableName}_QRCode.png`,
            imageData.split(",")[1],
            { base64: true }
          );
        } catch (error) {
          console.error("Error generating QR code for table:", tableId, error);
        }
      }
    });

    // Wait for all QR codes to be generated
    await Promise.all(promises);

    // Once all QR codes are generated, create and download the zip file
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
        generateQRCodeWithText,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
