import os
import sys
from PIL import Image
from rembg import remove

def remove_background(input_path, output_path):
    print(f"Processing: {input_path} -> {output_path}")
    try:
        if not os.path.exists(input_path):
            print(f"Error: Source file {input_path} does not exist.")
            return False
            
        input_image = Image.open(input_path)
        # remove background using rembg
        output_image = remove(input_image)
        output_image.save(output_path, "PNG")
        print(f"Success: Saved transparent image to {output_path}")
        return True
    except Exception as e:
        print(f"Exception processing {input_path}: {e}")
        return False

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    images_dir = os.path.join(base_dir, "public", "images")
    
    layers = ["layer-bg.png", "layer-mid.png", "layer-fg.png"]
    
    success_count = 0
    for layer in layers:
        file_path = os.path.join(images_dir, layer)
        # We will overwrite the existing image with the background-removed version
        if remove_background(file_path, file_path):
            success_count += 1
            
    print(f"Completed processing. Successful: {success_count}/{len(layers)}")

if __name__ == "__main__":
    main()
