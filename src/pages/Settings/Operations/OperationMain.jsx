import React, { useState, useContext } from "react";
import Tables from "./Tables/Tables.jsx";
import AddAreaSideSheet from "../../../component/AddAreaSideSheet/AddAreaSideSheet.jsx";
import AddTableSheet from "../../../component/AddTableSideSheet/AddTableSheet.jsx";
import UpdateTableSheet from "../../../component/UpdateTableSideSheet/UpdateTableSideSheet.jsx";
// import Staff from './Staff/Staff.jsx';
// import ExtraCharges from './ExtraCharges/ExtraCharges.jsx';
// import ServiceOptions from './ServiceOptions/ServiceOptions.jsx';
// import DeviceManagement from './DeviceManagement/DeviceManagement.jsx';
import { AuthContext } from "../../../context/AuthContext.jsx";
import { TableContext } from "../../../context/TablesContext.jsx";
import ExtraCharges from "./ExtraCharges/ExtraCharges.jsx";
const OperationMain = () => {
  const [activeTab, setActiveTab] = useState("Tables");
  const { selectedVenue } = useContext(AuthContext);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Tables":
        return <Tables />;
      // case "Staff":
      //   return;
      case "Extra Charges":
        return <ExtraCharges/>;
      // case "ServiceOptions":
      //   return;

      default:
        return null;
    }
  };

  return (
    <div className="operations-main ">
      <div className="px-5 py-5 operation-tab-div bg-white border-t">
        <h3 className="font-medium text-xl">Operations</h3>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-5 px-5 pt-3 bg-white ">
        {["Tables", "Extra Charges"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${
              activeTab === tab ? "text-purple-500 border-b-2 border-purple-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {selectedVenue && <div className="tab-content p-5">{renderTabContent()}</div>}

      <AddAreaSideSheet />
      <AddTableSheet />
      <UpdateTableSheet />

    </div>
  );
};

export default OperationMain;
