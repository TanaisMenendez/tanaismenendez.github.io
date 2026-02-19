import os
from PIL import Image

def resize_and_crop(image_path, output_path, target_width, target_height):
    try:
        img = Image.open(image_path)
        
        # Convertir a RGB por si hay algún PNG transparente o formato raro
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Calculamos las proporciones para recortar el centro exacto sin deformar
        img_ratio = img.width / img.height
        target_ratio = target_width / target_height

        if img_ratio > target_ratio:
            # La imagen es más ancha, recortamos los lados
            new_width = int(img.height * target_ratio)
            left = (img.width - new_width) / 2
            top = 0
            right = (img.width + new_width) / 2
            bottom = img.height
        else:
            # La imagen es más alta, recortamos arriba y abajo
            new_height = int(img.width / target_ratio)
            left = 0
            top = (img.height - new_height) / 2
            right = img.width
            bottom = (img.height + new_height) / 2

        # Recortar el centro
        img = img.crop((left, top, right, bottom))
        
        # Reescalar al tamaño final con el mejor algoritmo (LANCZOS)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Guardar optimizado pisando el original
        img.save(output_path, 'JPEG', quality=85, optimize=True)
        
    except Exception as e:
        print(f"❌ Error con la imagen {image_path}: {e}")

def process_folder(folder, width, height):
    if not os.path.exists(folder):
        print(f"⚠️ La carpeta {folder} no existe. Saltando...")
        return
        
    print(f"📂 Procesando la carpeta '{folder}' a {width}x{height}...")
    count = 0
    
    # Recorremos todas las fotos de la carpeta
    for filename in os.listdir(folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            file_path = os.path.join(folder, filename)
            resize_and_crop(file_path, file_path, width, height)
            count += 1
            
    print(f"✅ ¡{count} imágenes optimizadas en '{folder}'!\n")

if __name__ == "__main__":
    print("🚀 Iniciando optimización masiva de imágenes...\n")
    
    # Optimizamos las covers a 800x450
    process_folder('img/covers', 800, 450)
    
    # Optimizamos los open-graph a 1200x630
    process_folder('img/open-graph', 1200, 630)
    
    print("🎉 ¡Proceso terminado al 100%! Tu web ahora volará.")