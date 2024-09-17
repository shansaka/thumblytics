from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from utills import *
from PIL import Image, UnidentifiedImageError
import io
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from logging_config import setup_logging
import logging

try:
    with open('./model/ytpa_model.pkl', 'rb') as model_file:
        model = joblib.load(model_file)
except FileNotFoundError:
    raise Exception("Model file not found. Please ensure the model file is present at the correct path.")
except Exception as e:
    raise Exception(f"Error loading model: {e}")

app = FastAPI()

# Set up logging
setup_logging()
logger = logging.getLogger(__name__)
logger.info("Application started")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/")
async def predict(
    file: UploadFile = File(...), 
    title: str = Form(...), 
    subscriber_count: int = Form(...), 
    video_duration: float = Form(...)
):
    try:
        contents = await file.read()
        
        logger.info("Processing image...")
        try:
            image = Image.open(io.BytesIO(contents))
            image_np = np.array(image)
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid image file format.")

        row_data = {
            'title': title,
            'subscriber_count': subscriber_count,
            'duration': video_duration
        }

        logger.info("Extracting features...")
        row_data = extract_features(row_data, image_np)
        df = pd.DataFrame([row_data])

        logger.info("Processing data...")
        views_expected_columns = model.feature_names_in_
        df = df[views_expected_columns]

        logger.info("Predicting rating...")
        rating = model.predict(df)
        rating = int(rating[0])

        row_data['rating'] = rating

        logger.info("Prediction successful")
        for key, value in row_data.items():
            if isinstance(value, np.generic):
                row_data[key] = value.item()

        return row_data

    except KeyError as e:
        logger.error(f"Missing required data in request: {e}")
        raise HTTPException(status_code=400, detail=f"Missing required data in request: {e}")
    except ValueError as e:
        logger.error(f"Data processing error: {e}")
        raise HTTPException(status_code=400, detail=f"Data processing error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)