import React, { useState, useEffect } from "react";
import { useContext, useRef } from "react";
import { OrderContext } from "../../context/OrderContext.jsx";
import { IoIosArrowDown } from "react-icons/io";

const PageBoxesList = ({}) => {
  const limitMenuRef = useRef(null);

  const {
    totalPages,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    allOrders,
  } = useContext(OrderContext);

  const [showLimitMenu, setShowLimitMenu] = useState(false);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageLimitMenu = ["2", "20", "50", "100"];

  const handlePageLimitClick = (limit) => {
    setCurrentPage(1);
 
    setLimit(limit);
    setShowLimitMenu(false);
  };
  // handle when clicking outside the menu
  const handleOutsideClick = (event) => {
    if (limitMenuRef.current && !limitMenuRef.current.contains(event.target)) {
      setShowLimitMenu(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (allOrders.length === 0) return;

  return (
    <div>
      {getPageNumbers()?.map((page) => (
        <button
          className={`${
            page === currentPage ? "text-violet-600" : "black"
          } px-3 py-2 mx-1 rounded-md border ${
            page === currentPage ? "border-violet-800" : "black"
          } cursor-pointer`}
          key={page}
          onClick={() => {
            setCurrentPage(page);
          }}
          style={{
            backgroundColor: "white",
          }}
        >
          {page}
        </button>
      ))}
      <div className="relative" ref={limitMenuRef}>
        <div
          className="px-3 py-2 bg-white text-black inline-block rounded-lg my-2 cursor-pointer hover:text-violet-600 "
          onClick={() => {
            setShowLimitMenu(!showLimitMenu);
          }}
        >
          <div className="flex items-center gap-2">
            <h3>{limit} / Page </h3>
            {<IoIosArrowDown />}
          </div>
        </div>
        {showLimitMenu && (
          <div className="bg-white pl-3 pr-4 py-2 inline-block rounded-lg absolute left-1 top-14">
            {pageLimitMenu.map((page, index) => (
              <div
                key={index}
                className=" my-1"
                onClick={() => {
                  handlePageLimitClick(page);
                }}
              >
                <h3
                  className={`${
                    page === limit
                      ? "bg-violet-600 bg-opacity-25 rounded-lg px-1 cursor-pointer "
                      : ""
                  }hover:text-violet-700`}
                >
                  {page} / Page
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBoxesList;
