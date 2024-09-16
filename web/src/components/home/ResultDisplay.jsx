import React, { useState } from "react";
import { Container, Row, Col, Image, Tabs, Tab, ProgressBar, Card, Button } from "react-bootstrap";

function ResultDisplay({ resultData, imagePreview }) {
  const emotions = {
    Angry: resultData.angry_emotion,
    Happy: resultData.happy_emotion,
    Disgust: resultData.disgust_emotion,
    Fear: resultData.fear_emotion,
    Sad: resultData.sad_emotion,
    Surprise: resultData.surprise_emotion,
    Neutral: resultData.neutral_emotion
  };

  const colors = {
    color_1: { r: resultData.color_1_r, g: resultData.color_1_g, b: resultData.color_1_b, name: resultData.dominant_color_1_name },
    color_2: { r: resultData.color_2_r, g: resultData.color_2_g, b: resultData.color_2_b, name: resultData.dominant_color_2_name },
    color_3: { r: resultData.color_3_r, g: resultData.color_3_g, b: resultData.color_3_b, name: resultData.dominant_color_3_name },
    color_4: { r: resultData.color_4_r, g: resultData.color_4_g, b: resultData.color_4_b, name: resultData.dominant_color_4_name },
    color_5: { r: resultData.color_5_r, g: resultData.color_5_g, b: resultData.color_5_b, name: resultData.dominant_color_5_name }
  };

  const metrics = {
    average_brightness: resultData.average_brightness * 100,
    contrast: resultData.contrast,
    saturation: resultData.saturation,
    hue: resultData.hue
  };

  const attributes = {
    is_text_present: resultData.is_text_present,
    total_word_count: resultData.total_word_count,
    main_text_size: resultData.main_text_size,
    title_length: resultData.title_length,
    num_persons: resultData.num_persons
  };

  const [activeTab, setActiveTab] = useState("faces");

  const getGrading = (rating) => {
    switch (rating) {
      case 4:
        return "Excellent";
      case 3:
        return "Outstanding";
      case 2:
        return "Good";
      case 1:
        return "Average";
      case 0:
        return "Poor";
      default:
        return "Poor";
    }
  };

  const getColor = (rating) => {
    switch (rating) {
      case 4:
        return "green";
      case 3:
        return "blue";
      case 2:
        return "orange";
      case 1:
        return "gray";
      case 0:
        return "red";
      default:
        return "red";
    }
  };

  // Function to reload the page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="rate_container">
      <div className="justify-content-center ">
        <h2>Rater Results</h2>
        <Image src={imagePreview} rounded className="thumbnail-preview" />
        <h3 className="mt-3">
          Rating:{" "}
          <span className="rating-text" style={{ color: getColor(resultData.rating) }}>
            {getGrading(resultData.rating)}
          </span>
        </h3>
      </div>

      <Row className="justify-content-center">
        <Tabs id="result-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="faces" title="Faces">
            <ResultTable data={emotions} />
          </Tab>
          <Tab eventKey="colors" title="Colors">
            <ColorDisplay colors={colors} />
          </Tab>
          <Tab eventKey="image_metrics" title="Image Metrics">
            <ImageMetrics metrics={metrics} />
          </Tab>
          <Tab eventKey="attributes" title="Attributes">
            <Attributes attributes={attributes} />
          </Tab>
        </Tabs>
      </Row>
      <hr></hr>
      <Row>
        <Button variant="secondary" onClick={handleReload}>
          Try another thumbnail
        </Button>
      </Row>
    </div>
  );
}

// Component to render the table of results
function ResultTable({ data }) {
  const getDotRepresentation = (percentage) => {
    const filledDots = Math.min(Math.round(percentage * 5), 5);
    const totalDots = 5;

    return (
      <span>
        {Array.from({ length: filledDots }, (_, i) => (
          <span key={`filled-${i}`} className="dot filled-dot">
            ●
          </span>
        ))}
        {Array.from({ length: totalDots - filledDots }, (_, i) => (
          <span key={`unfilled-${i}`} className="dot unfilled-dot">
            ●
          </span>
        ))}
      </span>
    );
  };

  return (
    <table className="table table-bordered result-table">
      <tbody>
        {Object.entries(data).map(([emotion, percentage]) => (
          <tr key={emotion}>
            <td>{emotion}</td>
            <td>{getDotRepresentation(percentage)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ColorDisplay({ colors }) {
  // Convert RGB values to CSS-compatible strings and HEX values
  const colorStyle1 = `rgb(${colors.color_1.r}, ${colors.color_1.g}, ${colors.color_1.b})`;
  const colorStyle2 = `rgb(${colors.color_2.r}, ${colors.color_2.g}, ${colors.color_2.b})`;
  const colorStyle3 = `rgb(${colors.color_3.r}, ${colors.color_3.g}, ${colors.color_3.b})`;
  const colorStyle4 = `rgb(${colors.color_4.r}, ${colors.color_4.g}, ${colors.color_4.b})`;
  const colorStyle5 = `rgb(${colors.color_5.r}, ${colors.color_5.g}, ${colors.color_5.b})`;

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "33%", textAlign: "center" }}>
        <div style={{ backgroundColor: colorStyle1, width: "100%", height: "150px" }}></div>
        <p>{colors.color_1.name}</p>
      </div>

      <div style={{ width: "33%", textAlign: "center" }}>
        <div style={{ backgroundColor: colorStyle2, width: "100%", height: "150px" }}></div>
        <p>{colors.color_2.name}</p>
      </div>

      <div style={{ width: "33%", textAlign: "center" }}>
        <div style={{ backgroundColor: colorStyle3, width: "100%", height: "150px" }}></div>
        <p>{colors.color_3.name}</p>
      </div>

      <div style={{ width: "33%", textAlign: "center" }}>
        <div style={{ backgroundColor: colorStyle4, width: "100%", height: "150px" }}></div>
        <p>{colors.color_4.name}</p>
      </div>

      <div style={{ width: "33%", textAlign: "center" }}>
        <div style={{ backgroundColor: colorStyle5, width: "100%", height: "150px" }}></div>
        <p>{colors.color_5.name}</p>
      </div>
    </div>
  );
}

function ImageMetrics({ metrics }) {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Average Brightness</Card.Title>
              <ProgressBar striped variant="success" now={metrics.average_brightness} max={100} label={`${metrics.average_brightness.toFixed(2)}%`} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Contrast</Card.Title>
              <ProgressBar striped variant="warning" now={metrics.contrast} max={100} label={`${metrics.contrast.toFixed(2)}%`} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Saturation</Card.Title>
              <ProgressBar striped variant="info" now={metrics.saturation} max={100} label={`${metrics.saturation.toFixed(2)}%`} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Hue</Card.Title>
              <ProgressBar striped variant="danger" now={metrics.hue} max={100} label={`${metrics.hue.toFixed(2)}%`} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function Attributes({ attributes }) {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Text Presence</Card.Title>
              <p className="composition_value">{attributes.is_text_present ? "Yes" : "No"}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Word Count</Card.Title>
              <p className="composition_value">{attributes.total_word_count}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Main Text Size</Card.Title>
              <p className="composition_value">{attributes.main_text_size}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Title length</Card.Title>
              <p className="composition_value">{attributes.title_length}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>No of Persons</Card.Title>
              <p className="composition_value">{attributes.num_persons}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ResultDisplay;
