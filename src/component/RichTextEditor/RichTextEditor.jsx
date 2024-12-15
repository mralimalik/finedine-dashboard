import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import Quill
import "react-quill/dist/quill.snow.css"; // Import the Quill styles
import "./RichTextEditor.css";
const RichTextEditor = ({description,setDescription}) => {

  const handleChange = (value) => {
    setDescription(value);
    console.log(value);
  };

  return (
    <div className="rich-text-editor">
      <label className="text-field-label my-2">Description</label>
      <ReactQuill
      // className="h-20"
        value={description}
        onChange={handleChange}
        modules={RichTextEditor.modules}
        formats={RichTextEditor.formats}
        placeholder="Write something..."
      />
    </div>
  );
};

// Define toolbar options for the rich text editor
RichTextEditor.modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic"],
  ],
};

// Define allowed formats
RichTextEditor.formats = [
  "font",
  "list",
  "align",
  "bold",
  "italic",
  "underline",
];

export default RichTextEditor;
