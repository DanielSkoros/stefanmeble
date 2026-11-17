"""Optymalizacja zdjęć do strony: WebP + JPEG w trzech szerokościach.

Użycie:  python3 tools/optimize_images.py <katalog_ze_zdjęciami>
Wymaga:  Pillow (pip install Pillow)

Struktura katalogu źródłowego:
  sekcja_gorna/       zdjęcia karuzeli w hero (kolejność wg nazwy pliku)
  sekcja_dolna/       zdjęcie w sekcji „O nas”
  galeria/slajd_N/    zdjęcia realizacji N (kolejność wg nazwy pliku)

Wynik trafia do assets/images/. Katalog wyjściowy jest czyszczony dopiero
po poprawnym wczytaniu wszystkich źródeł.
"""
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images"
WIDTHS = (800, 1400, 2000)
WEBP_QUALITY = 90
JPEG_QUALITY = 90

# Korekta przechyłu wg nazwy pliku źródłowego, w stopniach.
# Dodatnia wartość = obrót przeciwnie do ruchu wskazówek zegara
# (prawa krawędź zdjęcia idzie w górę), ujemna = zgodnie z zegarem.
ROTATIONS = {
    "1700398712805.jpg": 3,       # hero 1
    "20260110_125816.jpg": 2,     # hero 2
    "20260420_150407.jpg": 2,     # hero 3
    "1690058250151.jpg": 2.3,     # realizacja 3
    "1706127275176.jpg": 1,       # realizacja 5
    "1719945043664.jpg": 1,       # realizacja 6
    "IMG_20250908_134129.jpg": 1,  # realizacja 8
    "1704144201969.jpg": 1.7,     # realizacja 10
}

# Zdjęcie do podglądu w mediach społecznościowych (og:image), 1200x630
OG_SOURCE = "20260110_125816.jpg"
OG_SIZE = (1200, 630)


def slide_number(path):
    match = re.search(r"(\d+)$", path.name)
    return int(match.group(1)) if match else 0


def images_in(folder):
    return sorted(p for p in folder.rglob("*") if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))


def load(source):
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
    angle = ROTATIONS.get(source.name, 0)
    return (level(image, angle) if angle else image), angle


def level(image, angle):
    """Obraca zdjęcie i przycina do pierwotnego kadru; rogi wypełnia powiększonym tłem."""
    width, height = image.size
    rotated = image.convert("RGBA").rotate(
        angle, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0)
    )
    backdrop = ImageOps.fit(image, rotated.size, method=Image.Resampling.LANCZOS).convert("RGBA")
    leveled = Image.alpha_composite(backdrop, rotated).convert("RGB")
    left = (leveled.width - width) // 2
    top = (leveled.height - height) // 2
    return leveled.crop((left, top, left + width, top + height))


def save_variants(image, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    for width in WIDTHS:
        resized = image if image.width <= width else image.resize(
            (width, round(image.height * width / image.width)), Image.Resampling.LANCZOS
        )
        base = target.with_name(f"{target.name}-{width}")
        resized.save(f"{base}.webp", "WEBP", quality=WEBP_QUALITY, method=6)
        resized.save(f"{base}.jpg", "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True, subsampling=0)
    return resized.size


def collect(source_root):
    hero = images_in(source_root / "sekcja_gorna")
    about = images_in(source_root / "sekcja_dolna")
    gallery = source_root / "galeria"
    if not hero or not about or not gallery.is_dir():
        raise SystemExit(f"W {source_root} brakuje sekcja_gorna/, sekcja_dolna/ lub galeria/ ze zdjęciami")

    groups = [(path, OUT / "hero" / f"hero-{index:02d}") for index, path in enumerate(hero, 1)]
    groups += [(path, OUT / "about" / "about") for path in about[:1]]

    folders = sorted((p for p in gallery.iterdir() if p.is_dir() and p.name.startswith("slajd_")), key=slide_number)
    for folder in folders:
        project = OUT / "projects" / f"{slide_number(folder):02d}"
        groups += [(path, project / f"photo-{index:02d}") for index, path in enumerate(images_in(folder), 1)]
    return groups


def main():
    if len(sys.argv) != 2:
        raise SystemExit(f"Użycie: {sys.argv[0]} <katalog_ze_zdjęciami>")

    source_root = Path(sys.argv[1]).expanduser()
    if not source_root.is_dir():
        raise SystemExit(f"Nie znaleziono katalogu: {source_root}")

    groups = collect(source_root)
    og_path = next((p for p, _ in groups if p.name == OG_SOURCE), None)
    if og_path is None:
        raise SystemExit(f"Nie znaleziono zdjęcia do og:image ({OG_SOURCE})")

    if OUT.exists():
        shutil.rmtree(OUT)

    for source, target in groups:
        image, angle = load(source)
        size = save_variants(image, target)
        rotation = f", rotacja {angle:+}°" if angle else ""
        print(f"{target.relative_to(ROOT)} <- {source.name} ({size[0]}x{size[1]}{rotation})")

    og_image, _ = load(og_path)
    ImageOps.fit(og_image, OG_SIZE, method=Image.Resampling.LANCZOS).save(
        OUT / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True
    )
    print(f"assets/images/og.jpg <- {OG_SOURCE} ({OG_SIZE[0]}x{OG_SIZE[1]})")
    print(f"Łącznie: {len(groups)} zdjęć, {len(groups) * len(WIDTHS) * 2 + 1} plików")


if __name__ == "__main__":
    main()
