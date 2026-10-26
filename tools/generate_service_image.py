import sys
import json
import base64
import urllib.request
from PIL import Image
import io

def generate(api_key, prompt, output_avif_path):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key={api_key}"
    payload = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "outputOptions": {"mimeType": "image/jpeg"}
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    print(f"Calling Imagen 3 with prompt: {prompt[:80]}...")
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode("utf-8"))
    
    b64_img = res["predictions"][0]["bytesBase64Encoded"]
    img_data = base64.b64decode(b64_img)
    img = Image.open(io.BytesIO(img_data))
    
    # Save as AVIF with high quality
    img.save(output_avif_path, "AVIF", quality=95)
    print(f"Successfully generated and saved to {output_avif_path} ({img.size})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 tools/generate_service_image.py <API_KEY>")
        sys.exit(1)
    
    key = sys.argv[1].strip()
    prompt = (
        "High fashion luxury editorial studio photography of a chic modern female model standing "
        "elegantly in a studio. The studio background wall is deep dark red crimson with soft dramatic "
        "spotlighting. On the crimson wall behind the model, the words 'Brand Strategy' are written in bold, "
        "clean, elegant minimalist white typography. Haute couture styling, ultra clean, cinematic lighting, "
        "editorial magazine quality, 8k resolution, photorealistic."
    )
    out_path = "images/695d1b641a5751a34029d353_Dramatic-Side-Profile-5-2.avif"
    generate(key, prompt, out_path)
