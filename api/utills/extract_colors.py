import cv2
import numpy as np
from skimage import measure
from sklearn.cluster import KMeans

import logging
logger = logging.getLogger(__name__)

# Dictionary of color names and their corresponding hex values
HEX_COLOR_NAMES = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgrey": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "grey": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgrey": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32",
}


# Function to extract the dominant colors from an image
def extract_dominant_colors(image, k=5):
    try:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pixels = image_rgb.reshape(-1, 3)
        kmeans = KMeans(n_clusters=k)
        kmeans.fit(pixels)
        dominant_colors = kmeans.cluster_centers_.astype(int)

        color_dict = {}
        for i, color in enumerate(dominant_colors):
            r, g, b = color
            color_dict[f'color_{i+1}_r'] = r
            color_dict[f'color_{i+1}_g'] = g
            color_dict[f'color_{i+1}_b'] = b

        return color_dict
    except Exception as e:
        logger.error(f"Error extracting dominant colors: {e}")
        color_dict = {}
        for i in range(k):
            color_dict[f'color_{i+1}_r'] = 0
            color_dict[f'color_{i+1}_g'] = 0
            color_dict[f'color_{i+1}_b'] = 0
        return color_dict

# Function to extract the average color of an image
def extract_brightness_contrast(image):
    try:
        grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(grayscale)
        brightness_percent = brightness / 255
        contrast = np.std(grayscale)
        max_possible_contrast_std = 127.5
        contrast_percent = (contrast / max_possible_contrast_std) * 100
        return brightness_percent, contrast_percent
    except Exception as e:
        logger.error(f"Error extracting brightness and contrast: {e}")
        return 0.0, 0.0

# Function to extract the saturation and hue of an image
def extract_saturation_and_hue(image):
    try:
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        saturation = np.mean(hsv_image[:, :, 1])
        hue = np.mean(hsv_image[:, :, 0])
        saturation_percent = (saturation / 255) * 100
        hue_percent = (hue / 179) * 100
        return saturation_percent, hue_percent
    except Exception as e:
        logger.error(f"Error extracting saturation and hue: {e}")
        return 0.0, 0.0

# Function to convert hex color to RGB
def hex_to_rgb(hex_color):
    try:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))
    except Exception as e:
        logger.error(f"Error converting hex to RGB: {e}")
        return (0, 0, 0)

# Function to find the closest color name to a RGB value
def closest_color_name(requested_rgb):
    try:
        min_distance = float('inf')
        closest_color = None
        color_indices = {name: idx for idx, name in enumerate(HEX_COLOR_NAMES)}
        
        for color_name, hex_value in HEX_COLOR_NAMES.items():
            color_rgb = hex_to_rgb(hex_value)
            rd = (color_rgb[0] - requested_rgb[0]) ** 2
            gd = (color_rgb[1] - requested_rgb[1]) ** 2
            bd = (color_rgb[2] - requested_rgb[2]) ** 2
            distance = (rd + gd + bd) ** 0.5

            if distance < min_distance:
                min_distance = distance
                closest_color = color_name

        closest_index = color_indices[closest_color]
        return closest_index, closest_color
    except Exception as e:
        logger.error(f"Error finding closest color name: {e}")
        return -1, "unknown"