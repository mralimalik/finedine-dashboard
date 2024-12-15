import { useState, useContext, useRef } from "react";
import { QRCode } from "react-qr-code";
import "./QrCode.css";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

function QrCode() {
  const { selectedVenue } = useContext(AuthContext);
  const { venueId } = useParams();

  // Create a ref for the QR code container
  const qrCodeRef = useRef();

  // const downloadQRCode = () => {
  //   const svgElement = qrCodeRef.current.querySelector("svg");
  //   const svgString = new XMLSerializer().serializeToString(svgElement);
  
  //   // Create an image element from the SVG
  //   const img = new Image();
  //   const svgDataUri = "data:image/svg+xml;base64," + window.btoa(svgString);
  
  //   img.onload = () => {
  //     // Create a canvas and draw the image
  //     const canvas = document.createElement("canvas");
  //     const context = canvas.getContext("2d");
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     context.drawImage(img, 0, 0);
  //     const dataUrl = canvas.toDataURL();
  
  //     // Download the image
  //     const a = document.createElement("a");
  //     a.href = dataUrl;
  //     a.download = `QRCode-${selectedVenue?.venueId}.png`;
  //     a.click();
  //   };
  
  //   img.src = svgDataUri;
  // };
  
  return (
    <>
      <div
        className={`generated-qr-code ${!selectedVenue ? "filter blur-sm opacity-60" : ""}`}
        ref={qrCodeRef}
      >
        <QRCode
          value={`https://qr-menu-7ie2.vercel.app/${selectedVenue?.venueId}`}
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          id="canvasqr"
        />
      </div>


    </>
  );
}

export default QrCode;
