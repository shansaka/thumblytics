from .download_image import *
from .extract_colors import *
from .extract_objects import *
from .extract_texts import *


import logging
logger = logging.getLogger(__name__)


# Function to process each thumbnail URL
def process_thumbnail(row):
    logger.info(f"Processing thumbnail for video")
    error = {}
    thumbnail_url = row['thumbnail_url']
    video_id = row['video_id'] 
    try:
        row_data = row.to_dict()

        image = download_image(thumbnail_url)

        row_data = extract_features(row_data, image)

        return row_data, error
    except Exception as e:
        error = {'video_id': video_id, 'thumbnail_url': thumbnail_url, 'error': str(e)}
        print(f"Error processing thumbnail for video {video_id}: {e}")
        logger.error(f"Error processing thumbnail for video {video_id}: {e}")
        return None, error

def extract_features(row_data, image):

    logger.info("Extracting domintated colors...")
    colors = extract_dominant_colors(image)
    for key, value in colors.items():
        row_data[key] = value
    
    for i in range(1, 6):
        dominant_color_rgb = (row_data[f'color_{i}_r'], row_data[f'color_{i}_g'], row_data[f'color_{i}_b'])
        color_index, color_name = closest_color_name(dominant_color_rgb)
        row_data[f'dominant_color_{i}'] = color_index
        row_data[f'dominant_color_{i}_name'] = color_name

    logger.info("Extracting text features...")
    text_features = extract_texts(image)
    row_data.update(text_features)

    logger.info("Extracting object features...")
    objects = extract_objects(image)
    for key, value in objects.items():
        row_data[key] = value
    
    row_data['title_length'] = len(row_data['title'])

    logger.info("Extracting image quality features...")
    brightness, contrast = extract_brightness_contrast(image)
    row_data['average_brightness'] = brightness
    row_data['contrast'] = contrast

    logger.info("Extracting image color features...")
    saturation, hue = extract_saturation_and_hue(image)
    row_data['saturation'] = saturation
    row_data['hue'] = hue

    return row_data