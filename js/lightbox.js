<script>
    /* --- SCRIPT INTELIGENTE DE GALERÍA (AUTO-FETCH) --- */
    
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.video a');

        if (link) {
            const videoID = link.getAttribute('data-youtube-id');
            
            // Si tiene ID, activamos el Lightbox
            if (videoID) {
                e.preventDefault();
                openLightbox(link, videoID);
            }
        }
    });

    function openLightbox(element, id) {
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        const titleEl = document.getElementById('lb-title');
        const descEl = document.getElementById('lb-desc');
        const linkEl = document.getElementById('lb-link');

        // 1. Datos básicos (inmediatos)
        const title = element.querySelector('h4').innerText;
        const pageLink = element.getAttribute('href');
        
        // Ponemos un texto temporal de carga
        descEl.innerText = "Cargando detalles del proyecto...";
        descEl.style.opacity = "0.5"; // Efecto visual de carga

        // 2. Rellenar Lightbox
        iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&vq=hd1080&modestbranding=1";
        titleEl.innerText = title;
        linkEl.href = pageLink;

        // 3. LA MAGIA: Fetch (Ir a buscar el texto a la otra página)
        fetch(pageLink)
            .then(response => {
                // Si la página existe, dame el texto
                if (response.ok) return response.text();
                throw new Error('Error al cargar');
            })
            .then(html => {
                // Convertimos el texto HTML en un documento leíble
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // A) Intentamos leer la META DESCRIPTION (Lo ideal para SEO y resúmenes)
                let summary = doc.querySelector('meta[name="description"]')?.content;

                // B) Si no hay meta, buscamos el primer párrafo <p> del contenido
                if (!summary) {
                    // Ajusta 'p' si tu texto está en otra etiqueta específica
                    const firstParagraph = doc.querySelector('p'); 
                    if (firstParagraph) summary = firstParagraph.innerText;
                }

                // C) Limpieza y Recorte
                if (summary) {
                    // Si es muy largo (más de 250 caracteres), lo cortamos
                    if (summary.length > 250) {
                        summary = summary.substring(0, 250).trim() + "...";
                    }
                    descEl.innerText = summary;
                } else {
                    descEl.innerText = "Disfruta de este proyecto audiovisual.";
                }
            })
            .catch(error => {
                console.log("No se pudo extraer la descripción automáticamente", error);
                descEl.innerText = "Haz clic en el botón para ver todos los detalles del proyecto.";
            })
            .finally(() => {
                descEl.style.opacity = "1"; // Quitamos efecto carga
            });

        // 4. Mostrar
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        lightbox.classList.remove('active');
        setTimeout(() => { iframe.src = ""; }, 300);
        document.body.style.overflow = 'auto';
    }

    document.getElementById('video-lightbox').addEventListener('click', function(e) {
        if (e.target === this) { closeLightbox(); }
    });
</script>