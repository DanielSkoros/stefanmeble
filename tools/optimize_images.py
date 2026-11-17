import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images"
WIDTHS = (800, 1400, 2000)

ROTATIONS = {
    "hero/hero-01": 3,
    "hero/hero-02": 2,
    "hero/hero-03": 2,
    "projects/05/photo-01": 1,
    "projects/06/photo-01": 1,
    "projects/08/photo-01": 1,
    "projects/03/photo-01": 2.3,
    "projects/04/photo-01": 0,
    "projects/10/photo-01": 1.7,
}


def slide_number(path):
    match = re.search(r"(\d+)$", path.name)
    return int(match.group(1)) if match else 0


def images_in(folder):
    return sorted(p for p in folder.rglob("*") if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))


def level_image(image, target):
    angle = ROTATIONS.get(str(target.relative_to(OUT)))
    if not angle:
        return image, 0
    width, height = image.size
    rotated = image.convert("RGBA").rotate(
        angle, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0)
    )
    backdrop = ImageOps.fit(image, rotated.size, method=Image.Resampling.LANCZOS).convert("RGBA")
    leveled = Image.alpha_composite(backdrop, rotated).convert("RGB")
    left = (leveled.width - width) // 2
    top = (leveled.height - height) // 2
    return leveled.crop((left, top, left + width, top + height)), angle


def save_variants(source, target):
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image, angle = level_image(image, target)
        target.parent.mkdir(parents=True, exist_ok=True)
        for width in WIDTHS:
            resized = image if image.width <= width else image.resize(
                (width, round(image.height * width / image.width)), Image.Resampling.LANCZOS
            )
            base = target.with_name(f"{target.name}-{width}")
            resized.save(f"{base}.webp", "WEBP", quality=90, method=6)
            resized.save(f"{base}.jpg", "JPEG", quality=90, optimize=True, progressive=True, subsampling=0)
        return resized.size, angle


def main():
    if len(sys.argv) != 2:
        raise SystemExit(f"Użycie: {sys.argv[0]} <katalog_ze_zdjęciami>")

    source_root = Path(sys.argv[1]).expanduser()
    if not source_root.is_dir():
        raise SystemExit(f"Nie znaleziono katalogu: {source_root}")

    if OUT.exists():
        shutil.rmtree(OUT)

    groups = []
    hero = sorted(images_in(source_root / "sekcja_gorna"))
    about = images_in(source_root / "sekcja_dolna")
    for index, path in enumerate(hero, 1):
        groups.append((path, OUT / "hero" / f"hero-{index:02d}"))
    for path in about:
        groups.append((path, OUT / "about" / "about"))

    gallery = source_root / "galeria"
    for folder in sorted((p for p in gallery.iterdir() if p.is_dir() and p.name.startswith("slajd_")), key=slide_number):
        project = OUT / "projects" / f"{slide_number(folder):02d}"
        for index, path in enumerate(images_in(folder), 1):
            groups.append((path, project / f"photo-{index:02d}"))

    for source, target in groups:
        size, angle = save_variants(source, target)
        rotation = f", rotacja {angle:+}°" if angle else ""
        print(f"{target.relative_to(ROOT)} <- {source.name} ({size[0]}x{size[1]}{rotation})")

    print(f"Łącznie: {len(groups)} zdjęć, {len(groups) * len(WIDTHS) * 2} plików")


if __name__ == "__main__":
    main()
