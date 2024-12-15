import React, { useState } from "react";
import "./OrderSettings.css";
import SwitchButton from "../../../component/SwitchButton/SwitchButton.jsx";
import ReuseTextField from "../../../component/ReuseTextField/ReuseTextField.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import axios from "axios";
import { useEffect } from "react";

const OrderSettings = () => {
  const { selectedVenue } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("dineIn");
  const [orderSettings, setOrderSettings] = useState(null);

  const getOrderSettings = async () => {
    try {
      const url = `http://localhost:3000/order/settings/${selectedVenue._id}`;
      const response = await axios.get(url);

      if (response.status === 200) {
        setOrderSettings(response.data?.data || {});
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order settings:", error);
    } finally {
    }
  };

  useEffect(() => {
    getOrderSettings();
  }, [selectedVenue]);

  return (
    <div>
      <div className="bg-white px-6 pt-4 border-t ">
        <h3 className="text-xl font-medium">Order Settings</h3>

        <div className="font-medium mt-6">
          <button
            className={`tab ${
              activeTab === "dineIn" ? "active-tab text-violet-600" : ""
            }`}
            onClick={() => setActiveTab("dineIn")}
          >
            <h4 className="text-base "> Dine In</h4>
          </button>
          <button
            className={`tab ${
              activeTab === "delivery" ? "active-tab text-violet-600" : ""
            }`}
            onClick={() => setActiveTab("delivery")}
          >
            <h4 className="text-base">Delivery & Pick up</h4>
          </button>
        </div>
      </div>
      {activeTab === "dineIn" && (
        <DineInOrderSettings
          dinInsettingsData={orderSettings?.settings?.dineIn}
          setOrderSettings={setOrderSettings}
        />
      )}
      {activeTab === "delivery" && (
        <DeliveryOrderSettings
          deliverysettingsData={orderSettings?.settings?.delivery}
          setOrderSettings={setOrderSettings}
        />
      )}
    </div>
  );
};

export default OrderSettings;

const DineInOrderSettings = ({ dinInsettingsData, setOrderSettings }) => {
  const { selectedVenue } = useContext(AuthContext);

  const handleToggle = async (type, value) => {
    try {
      const token = localStorage.getItem("Token");
      // Prepare update data
      const updateData = {
        [type]: value,
      };

      // Send update request to backend
      const url = `http://localhost:3000/order/settings/${selectedVenue._id}`;
      const response = await axios.put(
        url,
        { type: "dineIn", updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);

      setOrderSettings(response.data.data);
    } catch (error) {
      console.error("Error updating dine-in settings:", error);
    }
  };

  return (
    <div className="w-2/5 bg-white m-3 p-4 rounded-md flex flex-col gap-5">
      <div className="flex justify-between items-center ">
        <h3>Enable Ordering</h3>
        <SwitchButton
          isActive={dinInsettingsData?.orderEnabled}
          onToggle={() =>
            handleToggle("orderEnabled", !dinInsettingsData?.orderEnabled)
          }
        />
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
      <div className="flex justify-between items-center ">
        <h3>Enable Payment</h3>
        <SwitchButton
          isActive={dinInsettingsData?.paymentEnabled}
          onToggle={() =>
            handleToggle("paymentEnabled", !dinInsettingsData?.paymentEnabled)
          }
        />
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>

      <div className="flex justify-between items-center ">
        <h3>Accept Tip %</h3>
        <SwitchButton
          isActive={dinInsettingsData?.tipEnabled}
          onToggle={() =>
            handleToggle("tipEnabled", !dinInsettingsData?.tipEnabled)
          }
        />
      </div>
      <ReuseTextField placeholder={"%5"} className={"w-32"} />
      <div className="flex justify-end items-center">
        <button className=" create-menu-button w-fit !px-8">Save</button>
      </div>
    </div>
  );
};

const DeliveryOrderSettings = ({ deliverysettingsData, setOrderSettings }) => {
  const { selectedVenue } = useContext(AuthContext);

  const handleToggle = async (type, value) => {
    try {
      const token = localStorage.getItem("Token");
      // Prepare update data
      const updateData = {
        [type]: value,
      };

      // Send update request to backend
      const url = `http://localhost:3000/order/settings/${selectedVenue._id}`;
      const response = await axios.put(
        url,
        { type: "delivery", updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);

      setOrderSettings(response.data.data);
    } catch (error) {
      console.error("Error updating dine-in settings:", error);
    }
  };

  return (
    <div className="w-2/5 bg-white m-3 p-4 rounded-md flex flex-col gap-5">
      <div className="flex justify-between items-center ">
        <h3>Enable Ordering</h3>
        <SwitchButton
          isActive={deliverysettingsData?.orderEnabled}
          onToggle={() =>
            handleToggle("orderEnabled", !deliverysettingsData?.orderEnabled)
          }
        />
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
      <div className="flex justify-between items-center ">
        <h3>Enable Payment</h3>
        <SwitchButton
          isActive={deliverysettingsData?.paymentEnabled}
          onToggle={() =>
            handleToggle(
              "paymentEnabled",
              !deliverysettingsData?.paymentEnabled
            )
          }
        />
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>

      <div className="flex justify-between items-center ">
        <h3>Accept Tip %</h3>
        <SwitchButton
          isActive={deliverysettingsData?.tipEnabled}
          onToggle={() =>
            handleToggle("tipEnabled", !deliverysettingsData?.tipEnabled)
          }
        />
      </div>
      <ReuseTextField placeholder={"%5"} className={"w-32"} />
      <div className="flex justify-end items-center">
        <button className=" create-menu-button w-fit !px-8">Save</button>
      </div>
    </div>
  );
};
