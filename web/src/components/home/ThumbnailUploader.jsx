import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import ResultDisplay from "./ResultDisplay";

const apiUrl = "http://0.0.0.0:8000";

function ThumbnailUploader() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [title, setTitle] = useState({ value: "", error: "" });
  const [subscriberCount, setSubscriberCount] = useState({ value: "", error: "" });
  const [duration, setDuration] = useState({ value: "", error: "" });
  const [results, setResults] = useState(null);

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
      setImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const validateForm = () => {
    let titleError = "";
    let subscriberCountError = "";
    let durationError = "";

    if (!title.value) {
      titleError = "Video title cannot be empty";
    }

    if (!subscriberCount.value) {
      subscriberCountError = "Subscriber count cannot be empty";
    } else if (isNaN(subscriberCount.value)) {
      subscriberCountError = "Subscriber count must be a number";
    }
    if (!duration.value) {
      durationError = "Duration cannot be empty";
    } else if (isNaN(duration.value)) {
      durationError = "Duration must be a number";
    }

    if (titleError || subscriberCountError || durationError) {
      setSubscriberCount({ ...subscriberCount, error: subscriberCountError });
      setDuration({ ...duration, error: durationError });
      setTitle({ ...title, error: titleError });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.value);
      formData.append("subscriber_count", parseInt(subscriberCount.value));
      formData.append("video_duration", parseFloat(duration.value));

      console.log(title, subscriberCount, duration);

      try {
        const response = await fetch(apiUrl + "/predict", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error("Failed to upload data");
        }

        const data = await response.json();
        console.log(data);
        setResults(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      {results === null ? (
        <div className="rate_container">
          <div className={`upload-box ${dragActive ? "drag-active" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {imagePreview ? (
              <img src={imagePreview} alt="Thumbnail Preview" className="thumbnail-preview" />
            ) : (
              <>
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
                <div className="upload-content text-center">
                  <p>Click below or drag & drop a thumbnail to start</p>
                  <Button variant="primary" onClick={handleButtonClick}>
                    <i className="bi bi-upload"></i> Upload
                  </Button>
                </div>
              </>
            )}
          </div>
          {imagePreview && (
            <div className="frm_rate">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Video Title <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder="Enter your video title" value={title.value} onChange={(e) => setTitle({ value: e.target.value, error: "" })} isInvalid={!!title.error} />
                  <Form.Control.Feedback type="invalid">{title.error}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Channel Subscribers <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your subscriber count"
                    value={subscriberCount.value}
                    onChange={(e) => setSubscriberCount({ value: e.target.value, error: "" })}
                    isInvalid={!!subscriberCount.error}
                  />
                  <Form.Control.Feedback type="invalid">{subscriberCount.error}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Video Duration <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your video duration"
                    value={duration.value}
                    onChange={(e) => setDuration({ value: e.target.value, error: "" })}
                    isInvalid={!!duration.error}
                  />
                  <Form.Control.Feedback type="invalid">{duration.error}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="rate-button">
                  Rate Thumbnail
                </Button>
              </Form>
            </div>
          )}
        </div>
      ) : (
        <ResultDisplay imagePreview={imagePreview} resultData={results} />
      )}
    </>
  );
}

export default ThumbnailUploader;
