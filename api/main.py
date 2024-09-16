from fastapi import FastAPI, File, UploadFile, Form
from utills import *
from PIL import Image
import io
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware


# Load the pre-trained model from the files
with open('./model/ytpa_model.pkl', 'rb') as model_file:
    model = joblib.load(model_file)

app = FastAPI()

# Allow all origins to access the API
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
    contents = await file.read() 

    # Convert the file contents into an image
    image = Image.open(io.BytesIO(contents))
    image_np = np.array(image)
        
    row_data = {}
    row_data['title'] = title
    row_data['subscriber_count'] = subscriber_count
    row_data['duration'] = video_duration

    row_data = extract_features(row_data, image_np)

    # Convert the dictionary into a DataFrame
    df = pd.DataFrame([row_data])
    

    # Predict views_category using the pre-trained model
    views_expected_columns = model.feature_names_in_
    df = df[views_expected_columns]
    rating = model.predict(df)
    rating = int(rating[0])

    row_data['rating'] = rating

    for key, value in row_data.items():
        if isinstance(value, np.generic):
            row_data[key] = value.item()

    return row_data

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)