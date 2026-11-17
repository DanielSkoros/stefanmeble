import html
import json
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(os.environ.get(
    "STEFANMEBLE_EXPORT",
    "/mnt/c/Users/Dupa/Desktop/stefanmeble/versions/index.html",
))

reviews = json.loads((ROOT / "data/reviews.json").read_text(encoding="utf-8"))["reviews"]


def article(review):
    rating = max(0, min(5, int(review.get("rating", 0))))
    stars = "★" * rating + "☆" * (5 - rating)
    parts = [
        '        <article class="review">',
        f'          <div class="stars" role="img" aria-label="{rating} na 5">{stars}</div>',
        f'          <p>„{html.escape(review["text"])}”</p>',
        "          <footer>",
        f'            <strong>{html.escape(review.get("name", ""))}</strong>',
    ]
    if review.get("service"):
        parts.append(f'            <span>{html.escape(review["service"])}</span>')
    if review.get("source"):
        label = f'{html.escape(review["source"])} <span aria-hidden="true">↗</span>'
        if review.get("sourceUrl"):
            parts.append(
                f'            <a class="review-source" href="{html.escape(review["sourceUrl"])}" '
                f'target="_blank" rel="noopener">{label}</a>'
            )
        else:
            parts.append(f'            <span class="review-source">{label}</span>')
    parts += ["          </footer>", "        </article>"]
    return "\n".join(parts)


opening = '      <div class="reviews-list" role="region" aria-label="Opinie klientów" tabindex="0">'
block = opening + "\n" + "\n".join(article(r) for r in reviews) + "\n      </div>\n    </section>"

index_path = ROOT / "index.html"
page = index_path.read_text(encoding="utf-8")
page = re.sub(r'    <!-- OPINIE.*?-->\n', "    <!-- OPINIE (prawdziwe opinie z Google) -->\n", page, count=1)
pattern = re.compile(r'      <div class="reviews-list"[^>]*>.*?\n      </div>\n    </section>', re.S)
assert len(pattern.findall(page)) == 1
page = pattern.sub(lambda m: block, page)
index_path.write_text(page, encoding="utf-8")

css = (ROOT / "style.css").read_text(encoding="utf-8")
js = (ROOT / "script.js").read_text(encoding="utf-8")
page = page.replace('  <link rel="stylesheet" href="style.css">', f'  <style>\n{css}\n  </style>')
page = page.replace('  <script src="script.js" defer></script>', "")
page = page.replace("</body>", f'  <script>\n{js}\n  </script>\n</body>')
OUT.parent.mkdir(parents=True, exist_ok=True)
assets = ROOT / "assets"
if assets.is_dir():
    target = OUT.parent / "assets"
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(assets, target)
OUT.write_text(page, encoding="utf-8")

print(f"opinii: {len(reviews)} | zapisano eksport: {OUT}")
