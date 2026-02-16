    /* --- SCRIPT VIGILANTE DE GALERÍA --- */
    
    // 1. Escuchamos TODOS los clics de la página
    document.addEventListener('click', function(e) {
        // Buscamos si lo que se clicó está dentro de un enlace de video
        // ( .video a ) significa: cualquier enlace <a> dentro de una clase .video
        const link = e.target.closest('.video a');

        // Si encontramos un enlace de video...
        if (link) {
            // IMPORTANTE: Verificamos si tiene ID de YouTube
            const videoID = link.getAttribute('data-youtube-id');
            
            if (videoID) {
                // Si tiene ID, es un video para el Lightbox. ¡DETENEMOS LA NAVEGACIÓN!
                e.preventDefault();
                openLightbox(link, videoID);
            }
            // Si NO tiene ID (videoID es null), dejamos que el enlace funcione normal 
            // y vaya a la página individual.
        }
    });

    // 2. Función que abre la ventana (Más sencilla ahora)
    function openLightbox(element, id) {
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        const titleEl = document.getElementById('lb-title');
        const descEl = document.getElementById('lb-desc');
        const linkEl = document.getElementById('lb-link');

        // Datos
        const title = element.querySelector('h4').innerText;
        const pageLink = element.getAttribute('href');
        const description = element.getAttribute('data-desc') || "Disfruta de este proyecto audiovisual.";

        // Rellenar
        iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&vq=hd1080&modestbranding=1";
        titleEl.innerText = title;
        descEl.innerText = description;
        linkEl.href = pageLink;

        // Mostrar
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }

    // 3. Función para cerrar
    function closeLightbox() {
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        
        lightbox.classList.remove('active');
        
        // Retraso para vaciar el video y que deje de sonar
        setTimeout(() => { iframe.src = ""; }, 300);
        document.body.style.overflow = 'auto';
    }

    // Cerrar con la X
    // (Asegúrate de que tu HTML del lightbox tiene <div class="lightbox-close" onclick="closeLightbox()">)
    
    // Cerrar clicando fuera
    document.getElementById('video-lightbox').addEventListener('click', function(e) {
        if (e.target === this) { closeLightbox(); }
    });