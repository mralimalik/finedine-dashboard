import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { OrderContext } from "../../../context/OrderContext.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { formatDistanceToNow } from "date-fns";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import OrdersEditDisplay from "../../../component/OrdersEditDisplay/OrdersEditDisplay.jsx";
import ConfirmationDialogBox from "../../../component/ConfirmationDialog/ConfirmationDialog.jsx";
import PageBoxesList from "../../../component/PageBoxesList/PageBoxesList.jsx";
import { LiaSortUpSolid } from "react-icons/lia";
import { LiaSortDownSolid } from "react-icons/lia";
import OrderDetails from "./OrderDetails/OrderDetails.jsx";
import { statusEnum } from "../../../const/constants.js";
const AllOrders = () => {
  // to change tabs
  const [activeTab, setActiveTab] = useState("Live");
  const {
    getOrdersLive,
    allOrders,
    getOrdersClosed,
    setShowDialog,
    showDialog,
    handleDeleteConfirmationDialog,
    deleteOrderFromBackend,
    currentPage,
    limit,
    setLimit,
    setCurrentPage,
    sortOrder,
    sortBy,
  } = useContext(OrderContext);

  const { selectedVenue, setLoading } = useContext(AuthContext);

  // State to manage checkbox selection and to show items in table
  const [checkedItems, setCheckedItems] = useState({
    Status: true,
    Type: true,
    Table: true,
    UpdatedTime: true,
    SentTime: false,
    Totals: true,
  });

  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleOrderDetailsSheet = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  // to fetch order
  const handleFetchOrders = async () => {
    try {
      if (selectedVenue) {
        setLoading(true);
        if (activeTab === "Live") {
          await getOrdersLive(selectedVenue._id);
        } else if (activeTab === "Closed") {
          await getOrdersClosed(selectedVenue._id);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleActiveTab = async (tab) => {
    setActiveTab(tab);
    setLimit("10");
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFetchOrders();
  }, [selectedVenue, activeTab, currentPage, limit, sortOrder, sortBy]);

  useEffect(() => {
    if (allOrders?.length === 0) {
      setCurrentPage(1);
    }
  }, [allOrders]);

  return (
    <div>
      <h3 className="font-medium text-2xl px-5 pt-3 bg-white border-t">
        Orders
      </h3>

      <div className="flex space-x-5 px-5 pt-3 bg-white ">
        {["Live", "Closed"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${
              activeTab === tab
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500"
            }`}
            onClick={() => {
              handleActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mx-4 ">
        <div className="flex justify-end w-full">
          <OrdersEditDisplay
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
          />
        </div>
        {activeTab === "Live" && (
          <OrdersTable
            allOrders={allOrders}
            checkedItems={checkedItems}
            handleOrderDetailsSheet={handleOrderDetailsSheet}
          />
        )}
        {activeTab === "Closed" && (
          <OrdersTable
            allOrders={allOrders}
            checkedItems={checkedItems}
            handleOrderDetailsSheet={handleOrderDetailsSheet}
          />
        )}
        {showDialog && (
          <ConfirmationDialogBox
            onCancel={handleDeleteConfirmationDialog}
            onConfirm={() => {
              deleteOrderFromBackend(setLoading, handleFetchOrders);
            }}
          />
        )}
        <div>
          <PageBoxesList />
        </div>
      </div>
      {showOrderDetails && <OrderDetails onClose={handleOrderDetailsSheet} />}
    </div>
  );
};

export default AllOrders;

export const OrdersTable = ({
  allOrders,
  checkedItems,
  handleFetchOrders,
  handleOrderDetailsSheet,
}) => {
  const {
    setShowDialog,
    showDialog,
    handleDeleteConfirmationDialog,
    sortOrder,
    setSortBy,
    setSortOrder,
    sortBy,
    setSelectedOrder,
    calculateOrderTotal,
  } = useContext(OrderContext);

  // to show status values based on enums
  // const statusEnum = {
  //   WAITING: "Waiting",
  //   INKITCHEN: "In Kitchen",
  //   PREPAIRING: "Prepairing",
  //   READY: "Ready",
  //   SERVED: "Served",
  //   DELIVERY: "On Delivery",
  //   COMPLETED: "Completed",
  //   CANCELLED: "Cancelled",
  // };
  // to show order types values based on enums
  const orderType = {
    DINEIN: "Dine In",
    DELIVERY: "Delivery",
  };

  // // to calculate total order price
  // const calculateOrderTotal = (order) => {
  //   const { orderSummary, appliedCharges } = order;

  //   // Calculate subtotal from items and modifiers
  //   const subtotal = orderSummary.reduce((acc, item) => {
  //     const itemTotal = item.itemPrice * item.quantity;
  //     const modifierTotal =
  //       item.modifiers?.reduce(
  //         (modAcc, mod) => modAcc + mod.modifierPrice * mod.quantity,
  //         0
  //       ) || 0;
  //     return acc + itemTotal + modifierTotal;
  //   }, 0);

  //   // Apply discount
  //   const discount = appliedCharges.discount || 0;
  //   const discountedTotal = subtotal - discount;

  //   // Add additional charges (tax, service charge, delivery, etc.)
  //   const tax = appliedCharges.tax || 0;
  //   const serviceCharge = appliedCharges.serviceCharge || 0;
  //   const deliveryCharge = appliedCharges.delivery || 0;

  //   const total = discountedTotal + tax + serviceCharge + deliveryCharge;
  //   return total.toFixed(2); // Ensure result is a formatted string
  // };

  const handleSortByAndSortOrder = () => {
    if (sortOrder === "desc") {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    }
  };

  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full table-auto bg-purple-100">
        <thead>
          <tr>
            <th>
              <th className="px-2">
                <input type="checkbox" />
              </th>
              <th onClick={handleSortByAndSortOrder} className="cursor-pointer">
                <th className="p-2 text-left">ID</th>
                <th>
                  <LiaSortUpSolid
                    size={"13"}
                    color={`${sortOrder === "desc" ? "blueviolet" : "black"}`}
                    className="cursor-pointer"
                  />
                  <LiaSortDownSolid
                    size={"13"}
                    color={`${sortOrder === "asc" ? "blueviolet" : "black"}`}
                    className="cursor-pointer"
                  />
                </th>
              </th>
            </th>
            {checkedItems.Status && <th className="p-2 text-left">Status</th>}
            {checkedItems.Type && <th className="p-2 text-left">Type</th>}
            {checkedItems.Table && <th className="p-2 text-left">Table</th>}
            {checkedItems.UpdatedTime && (
              <th className="p-2 text-left">Update Time</th>
            )}
            {checkedItems.SentTime && (
              <th className="p-2 text-left">Sent Time</th>
            )}
            {checkedItems.Totals && <th className="p-2 text-left">Total</th>}
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allOrders?.length === 0 ? (
            <tr>
              <td
                colSpan={
                  checkedItems.Status ||
                  checkedItems.Type ||
                  checkedItems.Table ||
                  checkedItems.UpdatedTime ||
                  checkedItems.SentTime ||
                  checkedItems.Totals
                    ? 7
                    : 2
                }
                className="text-center py-8"
              >
                <span>No orders available</span>
              </td>
            </tr>
          ) : (
            allOrders?.map((order) => (
              <tr
                key={order._id}
                className="bg-white border-b cursor-pointer hover:bg-violet-200"
                onClick={() => {
                  setSelectedOrder(order);
                  handleOrderDetailsSheet();
                }}
              >
                <td>
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">{order.orderId}</td>
                </td>
                {checkedItems.Status && (
                  <td className="p-2">
                    <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                      {statusEnum[order.status] || order.status}
                    </span>
                  </td>
                )}

                {checkedItems.Type && (
                  <td className="p-2">
                    {order.orderType === orderType.DELIVERY ? (
                      <span className="text-blue-500">🚚</span>
                    ) : (
                      <span className="text-yellow-500">🍽️</span>
                    )}
                    {orderType[order.orderType] || order.orderType}
                  </td>
                )}
                {checkedItems.Table && (
                  <td className="p-2">{order.tableName || ""}</td>
                )}
                {checkedItems.UpdatedTime && (
                  <td className="p-2">
                    {formatDistanceToNow(new Date(order.updatedAt), {
                      addSuffix: true,
                    })}
                  </td>
                )}

                {checkedItems.SentTime && (
                  <td className="p-2">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                )}
                {checkedItems.Totals && (
                  <td className="p-2">${calculateOrderTotal(order)}</td>
                )}
                <td className="p-2 flex space-x-2">
                  {/* Replace icons with React Icons */}
                  <button className="text-purple-500">
                    <FaEye />
                  </button>
                  <button className="text-purple-500">
                    <FaEdit />
                  </button>
                  <button
                    className="text-purple-500"
                    onClick={() => {
                      handleDeleteConfirmationDialog(order._id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
