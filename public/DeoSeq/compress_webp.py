import os
from PIL import Image

# Parameters
target_size = 80 * 1024  
min_quality = 95
step = 2
output_dir = "pillow"

os.makedirs(output_dir, exist_ok=True)

for file in os.listdir("."):
    if file.lower().endswith(".png"):
        img = Image.open(file).convert("RGB")
        output_path = os.path.join(output_dir, os.path.splitext(file)[0] + ".webp")

        for quality in range(95, min_quality - 1, -step):
            img.save(output_path, "WEBP", quality=quality, method=6)
            if os.path.getsize(output_path) <= target_size:
                break

        final_size_kb = os.path.getsize(output_path) // 1024
        print(f"✔ {file} → {output_path} ({final_size_kb} KB)")
