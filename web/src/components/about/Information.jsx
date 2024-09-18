import React from "react";

function Information() {
  return (
    <section>
      <h1>About</h1>
      <div style={{ textAlign: "left" }}>
        <br></br>
        <p>
          <b>Thumblyitcs - YouTube Thumbnail Performance Analyser</b> is a machine learning-based tool designed to help YouTube content creators predict the performance of their video thumbnails. By
          analyzing features like colors, facial expressions, objects, and text, the system provides insights into how effective a thumbnail might be in terms of attracting views, likes, and comments.
          <br></br>
          <br></br>
          The project uses advanced techniques like object detection, face analysis, color analysis, and text extraction to break down the elements of a thumbnail. It then correlates these features
          with historical video performance data, such as views and engagement rates, to help creators optimize their thumbnails for better results. This data-driven approach enables content creators
          to enhance their content and attract more viewers.
        </p>
      </div>
    </section>
  );
}

export default Information;
