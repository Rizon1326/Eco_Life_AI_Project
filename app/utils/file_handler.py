# app/utils/file_handler.py
import os
import shutil
from tempfile import NamedTemporaryFile

def save_temp_image(file):
    temp_dir = "temp/"
    os.makedirs(temp_dir, exist_ok=True)

    temp_file = NamedTemporaryFile(delete=False, dir=temp_dir, suffix=".png")
    with open(temp_file.name, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return temp_file.name
