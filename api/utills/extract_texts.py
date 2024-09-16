import numpy as np
import easyocr
import cv2

reader = easyocr.Reader(['en']) 

# Function to extract text features from an image
def extract_texts(image):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    results = reader.readtext(gray)

    is_text_present = len(results) > 0
    total_word_count = 0
    main_text_size = 0

    # Extract text features
    for result in results:
        _, text, confidence = result
        total_word_count += len(text.split())
        
        bbox = result[0]
        text_height = bbox[2][1] - bbox[0][1]
        main_text_size = max(main_text_size, text_height)

    text_features = {
        'is_text_present': is_text_present,
        'total_word_count': total_word_count,
        'main_text_size': main_text_size
    }

    return text_features