from PIL import Image, ImageDraw

def create_spotlight_icon(size, filename):
    # Create blank image (transparent background)
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Center
    cx, cy = size // 2, size // 2
    max_radius = size // 2

    # Draw radial gradient (spotlight effect)
    for r in range(max_radius, 0, -1):
        alpha = int(255 * (1 - r / max_radius))  # fade out
        color = (255, 255, 200, alpha)  # warm spotlight color
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=color)

    # Dark background around spotlight
    dark_overlay = Image.new("RGBA", (size, size), (0, 0, 0, 180))
    img = Image.alpha_composite(dark_overlay, img)

    # Save PNG
    img.save(filename)

# Generate common Chrome extension icon sizes
for s in [16, 32, 48, 128]:
    create_spotlight_icon(s, f"icon{s}.png")
