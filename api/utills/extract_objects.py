from ultralytics import YOLO
import numpy as np
from fer import FER
import logging

logger = logging.getLogger(__name__)
model = YOLO("yolov8n.pt")  


# Function to analyze emotions in detected faces
def analyze_emotions(image, boxes):
    emotion_totals = { 'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0 }

    detector = FER(mtcnn=True)

    try:
        for box in boxes:
            if box.cls[0] == 0: 
                image_np = np.array(image)
                cropped_face = image_np[int(box.xyxy[0][1]):int(box.xyxy[0][3]), int(box.xyxy[0][0]):int(box.xyxy[0][2])]
                emotions = detector.detect_emotions(cropped_face)
                for emotion in emotions:
                    for key, value in emotion['emotions'].items():
                        emotion_totals[key] += value
    except Exception as e:
        logger.error(f"Error analyzing emotions: {e}")

    return emotion_totals

# Function to extract objects from an image
def extract_objects(image):
    result_dict = {}

    # List of important objects to track
    important_objects = [
        "person",          
        # "laptop",          
        # "smartphone",       
        # "book",            
        # "dog",            
        # "cat",            
        # "car",            
        # "truck"
    ]

    # Initialize the result dictionary with 0s for each important object
    for obj in important_objects:
        result_dict[f'num_{obj}s'] = 0

    # Initialize default values for emotions
    emotion_totals = { 'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0 }
    
    try:
        results = model([image])

        for result in results:
            boxes = result.boxes
            if boxes is not None and len(boxes) > 0:
                classes = result.boxes.cls.tolist()
                detected_objects = [model.names[int(cls)] for cls in classes]

                for obj in detected_objects:
                    if obj in important_objects:
                        result_dict[f'num_{obj}s'] += 1

                # Analyze emotions if faces are detected
                emotion_totals = analyze_emotions(image, boxes)

        for emotion, score in emotion_totals.items():
            result_dict[f'{emotion}_emotion'] = score

    except Exception as e:
        logger.error(f"Error extracting objects: {e}")
        
    for emotion, score in emotion_totals.items():
            result_dict[f'{emotion}_emotion'] = score

    return result_dict