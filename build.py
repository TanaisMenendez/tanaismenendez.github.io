import json
import os
import re
import html
import datetime

# --- CONFIGURACIÓN ---
JSON_FILE = 'videos.json'
INDEX_FILE = 'index.html'
PORTFOLIO_FILE = 'portfolio.html'
SITEMAP_FILE = 'sitemap.xml'

# Plantilla exacta basada en tu stub-template.html
STUB_TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{title_stub}</title>
    <meta name="description" content="{desc_clean}">

    <meta property="og:url" content="/{slug}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{title_stub}">
    <meta property="og:description" content="{desc_clean}">
    <meta property="og:image" content="/img/open-graph/{slug}.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="/">
    <meta property="twitter:url" content="https://tanaismenendez.es/{slug}">
    <meta name="twitter:title" content="{title_stub}">
    <meta name="twitter:description" content="{desc_clean}">
    <meta name="twitter:image" content="/img/open-graph/{slug}.jpg">

    <script>
        window.location.href = "/portfolio#{slug}";
    </script>
    
    <meta http-equiv="refresh" content="0;url=/portfolio#{slug}">
</head>
<body>
    <p>Abriendo proyecto... <a href="/portfolio#{slug}">Click aquí si no redirige.</a></p>
</body>
</html>"""

def load_data():
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# Función para convertir a Title Case (Para Stubs)
def to_title_case(text):
    small_words = r'^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via|de|del|la|el|los|las|y|o|con)$'
    force_upper = r'^(MTB|BMX|FPV|OCR|DH|II|III|IV)$'
    
    def replace(match):
        word = match.group(0)
        if re.match(force_upper, word, re.IGNORECASE):
            return word.upper()
        if re.match(small_words, word, re.IGNORECASE):
            return word.lower()
        return word.capitalize()

    words = text.split()
    new_words = [replace(re.search(r'\w+', words[0], re.UNICODE))] 
    
    for i in range(1, len(words)):
        prev_char = words[i-1][-1] if words[i-1] else ''
        if prev_char in [':', '|', '.', '-']:
             new_words.append(words[i].capitalize())
        else:
             new_words.append(replace(re.search(r'\w+|.', words[i], re.UNICODE)))

    processed = []
    for i, w in enumerate(text.split()):
        if i == 0: processed.append(w.capitalize())
        elif re.match(force_upper, w, re.IGNORECASE): processed.append(w.upper())
        elif re.match(small_words, w, re.IGNORECASE): processed.append(w.lower())
        else: processed.append(w.capitalize())
    
    return " ".join(processed)

def update_index(videos):
    top_videos = videos[:6]
    html_out = ""
    
    for v in top_videos:
        title_upper = html.escape(v['title'].upper())
        desc_clean = html.escape(v['description'].replace('\n', ' ').strip()[:150] + "...")
        html_out += f"""
        <div data-aos="fade" class="video">
            <a href="/portfolio#{v['slug']}" data-youtube-id="{v['youtube_id']}" data-desc="{desc_clean}">
                <div class="element-text">
                    <h4>{title_upper}</h4>
                </div>
                <figure>
                    <img src="img/covers/{v['slug']}.jpg" loading="lazy" alt="{title_upper}">
                </figure>
            </a>
        </div>"""
    
    with open(INDEX_FILE, 'r', encoding='utf-8') as f: content = f.read()
    
    pattern = r'(<!--LATEST VIDEOS-->)(.*?)(<!--LATEST VIDEOS-->)'
    
    new_content = re.sub(pattern, f'\\1\n{html_out}\n\\3', content, flags=re.DOTALL)
    with open(INDEX_FILE, 'w', encoding='utf-8') as f: f.write(new_content)
    print("✅ Index actualizado (6 vídeos).")

def update_portfolio(videos):
    html_out = ""
    for v in videos:
        title_upper = html.escape(v['title'].upper())
        desc_paragraphs = "".join([f"<p>{line}</p>" for line in v['description'].split('\n') if line.strip()])
        
        html_out += f"""
        <div class="video filter {v['category']}">
            <a href="#{v['slug']}" data-youtube-id="{v['youtube_id']}">
                <div class="element-text">
                    <h4>{title_upper}</h4>
                </div>
                <img src="img/covers/{v['slug']}.jpg" loading="lazy" alt="{title_upper}">
            </a>
            <div id="info-{v['slug']}" class="hidden-content">
                {desc_paragraphs}
            </div>
        </div>"""
        
    with open(PORTFOLIO_FILE, 'r', encoding='utf-8') as f: content = f.read()
    
    pattern = r'(<!--GALLERY GRID-->)(.*?)(<!--GALLERY GRID-->)'
    
    new_content = re.sub(pattern, f'\\1\n{html_out}\n\\3', content, flags=re.DOTALL)
    with open(PORTFOLIO_FILE, 'w', encoding='utf-8') as f: f.write(new_content)
    print(f"✅ Portfolio actualizado ({len(videos)} vídeos).")

def generate_stubs_and_sitemap(videos):
    # Cogemos la fecha actual automáticamente en formato AAAA-MM-DD
    fecha_hoy = datetime.datetime.now().strftime('%Y-%m-%d')
    sitemap_items = ""
    
    for v in videos:
        title_pretty = to_title_case(v['title'])
        title_full = f"{title_pretty} - Tanais Menéndez Filmmaker"
        desc_clean = html.escape(v['description'].replace('\n', ' ').strip()[:160] + "...")
        
        stub_content = STUB_TEMPLATE.format(
            title_stub=title_full,
            desc_clean=desc_clean,
            slug=v['slug']
        )
        with open(f"{v['slug']}.html", 'w', encoding='utf-8') as f:
            f.write(stub_content)
            
        if v['youtube_id']:
            sitemap_items += f"""
    <video:video>
      <video:thumbnail_loc>https://tanaismenendez.es/img/covers/{v['slug']}.jpg</video:thumbnail_loc>
      <video:title>{html.escape(title_pretty)}</video:title>
      <video:description>{desc_clean}</video:description>
      <video:player_loc>https://www.youtube.com/embed/{v['youtube_id']}</video:player_loc>
    </video:video>"""

    # Fíjate que ahora usamos {fecha_hoy} en lugar de la fecha fija
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://tanaismenendez.es/</loc>
    <lastmod>{fecha_hoy}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tanaismenendez.es/portfolio</loc>
    <lastmod>{fecha_hoy}</lastmod>
    <priority>0.8</priority>
    {sitemap_items}
  </url>
</urlset>"""
    
    with open(SITEMAP_FILE, 'w', encoding='utf-8') as f: f.write(sitemap_xml)
    print("✅ Stubs y Sitemap generados.")

if __name__ == "__main__":
    data = load_data()
    update_index(data)
    update_portfolio(data)
    generate_stubs_and_sitemap(data)