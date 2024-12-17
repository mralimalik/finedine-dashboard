import React, { useState } from "react";
const AllOrders = () => {
  const [activeTab, setActiveTab] = useState("Live");

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
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <OrdersTable />
    </div>
  );
};

export default AllOrders;

export const OrdersTable = () => {
  const orders = [
    {
      id: 1005,
      dailyNo: 2,
      status: "Waiting",
      type: "Delivery",
      source: "Mobile",
      table: "",
      updateTime: "2 days ago",
      total: "$25.20",
    },
    {
      id: 1004,
      dailyNo: 1,
      status: "Waiting",
      type: "Dine-In",
      source: "Mobile",
      table: "Table 1",
      updateTime: "2 days ago",
      total: "$25.20",
    },
  ];

  return (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full table-auto bg-purple-100">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Daily No</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Source</th>
            <th className="p-2 text-left">Table</th>
            <th className="p-2 text-left">Update Time</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="bg-white border-b">
              <th>
                <input type="checkbox" />
              </th>

              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.dailyNo}</td>
              <td className="p-2">
                <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                  {order.status}
                </span>
              </td>
              <td className="p-2">
                {order.type === "Delivery" ? (
                  <span className="text-blue-500">🚚</span>
                ) : (
                  <span className="text-yellow-500">🍽️</span>
                )}
                {order.type}
              </td>
              <td className="p-2">{order.source}</td>
              <td className="p-2">{order.table}</td>
              <td className="p-2">{order.updateTime}</td>
              <td className="p-2">{order.total}</td>
              <td className="p-2 flex space-x-2">
                <button className="text-purple-500">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-purple-500">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-purple-500">
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
