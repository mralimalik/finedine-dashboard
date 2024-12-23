import React from "react";

const ConfirmationDialogBox = ({ 
  title = "Are you sure?", 
  message = "Do you really want to delete this order? It will be removed permanently.", 
  onConfirm, 
  onCancel, 
  confirmText = "Yes", 
  cancelText = "No" 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-auto " onClick={(e)=>e.stopPropagation()} draggable={false}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Icon and Title */}
        <div className="flex items-center">
          <span className="text-purple-500 text-2xl mr-2">⚠️</span>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mt-2">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialogBox;
