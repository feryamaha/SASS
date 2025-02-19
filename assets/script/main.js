document.addEventListener('DOMContentLoaded', function () {
    const menuSquare = document.getElementById('menu-square');
    const menu = document.getElementById('menu-toggle');
    const originalSrc = menuSquare.src;
    const closeSrc = './assets/img/menu-square-X.svg';

    menuSquare.addEventListener('click', function () {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            menuSquare.src = closeSrc;
            menu.style.display = 'flex'; // Mostrar o menu quando ativo
        } else {
            menuSquare.src = originalSrc;
            menu.style.display = 'none'; // Ocultar o menu quando inativo
        }
    });

    // Ocultar o menu por padrão em telas menores que 768px
    if (window.innerWidth <= 768) {
        menu.style.display = 'none';
    }

    // Adicionar um listener de redimensionamento para ajustar o menu
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menu.style.display = ''; // Reset para o comportamento padrão em telas maiores
            menu.classList.remove('active');
            menuSquare.src = originalSrc;
        } else {
            menu.style.display = 'none';
            if (!menu.classList.contains('active')) {
                menuSquare.src = originalSrc;
            }
        }
    });
});