import numpy as np
import base64
import re
import io
from PIL import Image
import joblib

from app.utils.image_processing import (
    crop_to_content,
    pad_to_square,
    resize_to_8x8,
)

# Load model (GridSearchCV)
model = joblib.load("./app/model/mlp_tuned.joblib")


def decode_base64_image(base64_string):
    base64_data = re.sub("^data:image/.+;base64,", "", base64_string)
    image_bytes = base64.b64decode(base64_data)
    return Image.open(io.BytesIO(image_bytes))


def preprocess_image(image):
    """
    Preprocess the image by resizing, converting to grayscale, and normalizing.
    """
    image = decode_base64_image(image)
    image = image.resize((32, 32)).convert("L")
    img_array = np.array(image).astype("float32") / 255.0 * 16
    img_array = img_array.round().astype(int)
    img_array = crop_to_content(img_array)
    img_array = pad_to_square(img_array, pad_value=0)
    img_array = resize_to_8x8(img_array)
    return img_array.reshape(1, -1)


def predict_from_base64(base64_string):
    """
    Decodes a base64 image, preprocesses it, and predicts the digit using the trained model.
    """
    try:
        img_array = preprocess_image(base64_string)
        probabilities = model.predict_proba(img_array)
        predicted_digit = np.argmax(probabilities)
        predicted_probability = float(probabilities[0][predicted_digit])
        return {
            "predicted_digit": int(predicted_digit),
            "confidence": predicted_probability,
        }

    except Exception as e:
        return {"error": str(e)}
