import React from "react";
import { DatePicker } from "antd";
import { useState } from "react";
import moment from "moment";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import { baseUrl } from "../../const/constants.js";
import { useEffect } from "react";
const Reports = () => {
  const [dates, setDates] = useState([]);
  const [report, setReport] = useState(null);

  const { setLoading, selectedVenue } = useContext(AuthContext);

  const getVenueReport = async () => {
    try {
      if (!dates || dates.length < 2) return;
      setLoading(true);
      console.log(dates);

      const token = localStorage.getItem("Token");

      const response = await axios.get(
        `${baseUrl}/report/${selectedVenue._id}?startDate=${dates[0]}&endDate=${dates[1]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setReport(response.data);
      } else {
        setReport(null);
      }
    } catch (error) {
      setReport(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedVenue) {
      getVenueReport();
    }
  }, [dates, selectedVenue]);

  return (
    <div>
      <div className="w-full bg-white px-3 py-4 ">
        <h1 className="text-xl font-medium">Reports</h1>
      </div>
      <div className="p-4">
        <div className="flex justify-end">
          <RangeDatePicker setDates={setDates} dates={dates} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <ReuseReportCard
            label={"Revenue"}
            data={`USD ${report?.revenue || 0}`}
          />
          <ReuseReportCard
            label={"Orders"}
            data={`${report?.totalOrders || 0}`}
          />
          <ReuseReportCard
            label={"Average Order Size"}
            data={`USD ${report?.avgOrderSize || 0.0}`}
          />
          <ReuseReportCard
            label={"Best Day"}
            data={`${report?.bestDay || "N/A"}`}
          />
        </div>
        <div className="flex flex-wrap gap-4 p-4">
          <ReportPieChart
            itemShares={report?.sectionShares || []}
            title={"Revenue Share by Sections"}
          />
          <ReportPieChart
            itemShares={report?.itemShares || []}
            title={"Revenue Share by Items"}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;

const ReuseReportCard = ({ label, data }) => {
  return (
    <div className="bg-white  flex flex-col gap-2 py-4 rounded-lg mt-2">
      <h2 className="px-3 text-sm text-gray-500 ">{label}</h2>
      <div className="w-full h-[1px] bg-gray-500"></div>
      <h4 className="px-3 text-xl font-medium">{data}</h4>
    </div>
  );
};

const RangeDatePicker = ({ setDates, dates }) => {
  const { RangePicker } = DatePicker;

  return (
    <div style={{ margin: 20 }}>
      <RangePicker
        value={dates}
        onChange={(values) => {
          setDates(
            values.map((item) => {
              return item;
            })
          );
        }}
      />
    </div>
  );
};

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportPieChart = ({ title, itemShares }) => {
  const colors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(169, 169, 169, 0.7)",
  ];

  const chartData =
    itemShares.length > 0
      ? itemShares.map((share) => ({
          label: share.itemName || share.sectionName,
          value: parseFloat(share.revenueShare),
        }))
      : [{ label: "No Data", value: 100 }];
  // Prepare chart data
  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        data: chartData.map((item) => item.value),
        backgroundColor: chartData.map(
          (_, index) => colors[index % colors.length]
        ),
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
  const options = {
    maintainaspectratio: false,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}`;
          },
        },
      },

      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex-1 min-w-[300px]">
      <h2 className="text-gray-600 text-sm mb-2">{title}</h2>
      <div className="min-h-[400px] max-h-[600px] flex justify-center items-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

// const ReportPieChart = ({ itemShares }) => {
//   const sectionData = [{ type: "Salads", value: 100 }];

//   const itemData =  itemShares.length > 0
//       ? itemShares.map((item) => ({
//           type: item.itemName,
//           value: parseFloat(item.revenueShare),
//         }))
//       : [{ type: "No Data", value: 100 }];
//   const config = (data) => ({
//     appendPadding: 10,
//     data,
//     angleField: "value",
//     colorField: "type",
//     radius: 1,
//     label: {
//       type: "outer",
//       content: "{name}",
//     },
//     interactions: [
//       {
//         type: "element-active",
//       },
//     ],
//     statistic: {
//       title: {
//         formatter: () => "100%",
//       },
//     },
//   });

//   return (
//     <div className="flex flex-wrap gap-4 p-4">
//       <div className="bg-white rounded-lg p-4 shadow-md flex-1 min-w-[300px]">
//         <h2 className="text-gray-600 text-sm mb-2">
//           Revenue Share by Sections
//         </h2>
//         <Pie {...config(sectionData)} />
//       </div>
//       <div className="bg-white rounded-lg p-4 shadow-md flex-1 min-w-[300px]">
//         <h2 className="text-gray-600 text-sm mb-2">Revenue Share by Items</h2>
//         <Pie {...config(itemData)} />
//       </div>
//     </div>
//   );
// };
