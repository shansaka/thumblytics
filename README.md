# **Thumblytics**

## **Project Description**

**Thumblytics** is a machine learning-based YouTube Thumbnail Performance Analyser designed to help content creators predict how effective their YouTube thumbnails will be. By analyzing visual and metadata features, such as colors, text, objects, and facial emotions, Thumblytics provides content creators with actionable insights to optimize thumbnails and improve video engagement.

## **Features**
- **Dominant Color Analysis**: Identifies the most prominent colors in a thumbnail.
- **Text Analysis**: Extracts and analyzes text within the thumbnail to assess its impact on performance.
- **Object Detection**: Utilizes YOLOv8 to detect important objects in the thumbnail.
- **Emotion Detection**: Analyzes facial emotions in thumbnails using FER (Facial Emotion Recognition).
- **Performance Prediction**: Uses machine learning models like Random Forest, SVC, Logistic Regression, and Decision Tree to predict the engagement a video might receive based on the thumbnail.

## **Technologies Used**

### **Backend (Python API)**
- **FastAPI** for the backend framework
- **scikit-learn**, **TensorFlow** for machine learning
- **pandas**, **numpy** for data analysis and manipulation
- **easyocr**, **FER**, **Pillow** for text and emotion recognition in images
- **ultralytics** for YOLO object detection
- **uvicorn** for running the FastAPI server
- **python-multipart** for handling file uploads

### **Frontend (React.js)**
- **React** for building the UI
- **Bootstrap/React-Bootstrap** for styling
- **Axios** for making API requests
- **react-router-dom** for routing
- **sweetalert2** for alert popups

## **Installation Instructions**

### **Prerequisites**
- **Python** (version 3.x)
- **Node.js** (version 14.x or higher)

### **Backend (Python API)**
1. Clone the repository.
2. Navigate to the backend folder.
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python main.py
   ```

### **Frontend (React.js)**
1. Clone the repository.
2. Navigate to the frontend folder.
3. Install the required Node packages:
   ```bash
   npm install
   ```
4. Start the React app:
   ```bash
   npm start
   ```

## **Usage**
1. Upload your YouTube thumbnail through the frontend.
2. Enter the video title and subscriber count.
3. The backend will analyze the thumbnail and provide performance insights based on color, text, objects, and emotions.

## **Project Status**
This project is a part of an academic study and is not currently intended for production or public use.
