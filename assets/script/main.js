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

function pulseEffect() {
    const elements = document.querySelectorAll('.box-content-img-home, .box-content-img-2');

    elements.forEach(element => {
        let scale = 1; // Começa no tamanho normal
        let brightness = 1; // Começa com brilho normal
        let pulsingUp = false;

        setInterval(() => {
            if (pulsingUp) {
                scale = Math.min(scale + 0.005, 1.05); // Aumenta o tamanho, mas não mais que 5%
                brightness = Math.min(brightness + 0.05, 1.2); // Aumenta o brilho, mas não mais que 20%
                if (scale >= 1.05) {
                    pulsingUp = false;
                }
            } else {
                scale = Math.max(scale - 0.005, 0.95); // Diminui o tamanho, mas não menos que 5% menor
                brightness = Math.max(brightness - 0.05, 0.8); // Diminui o brilho, mas não menos que 20% menos brilhante
                if (scale <= 0.95) {
                    pulsingUp = true;
                }
            }

            element.style.transform = `scale(${scale})`;
            element.style.filter = `brightness(${brightness})`;
        }, 50); // Ajuste o intervalo para controlar a velocidade do efeito
    });
}

document.addEventListener('DOMContentLoaded', pulseEffect);

function waveEffect() {
    const elements = document.querySelectorAll('.box-content-img-3, .box-content-img-4, .box-content-img-5, .box-content-img-6');
    const amplitude = 20; // Amplitude do movimento vertical
    const speed = 0.05; // Velocidade das ondas, ajuste conforme necessário

    elements.forEach((element, index) => {
        let time = index * Math.PI / 2; // Cada elemento começa em um ponto diferente da onda para criar o efeito de corda
        const initialY = element.offsetTop; // Posição inicial Y

        setInterval(() => {
            // Função senoidal para criar o movimento de onda, com desfasamento baseado no índice
            const y = initialY + Math.sin(time) * amplitude;
            element.style.transform = `translateY(${y - initialY}px)`;
            time += speed; // Ajuste a velocidade das ondas
        }, 50); // Intervalo de atualização
    });
}

document.addEventListener('DOMContentLoaded', waveEffect);


function colorTransitionByLetter() {
    const textElements = document.querySelectorAll('.s-hero .box-text h2, .s-hero .box-text p, .wrapper-box h2, .wrapper-box p, .menu a');
    const colors = [
        // Black to Gray
        '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#fff',
        // Red
        '#8B0000', '#FF0000', '#FF6347', '#FF7F7F', '#FFA07A',
        // Blue
        '#00008B', '#0000FF', '#1E90FF', '#87CEFA', '#ADD8E6',
        // Green
        '#006400', '#00FF00', '#32CD32', '#98FB98', '#90EE90',
        // Yellow
        '#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2',
        // Violet
        '#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD'
    ];

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    textElements.forEach(element => {
        const text = element.textContent;
        const letters = text.split('');

        let html = '';
        letters.forEach((letter, index) => {
            html += `<span style="color: ${getRandomColor()}; transition: color 0.8s ease;">${letter}</span>`;
        });

        let counter = 0;
        const updateColor = setInterval(() => {
            const spans = element.querySelectorAll('span');
            if (counter < spans.length) {
                spans[counter].style.color = getRandomColor();
                counter++;
            } else {
                counter = 0; // Reset counter to start over
            }
        }, 3000 / letters.length); // Intervalo ajustado para mudar a cor de cada letra sequencialmente

        element.innerHTML = html; // Atualiza o conteúdo com spans coloridos
    });
}

document.addEventListener('DOMContentLoaded', colorTransitionByLetter);