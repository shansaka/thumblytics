import React, { useState } from "react";
import { Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import ResultDisplay from "./ResultDisplay";
import config from "../../config";

const apiUrl = config.apiUrl;

function ThumbnailUploader() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState({ value: "", error: "" });
  const [subscriberCount, setSubscriberCount] = useState({ value: "", error: "" });
  const [duration, setDuration] = useState({ value: "", error: "" });
  const [subscriberUnit, setSubscriberUnit] = useState("1000");
  const [durationUnit, setDurationUnit] = useState("60");
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
      const uploadedFile = e.dataTransfer.files[0];
      handleFileValidation(uploadedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      handleFileValidation(uploadedFile);
    }
  };

  const handleFileValidation = (uploadedFile) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(uploadedFile.type)) {
      setErrorMessage("Please upload a valid image file (PNG or JPG).");
      setFile(null);
      setImagePreview(null);
    } else {
      setErrorMessage("");
      setFile(uploadedFile);
      setImagePreview(URL.createObjectURL(uploadedFile));
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
    } else if (title.value.length < 30) {
      titleError = "Video title must be at least 30 characters, please change the title to a longer one";
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
      setLoading(true);

      // Subscriber count multiplier
      const subscriberMultiplier = subscriberUnit === "1" ? 1 : subscriberUnit === "1000" ? 1000 : 1000000;
      const finalSubscriberCount = parseInt(subscriberCount.value) * subscriberMultiplier;

      // Video duration multiplier (convert hours to minutes if selected)
      const durationMultiplier = durationUnit === "60" ? 1 : 60;
      const finalDuration = parseFloat(duration.value) * durationMultiplier;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.value);
      formData.append("subscriber_count", finalSubscriberCount);
      formData.append("video_duration", finalDuration);

      try {
        const response = await fetch(apiUrl + "/predict", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error("Internal Server Error! Please contact support.");
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error:", error);
        alert(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {results === null ? (
        <div className="rate_container">
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
                  <Row>
                    <Col xs={8}>
                      <Form.Control
                        type="text"
                        placeholder="Enter your subscriber count"
                        value={subscriberCount.value}
                        onChange={(e) => setSubscriberCount({ value: e.target.value, error: "" })}
                        isInvalid={!!subscriberCount.error}
                      />
                      <Form.Control.Feedback type="invalid">{subscriberCount.error}</Form.Control.Feedback>
                    </Col>
                    <Col xs={4}>
                      <Form.Select value={subscriberUnit} onChange={(e) => setSubscriberUnit(e.target.value)}>
                        <option value="1000">Thousands</option>
                        <option value="1000000">Millions</option>
                        <option value="1">Exact</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>
                    Video Duration <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Row>
                    <Col xs={8}>
                      <Form.Control
                        type="text"
                        placeholder="Enter your video duration"
                        value={duration.value}
                        onChange={(e) => setDuration({ value: e.target.value, error: "" })}
                        isInvalid={!!duration.error}
                      />
                      <Form.Control.Feedback type="invalid">{duration.error}</Form.Control.Feedback>
                    </Col>
                    <Col xs={4}>
                      <Form.Select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}>
                        <option value="60">Minutes</option>
                        <option value="3600">Hours</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>

                <Button variant="primary" type="submit" className="rate-button" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
                    </>
                  ) : (
                    "Rate Thumbnail"
                  )}
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
