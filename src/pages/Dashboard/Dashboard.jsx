import React from "react";
import { format } from "date-fns";
import "./Dashboard.css";
import QrCode from "../../component/QrCode/QrCode.jsx";
import ScanMe from "../../assets/scanme.png";
import Phone from "../../assets/phone.png";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
const Dashboard = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, dd MMMM HH:mm");
  const { userData, selectedVenue } = useContext(AuthContext);

  const previewLink = selectedVenue ? `https://qr-menu-7ie2.vercel.app/${selectedVenue?.venueId}` : "#";
  return (
    <div className="main-dashboard">
      <div className="welcome-div">
        <p className="date-text">{formattedDate}</p>
        <p className="current-user-text">{userData.email},Welcome</p>
      </div>

      <div className="dashboard-qr-container">
        <div className="qr-text-left">
          <span className="text-2xl">🎉</span>
          <h2 className="text-2xl">
            {selectedVenue ? "Your digital menu is ready!" : "To Continue Create Venue"}
          </h2>

          <h4>
            {selectedVenue
              ? "Scan the QR code or use the link to view your brand new menu."
              : "Get your QR code by creating new venue"}
          </h4>
          {/* <button
            className="preview-button"
            onClick={() => `https://qr-menu-7ie2.vercel.app/${selectedVenue?.venueId} `}
          >
            Preview
          </button> */}
          <a
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`preview-button`}
            onClick={(e) => {
              if (!selectedVenue) {
                e.preventDefault(); // Prevent navigation if no venue is selected
                alert("Please create a venue first.");
              }
            }}
          >
            Preview
          </a>
        </div>

        <div className="phone-qr-position-div">
          <div className="scan-me-img">
            <img src={ScanMe} alt="" className="scanme-image" />
          </div>

          <div className="qr-code-div">
            <QrCode />
          </div>

          <div className="phome-img-div">
            <img src={Phone} alt="" className="phone-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
