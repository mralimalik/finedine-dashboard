import React from "react";
import { format } from "date-fns";
import MobileFrame from "../../assets/frame.png";
import "./Dashboard.css";
import QrCode from "../../component/QrCode/QrCode.jsx";
import ScanMe from "../../assets/scanme.png";
import Phone from "../../assets/phone.png";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import "./ResponsiveDashboard.css";
import { qrlink } from "../../const/constants.js";
const Dashboard = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, dd MMMM HH:mm");
  const { userData, selectedVenue } = useContext(AuthContext);

  const previewLink = selectedVenue
    ? `${qrlink}${selectedVenue?.venueId}`
    : "#";
  return (
    <div className="main-dashboard flex gap-3">
   <div>
   <div className="welcome-div">
        <p className="date-text">{formattedDate}</p>
        <p className="current-user-text">
  {Object.keys(userData).length === 0 ? `${userData.email},` : ""}Welcome
</p>
      </div>
      <div className="flex gap-4 responsive-div">
        <div className="dashboard-qr-container">
          <div className="qr-text-left">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl">
              {selectedVenue
                ? "Your digital menu is ready!"
                : "To Continue Create Venue"}
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
      </div>
      {selectedVenue && <PagePreview venueId={selectedVenue.venueId} />}

    </div>
  );
};

export default Dashboard;

export const PagePreview = ({ venueId }) => {
  return (
    <div className="w-[240px]  relative rounded-lg">
      <div className="w-full h-full scale-[0.458] origin-top-left  absolute z-50 top-[20px] left-[10px] rounded-lg  iframe-main-div">
        <iframe
          className="w-[450px] h-[820px] rounded-lg  iframe-div"
          src={`https://qr-menu-frontend-beryl.vercel.app/${venueId}`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allowFullScreen={false}
        />
      </div>
      <div className="w-[850px] h-[700px]  absolute z-40 -top-[280px] -left-[150px]  flex justify-start items-start  scale-[0.6] origin-bottom-left mobile-frame-div">
        <img src={MobileFrame} className="h-full w-full object-cover" />
      </div>
    </div>
  );
};
