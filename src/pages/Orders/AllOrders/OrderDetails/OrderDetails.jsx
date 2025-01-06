import React, { useContext, useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { ImSpoonKnife } from "react-icons/im";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BiSolidTrashAlt } from "react-icons/bi";
import { OrderContext } from "../../../../context/OrderContext.jsx";
import { paymentEnums, orderTypeEnum } from "../../../../const/constants.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { statusEnum } from "../../../../const/constants.js";
import { apiurl } from "../../../../../../frontend-menu/src/constants/apiconst.js";
import axios from "axios";
import { toast } from "react-toastify";
const OrderDetails = ({ onClose, onDelete }) => {
  // to show more items or not
  const [showMore, setShowMore] = useState(false);
  // to set selected order details
  const [orderDetails, setOrderDetails] = useState(null);

  const {
    selectedOrder,
    calculateOrderTotal,
    calculateItemsTotal,
    calculateOrderItemTotalPrice,
    handleDeleteConfirmationDialog,
    updateOrderStatus,
    allOrders,
    updateOrderSummary,
    setAllOrders,
  } = useContext(OrderContext);
  const { setLoading } = useContext(AuthContext);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (selectedOrder) {
      setOrderDetails(selectedOrder);
    }
  }, [selectedOrder]);
  // format the time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle undefined or null dates
    const date = new Date(dateString);

    // Format: DD.MM.YYYY - HH:mm
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    };

    return new Intl.DateTimeFormat("en-GB", options)
      .format(date)
      .replace(",", " -"); // Replace the comma with a dash for formatting
  };

  // generate pdf of order details
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Order Details - #${orderDetails?.orderId}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Order Type: ${orderTypeEnum[orderDetails?.orderType]}`, 10, 20);
    doc.text(
      `Payment Method: ${paymentEnums[orderDetails?.paymentMethod]}`,
      10,
      30
    );
    doc.text(`Sent Time: ${formatDate(orderDetails?.createdAt)}`, 10, 40);
    doc.text(`Update Time: ${formatDate(orderDetails?.updatedAt)}`, 10, 50);

    // Order Items Table
    if (orderDetails?.orderSummary?.length > 0) {
      const tableData = orderDetails.orderSummary.map((item) => [
        item.quantity,
        item.itemName,
        item.itemSizeName || "N/A",
        `$${calculateOrderItemTotalPrice(item)}`,
      ]);

      doc.autoTable({
        head: [["Quantity", "Item Name", "Size", "Price"]],
        body: tableData,
        startY: 60,
      });
    }

    // Summary Section
    const yOffset = 80 + (orderDetails?.orderSummary?.length || 0) * 10;
    doc.text(
      `Items Total: $${calculateItemsTotal(orderDetails?.orderSummary)}`,
      10,
      yOffset
    );
    doc.text(
      `Discount: $${orderDetails?.appliedCharges?.discount || 0}`,
      10,
      yOffset + 10
    );
    doc.text(
      `Service Charges: $${orderDetails?.appliedCharges?.serviceCharge || 0}`,
      10,
      yOffset + 20
    );
    doc.text(
      `Taxes: $${orderDetails?.appliedCharges?.tax || 0}`,
      10,
      yOffset + 30
    );
    doc.text(`Total: $${calculateOrderTotal(orderDetails)}`, 10, yOffset + 40);

    // Download the PDF
    doc.save(`Order-${orderDetails?.orderId}.pdf`);
  };

  // handle order close
  const handleOrderClose = async () => {
    let orderStatus;
    if (orderDetails.status === "WAITING") {
      orderStatus = "INKITCHEN";
    } else if (orderDetails.status === "INKITCHEN") {
      orderStatus = "COMPLETED";
    }
    if (orderStatus) {
      const updatedStatus = await updateOrderStatus(
        orderStatus,
        orderDetails._id,
        setLoading
      );
      onClose();
    }
  };

  // handle cancelling the order
  const handleOrderCancel = async () => {
    await updateOrderStatus("CANCELLED", orderDetails._id, setLoading);
    onClose();
  };

  const handleOrderItemDelete = async (itemId) => {
    const updatedOrder = await updateOrderSummary(
      itemId,
      orderDetails._id,
      setLoading
    );
    setOrderDetails(updatedOrder);
  };

  const getButtonText = () => {
    if (orderDetails?.orderType === "DINEIN") {
      if (orderDetails?.status === "WAITING") {
        return "Accept Order";
      } else if (orderDetails?.status === "INKITCHEN") {
        return "Close Order";
      }
    } else if (orderDetails?.orderType === "DELIVERY") {
      if (orderDetails?.status === "WAITING") {
        return "Accept Order";
      } else if (orderDetails?.status === "INKITCHEN") {
        return "On Delivery";
      } else if (orderDetails?.status === "DELIVERY") {
        return "Close Order";
      }
    }
    return ""; // default case, if no condition matches
  };

  // refund order when tap on refund
  const refundOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${apiurl}order/refund/${selectedOrder?.paymentId}`,
        {}
      );
      if (response.status === 200) {
        setAllOrders((prevOrders) => {
          // Remove the order from the list if the status is CANCELLED or COMPLETED
          return prevOrders.filter((order) => order._id !== selectedOrder?._id);
        });

        toast.success("Payment refunded");
        onClose();
      }
    } catch (e) {
      console.log("error refund", e);

      toast.error("Error refunding payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-40">
      <div className="bg-gray-200 w-[500px] h-full flex flex-col">
        <div className="bg-white flex gap-2 items-center px-3 py-4">
          <RiCloseLargeFill
            size={"15"}
            onClick={onClose}
            className="cursor-pointer"
          />
          <h3 className="font-medium text-lg">
            Order - #{orderDetails?.orderId}
          </h3>
          <span className="bg-green-200 text-green-800  px-2 rounded">
            {statusEnum[orderDetails?.status] || orderDetails?.status}
          </span>
        </div>
        <div className="overflow-y-scroll w-full h-full">
          <div className=" bg-neutral-900 w-full text-white px-3 py-2 flex flex-col justify-between gap-2">
            <div className="flex gap-3 items-center">
              <ImSpoonKnife />
              <h2 className="text-xl">
                {orderTypeEnum[orderDetails?.orderType]}
              </h2>
              <GoDotFill />
              {orderDetails?.orderType === "DINEIN" && (
                <h2 className="text-xl">{orderDetails?.tableName}</h2>
              )}
            </div>
            <h2 className="text-lg">
              Sent Time: {formatDate(orderDetails?.createdAt)}
            </h2>
            <h2 className="text-lg">
              Update Time: {formatDate(orderDetails?.updatedAt)}
            </h2>
            <h2 className="text-lg">
              Payment - {paymentEnums[orderDetails?.paymentMethod]}
            </h2>
          </div>

          {orderDetails?.orderSummary && (
            <div className="bg-white rounded-md my-3 mx-3 py-1 shadow-md">
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer"
                onClick={handleShowMore}
              >
                <h3>Order Summary</h3>
                <div
                  className={`transition-transform duration-300 ${
                    showMore ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {!showMore && <IoIosArrowDown />}
                  {showMore && <IoIosArrowUp />}
                </div>
              </div>

              {showMore && (
                <div className=" border-t px-3 py-2">
                  {orderDetails?.orderSummary.map((item) => (
                    <div key={item._id} className="my-2">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <h3 className="text-sm">{item.quantity}</h3>
                          <h3 className="text-sm font-medium">
                            {item.itemName} {item?.itemSizeName}
                          </h3>
                        </div>
                        <div className="flex gap-2 items-center">
                          <h2>{`US$${calculateOrderItemTotalPrice(item)}`}</h2>
                          {orderDetails?.status !== "COMPLETED" &&
                            orderDetails?.status !== "CANCELLED" && (
                              <BiSolidTrashAlt
                                className="cursor-pointer hover:text-violet-600"
                                onClick={() => handleOrderItemDelete(item._id)}
                              />
                            )}
                        </div>
                      </div>
                      {item?.modifiers.length !== 0 && (
                        <div className="mx-5 ">
                          <h3 className="text-sm">Modifier:</h3>
                          {item?.modifiers.map((modifier, modifierIndex) => (
                            <div key={modifierIndex}>
                              <h3 className="text-sm flex items-center">
                                <GoDotFill size={10} /> {modifier.quantity}x{" "}
                                {modifier.modifierName} US$
                                {modifier.modifierPrice}
                              </h3>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {orderDetails?.orderSummary.length !== 0 && (
                    <div className="flex justify-between items-center border-y px-2 my-3 py-2">
                      <h2>{"Item's Total"}</h2>
                      <h2>{`US$${calculateItemsTotal(
                        orderDetails?.orderSummary
                      )}`}</h2>
                    </div>
                  )}

                  {orderDetails?.orderSummary.length !== 0 && (
                    <div className="flex flex-col gap-1">
                      {orderDetails?.appliedCharges?.discount !== 0 && (
                        <div className="flex justify-between items-center px-2 ">
                          <h2>{"Discount"}</h2>
                          <h2>{`US$${orderDetails?.appliedCharges?.discount}`}</h2>
                        </div>
                      )}

                      {orderDetails?.appliedCharges?.serviceCharge !== 0 && (
                        <div className="flex justify-between items-center px-2 ">
                          <h2>{"Service Charges"}</h2>
                          <h2>{`US$${orderDetails?.appliedCharges?.serviceCharge}`}</h2>
                        </div>
                      )}
                      {orderDetails?.appliedCharges?.tax !== 0 && (
                        <div className="flex justify-between items-center px-2 ">
                          <h2>{"Taxes"}</h2>
                          <h2>{`US$${orderDetails?.appliedCharges?.tax}`}</h2>
                        </div>
                      )}

                      <div className="flex justify-between items-center  px-2 ">
                        <h2 className="text-lg font-medium">{"TOTAL"}</h2>
                        <h2 className="text-lg font-medium">{`US$${calculateOrderTotal(
                          orderDetails
                        )}`}</h2>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-white py-2 px-3">
          <div className="flex">
            <CustomButton
              buttonText={"Delete Order"}
              onClick={() => {
                handleDeleteConfirmationDialog(selectedOrder?._id);
                onClose();
              }}
            />
            {/* {orderDetails?.orderType === "DINEIN" &&
              orderDetails?.status !== "COMPLETED" &&
              orderDetails?.status !== "CANCELLED" && (
                <CustomButton buttonText={"Change Table"} />
              )} */}

            <CustomButton buttonText={"Print"} onClick={generatePDF} />
            {selectedOrder?.paymentMethod !== "CASH" &&
              selectedOrder?.status !== "REFUNDED" &&
              selectedOrder?.status !== "COMPLETED" &&
              selectedOrder?.status !== "CANCELLED" && (
                <CustomButton buttonText={"Refund"} onClick={refundOrder} />
              )}
          </div>
          <div className="flex">
            {orderDetails?.status !== "COMPLETED" &&
              orderDetails?.status !== "CANCELLED" &&
              selectedOrder?.status !== "REFUNDED" && (
                <CustomButton
                  buttonText={"Cancel Order"}
                  onClick={handleOrderCancel}
                />
              )}

            {orderDetails?.status !== "COMPLETED" &&
              orderDetails?.status !== "CANCELLED" &&
              selectedOrder?.status !== "REFUNDED" && (
                <CustomButton
                  onClick={handleOrderClose}
                  buttonText={getButtonText()}
                  className="bg-violet-600 text-white font-medium hover:text-white"
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

export const CustomButton = ({ buttonText, className, onClick }) => {
  return (
    <div
      className={`${className} w-full border  py-2 px-3 rounded-lg border-violet-200 font-normal mx-1 my-1 flex justify-center items-center cursor-pointer hover:border-violet-700 hover:text-violet-700`}
      onClick={onClick}
    >
      <button>{buttonText}</button>
    </div>
  );
};
