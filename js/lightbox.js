<script>
    // Función para abrir el Lightbox
    function openLightbox(element) {
        event.preventDefault(); // Evita que el link navegue a otra página
        
        // 1. Obtener datos del elemento clicado
        const videoID = element.getAttribute('data-youtube-id');
        const title = element.querySelector('h4').innerText;
        const pageLink = element.getAttribute('href');
        // Opcional: Si quieres descripciones distintas, usa data-desc="..."
        const description = element.getAttribute('data-desc') || "Descripción breve del proyecto audiovisual. Aquí puedes contar detalles sobre el rodaje, la cámara usada o la localización.";

        // 2. Rellenar el Lightbox
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        const titleEl = document.getElementById('lb-title');
        const descEl = document.getElementById('lb-desc');
        const linkEl = document.getElementById('lb-link');

        // Construir URL de YouTube (autoplay activado)
        iframe.src = "https://www.youtube.com/embed/" + videoID + "?autoplay=1&rel=0";
        
        titleEl.innerText = title;
        descEl.innerText = description;
        linkEl.href = pageLink;

        // 3. Mostrar Lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll de la web
    }

    // Función para cerrar
    function closeLightbox() {
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        
        lightbox.classList.remove('active');
        
        // IMPORTANTE: Vaciar el src para que el video deje de sonar
        setTimeout(() => { iframe.src = ""; }, 300);
        
        document.body.style.overflow = 'auto'; // Reactivar scroll
    }

    // Cerrar si se hace clic fuera del contenido (en el fondo oscuro)
    document.getElementById('video-lightbox').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
</script>