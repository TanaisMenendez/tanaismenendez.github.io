<script>
    // Fíjate que ahora recibimos "event" como primer parámetro
    function openLightbox(event, element) {
        event.preventDefault(); // ESTO es lo que evita que se abra la página nueva
        
        // 1. Obtener datos
        const videoID = element.getAttribute('data-youtube-id');
        
        // Verificación de seguridad: si no hay ID, no hacemos nada
        if (!videoID) {
            console.error("Falta el ID de YouTube en este video");
            return;
        }

        const title = element.querySelector('h4').innerText;
        const pageLink = element.getAttribute('href');
        const description = element.getAttribute('data-desc') || "Descripción del proyecto.";

        // 2. Rellenar Lightbox
        const lightbox = document.getElementById('video-lightbox');
        const iframe = document.getElementById('lb-iframe');
        const titleEl = document.getElementById('lb-title');
        const descEl = document.getElementById('lb-desc');
        const linkEl = document.getElementById('lb-link');

        iframe.src = "https://www.youtube.com/embed/" + videoID + "?autoplay=1&rel=0";
        titleEl.innerText = title;
        descEl.innerText = description;
        linkEl.href = pageLink;

        // 3. Mostrar
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // El resto del código (closeLightbox, etc.) sigue igual...
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