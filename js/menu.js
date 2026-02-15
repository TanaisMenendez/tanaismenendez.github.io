function toggleMenu() {
        // Seleccionamos el menú y el botón
        var menu = document.getElementById('card-menu');
        var button = document.getElementById('show-menu');
        
        // Alternamos las clases 'abierto'
        menu.classList.toggle('menu-abierto');
        button.classList.toggle('open'); // Esto activará la animación del botón
    }