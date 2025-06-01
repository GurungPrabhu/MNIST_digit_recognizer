import numpy as np
import base64
import re
import io
from PIL import Image
import joblib  # or just `import joblib`
from torchvision import transforms

# Load model (GridSearchCV)
model = joblib.load("./app/model/mlp_tuned.joblib")

# Use torchvision just for consistency (optional)
transform = transforms.Compose(
    [
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((28, 28)),
    ]
)


def decode_base64_image(base64_string):
    base64_data = re.sub("^data:image/.+;base64,", "", base64_string)
    image_bytes = base64.b64decode(base64_data)
    return Image.open(io.BytesIO(image_bytes))


def predict_from_base64(base64_string):
    try:
        image = decode_base64_image(base64_string)
        image = transform(image)

        # Convert to numpy array and reshape
        img_array = np.array(image).astype("float32") / 255.0
        img_array = img_array.reshape(1, -1)  # Flatten to [1, 784]

        prediction = model.predict(img_array)
        return {"predicted_digit": int(prediction[0])}

    except Exception as e:
        return {"error": str(e)}
