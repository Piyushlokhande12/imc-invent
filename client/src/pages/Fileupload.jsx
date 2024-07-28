import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("File", file);

    try {
      const response = await fetch(
        "https://imc-hack.onrender.com/api/v1/materials/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("File uploaded and data processed successfully!");
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div
        className={`w-[40] p-10 border-2 border-dashed flex justify-center items-center ${
          dragActive ? "border-black" : "border-gray-300"
        } text-center`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <p className="mb-4">Drag and drop a file here or click to upload</p>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleChange}
        />
        {file && <p>File: {file.name}</p>}
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-full flex items-center space-x-2"
        onClick={() => document.getElementById("file-input").click()}
      >
        <i className="fas fa-plus"></i>
        <span>Upload File</span>
      </button>
    </div>
  );
};

export default FileUpload;
