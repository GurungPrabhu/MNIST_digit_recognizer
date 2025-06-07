import numpy as np
from skimage.morphology import skeletonize
from PIL import Image


def crop_to_content(img_array, threshold=0):
    rows = np.any(img_array > threshold, axis=1)
    cols = np.any(img_array > threshold, axis=0)

    if not rows.any() or not cols.any():
        return img_array

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    # Crop the image to bounding box
    cropped = img_array[rmin : rmax + 1, cmin : cmax + 1]
    return cropped


def pad_to_square(img_array, pad_value=0):
    # Add a single padding layer of 0 in all directions first
    img_array = np.pad(img_array, ((1, 1), (1, 1)), constant_values=pad_value)

    h, w = img_array.shape
    if h == w:
        return img_array  # already square

    if h > w:
        diff = h - w
        pad_left = diff // 2
        pad_right = diff - pad_left
        padded = np.pad(
            img_array, ((0, 0), (pad_left, pad_right)), constant_values=pad_value
        )
    else:
        diff = w - h
        pad_top = diff // 2
        pad_bottom = diff - pad_top
        padded = np.pad(
            img_array, ((pad_top, pad_bottom), (0, 0)), constant_values=pad_value
        )
    return padded


def resize_to_8x8(img_array):
    img = Image.fromarray((img_array / 16 * 255).astype(np.uint8))
    img_resized = img.resize((8, 8), resample=Image.Resampling.NEAREST)
    result = np.array(img_resized)
    result = (result / 255 * 16).round().astype(np.uint8)
    return result


def thin_by_skeletonization(img_array):
    # Normalize to binary (0 or 1)
    binary = (img_array > 0).astype(np.uint8)

    # Apply skeletonization
    skeleton = skeletonize(binary)

    # Optional: map back to intensity (e.g. 16)
    return (skeleton * 16).astype(int)
