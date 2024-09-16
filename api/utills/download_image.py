import requests
from PIL import Image
from io import BytesIO
import numpy as np
import cv2

# Function to download image from URL
def download_image(url):
    print("Downloading image from URL: ", url)
    response = requests.get(url)
    img = Image.open(BytesIO(response.content)).convert('RGB')
    img_np = np.array(img)
    img_cv2 = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    return img_cv2