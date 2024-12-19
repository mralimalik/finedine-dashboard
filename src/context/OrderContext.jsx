import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { baseUrl } from "../const/constants";
import { toast } from "react-toastify";
export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState("10");

  // set order settings
  const [orderSettings, setOrderSettings] = useState(null);

  const { selectedVenue } = useContext(AuthContext);
  // storing all orders
  const [allOrders, setAllOrders] = useState([]);
  // holds the id of selected order
  const [selectedOrderId, setSelectedOrderId] = useState("");
  // holds the data of selected order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // orders which are active or live
  // const [liveOrders, setLiveOrders] = useState([]);

  // // orders which are closed, completed or cancelled
  // const [closedOrders, setClosedOrders] = useState([]);

  // to show confirmation dialog
  const [showDialog, setShowDialog] = useState(false);

  // to handle deletion confirmation dialog
  const handleDeleteConfirmationDialog = (orderId) => {
    if (showDialog === false) {
      setShowDialog(true);
      setSelectedOrderId(orderId);
    } else {
      setShowDialog(false);
      setSelectedOrderId("");
    }
  };

  const deleteOrderFromList = (orderId) => {
    setAllOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  // handle order delete
  const deleteOrderFromBackend = async (setLoading, handleFetchOrders) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const url = `${baseUrl}/order/${selectedVenue._id}/${selectedOrderId}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        deleteOrderFromList(selectedOrderId);
        toast.success("Order Deleted Successfully");
        setShowDialog(false);
        console.log("all orders", allOrders.length);
      }
    } catch (error) {
      toast.error("Error while deleting order");

      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderSettings = async (selectedVenue) => {
    try {
      const url = `${baseUrl}/order/settings/${selectedVenue._id}`;
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

  const getOrdersLive = async (selectedVenue) => {
    try {
      const token = localStorage.getItem("Token");
      const url = `${baseUrl}/order/liveorders/${selectedVenue}`;

      const response = await axios.get(url, {
        params: {
          page: currentPage, // Current page
          limit: limit, // Items per page
          sortBy: sortBy, // Field to sort by
          sortOrder: sortOrder, // Sort order
          // status: "WAITING,INKITCHEN", // Optional status filter
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Function running of orders");

        setAllOrders(response.data?.data || []);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
    }
  };

  const getOrdersClosed = async (selectedVenue) => {
    try {
      const token = localStorage.getItem("Token");
      const url = `${baseUrl}/order/closedorders/${selectedVenue}`;
      const response = await axios.get(url, {
        params: {
          page: currentPage, // Current page
          limit: limit, // Items per page
          sortBy: sortBy, // Field to sort by
          sortOrder: sortOrder, // Sort order
          // status: "WAITING,INKITCHEN", // Optional status filter
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAllOrders(response.data?.data || []);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (selectedVenue) {
      getOrderSettings(selectedVenue);
    }
  }, [selectedVenue]);

  // calculate overall order price total
  const calculateOrderTotal = (order) => {
    const { orderSummary, appliedCharges } = order;

    if (!orderSummary || orderSummary.length === 0) return 0; // Return 0 if orderSummary is empty

    // Calculate subtotal from items and modifiers
    const subtotal = orderSummary.reduce((acc, item) => {
      const itemTotal = item.itemPrice * item.quantity; // Item price based on quantity
      const modifierTotal =
        item.modifiers?.reduce(
          (modAcc, mod) =>
            modAcc + mod.modifierPrice * mod.quantity * item.quantity, // Modifier price considering item quantity
          0
        ) || 0;

      return acc + itemTotal + modifierTotal; // Add item and modifier totals
    }, 0);

    // Apply discount
    const discount = appliedCharges?.discount || 0;
    const discountedTotal = subtotal - discount;

    // Add additional charges (tax, service charge, delivery, etc.)
    const tax = appliedCharges?.tax || 0;
    const serviceCharge = appliedCharges?.serviceCharge || 0;
    const deliveryCharge = appliedCharges?.delivery || 0;

    const total = discountedTotal + tax + serviceCharge + deliveryCharge;
    return total.toFixed(2); // Ensure result is a formatted string
  };

  // calucalte overall items  price
  const calculateItemsTotal = (orderSummary) => {
    if (!orderSummary || orderSummary.length === 0) return 0;

    return orderSummary.reduce((total, item) => {
      const itemBaseTotal = item.quantity * item.itemPrice; // Base price for the item
      const modifiersTotal = item.modifiers.reduce(
        (modifierSum, modifier) =>
          modifierSum +
          modifier.quantity * modifier.modifierPrice * item.quantity, // Adjusted to account for item quantity
        0
      );
      return total + itemBaseTotal + modifiersTotal; // Add item and modifiers total
    }, 0);
  };

  // calculate single item price
  const calculateOrderItemTotalPrice = (item) => {
    if (!item) return 0;

    const itemBaseTotal = item.quantity * item.itemPrice; // Base price for the item
    const modifiersTotal =
      item.modifiers?.reduce(
        (modifierSum, modifier) =>
          modifierSum +
          modifier.quantity * modifier.modifierPrice * item.quantity, // Account for item quantity
        0
      ) || 0;

    return itemBaseTotal + modifiersTotal; // Total for this item
  };

  // update the order status
  const updateOrderStatus = async (status, orderId, setLoading) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const url = `${baseUrl}/order/status/${orderId}`;
      const orderBody = {
        status: status,
      };

      // Make the API request and return the response
      const response = await axios.put(url, orderBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAllOrders((prevOrders) => {
          // Check if the status is CANCELLED or COMPLETED
          if (status === "CANCELLED" || status === "COMPLETED") {
            // Remove the order from the list if the status is CANCELLED or COMPLETED
            return prevOrders.filter((order) => order._id !== orderId);
          }

          // Otherwise, update the status for the order
          return prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: status } : order
          );
        });
        toast.success("Order Status updated");
      }

      // Return the full response so it can be used elsewhere
      return response.data;
    } catch (e) {
      toast.error("Something went wrong while updating order");
      console.log("Error updaitng order", e);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // update the order status
  const updateOrderSummary = async (itemId, orderId, setLoading) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const url = `${baseUrl}/order/ordersummary/${orderId}`;
      const orderBody = {
        itemId: itemId,
      };

      // Make the API request and return the response
      const response = await axios.put(url, orderBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Order Item Removed");
        const updatedOrder = response.data.order;

        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }

      // Return the full response so it can be used elsewhere
      return response.data.order;
    } catch (e) {
      toast.error("Something went wrong while removing order item");
      console.log("Error updaitng order summary item", e);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orderSettings,
        setOrderSettings,
        getOrdersLive,
        allOrders,
        getOrdersClosed,
        setAllOrders,
        showDialog,
        setShowDialog,
        handleDeleteConfirmationDialog,
        deleteOrderFromBackend,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        sortOrder,
        setSortOrder,
        setSortBy,
        sortBy,
        selectedOrder,
        setSelectedOrder,
        calculateOrderTotal,
        calculateItemsTotal,
        calculateOrderItemTotalPrice,
        updateOrderStatus,
        updateOrderSummary,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
