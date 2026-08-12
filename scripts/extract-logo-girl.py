from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Image.open(ROOT / "public" / "logo-full.png").convert("RGBA")
w, h = src.size
pixels = src.load()

out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
opx = out.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        maxc = max(r, g, b)
        minc = min(r, g, b)
        sat = 0.0 if maxc == 0 else (maxc - minc) / maxc
        if brightness >= 205 and sat < 0.28:
            strength = min(255, int((brightness - 190) * 5))
            opx[x, y] = (255, 255, 255, max(strength, 190))
        elif brightness >= 175 and sat < 0.22:
            opx[x, y] = (255, 255, 255, 100)

# Text band starts ~y=600 — hard cut before it so ONLY the girl remains
face_top = 10
face_bottom = 575
face_left = int(w * 0.10)
face_right = int(w * 0.95)

mask = Image.new("L", (w, h), 0)
mp = mask.load()
for y in range(face_top, face_bottom):
    for x in range(face_left, face_right):
        if opx[x, y][3] > 40:
            mp[x, y] = 255

bbox = mask.getbbox()
print("face bbox", bbox)
if not bbox:
    raise SystemExit("No face found")

pad = 40
x0 = max(0, bbox[0] - pad)
y0 = max(0, bbox[1] - pad)
x1 = min(w, bbox[2] + pad)
y1 = min(face_bottom, bbox[3] + pad)
girl = out.crop((x0, y0, x1, y1))

side = max(girl.size)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(girl, ((side - girl.size[0]) // 2, (side - girl.size[1]) // 2), girl)
square.save(ROOT / "public" / "logo-girl-white.png")

# Rose girl (transparent) — this is what should "come out" clearly
rose = Image.new("RGBA", square.size, (0, 0, 0, 0))
sp, rp = square.load(), rose.load()
for y in range(side):
    for x in range(side):
        _, _, _, a = sp[x, y]
        if a:
            rp[x, y] = (180, 45, 90, a)
rose.save(ROOT / "public" / "logo-girl.png")
print("saved logo-girl.png", square.size)

# Circular soft badge with ONLY the girl silhouette
badge_size = 512
badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(badge)
draw.ellipse((4, 4, badge_size - 5, badge_size - 5), fill=(255, 240, 245, 255))
draw.ellipse((4, 4, badge_size - 5, badge_size - 5), outline=(244, 165, 184, 255), width=5)

pad_pct = 0.16
inner = int(badge_size * (1 - 2 * pad_pct))
girl_r = rose.resize((inner, inner), Image.Resampling.LANCZOS)
pos = (badge_size - inner) // 2
badge.paste(girl_r, (pos, pos), girl_r)
badge.save(ROOT / "public" / "logo-mark.png")
badge.save(ROOT / "app" / "icon.png")
print("saved logo-mark.png + favicon")
print("DONE")
