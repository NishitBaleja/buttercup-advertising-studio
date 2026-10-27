import urllib.request
import re
import os

url = "https://orionix.framer.website"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode("utf-8")

matches = set(re.findall(r"https://framerusercontent.com/images/[^\s\"'\''\?\)]+\.(?:png|jpg|jpeg)", html))
count = 0
for m in matches:
    try:
        response = urllib.request.urlopen(m)
        data = response.read()
        if len(data) > 300000: # larger than 300KB
            count += 1
            filename = f"large_img_{count}.png"
            with open(filename, "wb") as f:
                f.write(data)
            print(f"Saved {filename} ({len(data)} bytes) from {m}")
    except Exception as e:
        print(f"Failed {m}: {e}")
