import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";

function ThumbnailUploader() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className={`upload-box ${dragActive ? "drag-active" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
      <div className="upload-content text-center">
        <p>Click below or drag & drop a thumbnail to start</p>
        <Button variant="primary" onClick={handleButtonClick}>
          <i className="bi bi-upload"></i> Upload
        </Button>
      </div>
    </div>
  );
}

export default ThumbnailUploader;
