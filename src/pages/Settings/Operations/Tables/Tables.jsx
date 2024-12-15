import { useContext } from "react";
import TableList from "../../../../component/TableList/TableList.jsx";
import "./Tables.css";
import { TableContext } from "../../../../context/TablesContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
const Tables = () => {
  const {
    isAreaSheetOpen,
    toggleAreaSideSheet,
    toggleAddTableSheet,
    areas,
    handleDownloadQRCode,
    selectedTables,
  } = useContext(TableContext);

  const { selectedVenue } = useContext(AuthContext);

  const downloadqrcode = () => {
    if (selectedTables.length !== 0) {
      handleDownloadQRCode(selectedVenue.venueId);
    }
  };
  return (
    <div className="mx-5 my-2 flex flex-col gap-6">
      <div className="search-add-table-div flex items-center justify-end gap-4">
        <input type="text" className="rounded-md px-2 py-1 border-2" placeholder="Search Area" />
        <div
          className={`download-qr-code-button-disable 
          border-2 px-2 py-1 rounded-md 
          ${selectedTables.length !== 0 ? "download-qr-code-button-enable" : ""}`}
          onClick={downloadqrcode}
        >
          <span>Download Qr Codes</span>
        </div>

        {areas.length !== 0 && (
          <div
            className="add-tables-button px-2 py-1 rounded-md bg-violet-500 text-white"
            onClick={toggleAddTableSheet}
          >
            <span>{selectedTables.length < 2 ? "+ Add New Tables" : "Delete Tables"}</span>
          </div>
        )}
      </div>

      <div className="add-area-div  flex gap-4 my-2">
        {/* <div className="filter-header flex gap-2">
          <input type="checkbox" />
          <span>All</span>
        </div> */}
        <span className="text-violet-500 font-medium cursor-pointer" onClick={toggleAreaSideSheet}>
          + Add Area
        </span>
      </div>

      <TableList />
    </div>
  );
};

export default Tables;
