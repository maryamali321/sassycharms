from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Image.open(ROOT / "public" / "logo-full.png").convert("RGBA")
w, h = src.size

# Photographic crop around the girl's face (NOT pixel extraction)
# Face sits roughly upper-center; avoid the text band (~y 600+)
# Tuned from density scan: face ~ y 40–560, x centered
crop_box = (
    int(w * 0.12),  # left
    int(h * 0.04),  # top
    int(w * 0.88),  # right
    int(h * 0.56),  # bottom — stops before "Sassy Charms" text
)
face = src.crop(crop_box)

# Make square by center-padding the shorter side
fw, fh = face.size
side = max(fw, fh)
square = Image.new("RGBA", (side, side), (252, 228, 236, 255))  # soft pink fill
square.paste(face, ((side - fw) // 2, (side - fh) // 2))

# Resize to clean badge
badge_size = 512
square = square.resize((badge_size, badge_size), Image.Resampling.LANCZOS)

# Circular mask
mask = Image.new("L", (badge_size, badge_size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, badge_size - 1, badge_size - 1), fill=255)

badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
badge.paste(square, (0, 0))
badge.putalpha(mask)

# Soft pink ring
ring = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
rd = ImageDraw.Draw(ring)
rd.ellipse((3, 3, badge_size - 4, badge_size - 4), outline=(244, 165, 184, 255), width=8)
badge = Image.alpha_composite(badge, ring)

out = ROOT / "public" / "logo-icon.png"
badge.save(out)
badge.save(ROOT / "public" / "logo-mark.png")
badge.save(ROOT / "app" / "icon.png")
print("saved clean photographic logo-icon.png", badge.size)
print("DONE")
