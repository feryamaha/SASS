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
function customCursor() {
    if (!document.body) {
        console.error('Erro: document.body não está disponível');
        return;
    }

    const cursor = document.createElement('div');
    const trail = [];
    const trailLength = 20; // Aumentei o rastro de 10 para 20 (ajuste aqui)
    let positions = [];

    // Lista de cores fornecidas (convertidas de Sass para array JS)
    const colors = [
        '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#ffffff', // Grays
        '#8B0000', '#FF0000', '#FF6347', '#FF7F7F', '#FFA07A', // Reds
        '#00008B', '#0000FF', '#1E90FF', '#87CEFA', '#ADD8E6', // Blues
        '#006400', '#00FF00', '#32CD32', '#98FB98', '#90EE90', // Greens
        '#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2', // Yellows
        '#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD'  // Violets
    ];

    // Função para escolher uma cor aleatória
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    // Estilização do cursor principal
    Object.assign(cursor.style, {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${getRandomColor()}`, // Cor inicial aleatória
        backgroundColor: getRandomColor(), // Cor inicial aleatória
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '9999',
        top: '0px',
        left: '0px',
        transition: 'transform 0.1s ease',
        display: 'block'
    });

    document.body.appendChild(cursor);

    // Criação dos elementos do rastro (borda laranja, interior transparente)
    for (let i = 0; i < trailLength; i++) {
        const trailElement = document.createElement('div');
        Object.assign(trailElement.style, {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid orange',
            backgroundColor: 'transparent',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '9998',
            top: '0px',
            left: '0px',
            opacity: (1 - i / trailLength).toString(),
            transition: 'transform 0.05s ease',
            display: 'block'
        });
        trail.push(trailElement);
        document.body.appendChild(trailElement);
    }

    // Evento de movimento do mouse
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX - 10;
        const y = e.clientY - 10;

        // Atualiza posição do cursor
        cursor.style.transform = `translate(${x}px, ${y}px)`;

        // Muda a cor do cursor aleatoriamente
        const newColor = getRandomColor();
        cursor.style.border = `2px solid ${newColor}`;
        cursor.style.backgroundColor = newColor;

        // Atualiza o rastro
        positions.unshift({ x, y });
        if (positions.length > trailLength) {
            positions.pop();
        }

        trail.forEach((trailElement, index) => {
            const pos = positions[index] || positions[positions.length - 1];
            if (pos) {
                trailElement.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            }
        });
    });

    // Esconde o cursor padrão
    document.body.style.cursor = 'none';
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    customCursor();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        customCursor();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Configurações iniciais
    const gridContainer = document.querySelector('.grid-container');
    const circleRadius = 64; // Metade de 8rem (128px)

    // Lista de esferas com IDs fixos
    const circles = [
        document.getElementById('c1'),
        document.getElementById('c2'),
        document.getElementById('c3'),
        document.getElementById('c4'),
        document.getElementById('c5'),
        document.getElementById('c6'),
        document.getElementById('c7'),
        document.getElementById('c8'),
        document.getElementById('c9'),
        document.getElementById('c10')
    ];

    // Lista de cores
    const colors = [
        '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#ffffff',
        '#8B0000', '#FF0000', '#FF6347', '#FF7F7F', '#FFA07A',
        '#00008B', '#0000FF', '#1E90FF', '#87CEFA', '#ADD8E6',
        '#006400', '#00FF00', '#32CD32', '#98FB98', '#90EE90',
        '#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2',
        '#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD'
    ];

    // Funções utilitárias
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const getRandomVelocity = () => (Math.random() - 0.5) * 4;

    // Inicializar esferas
    const spheres = circles.map(circle => ({
        element: circle,
        x: 0, // Inicializado dinamicamente depois
        y: 0,
        vx: getRandomVelocity(),
        vy: getRandomVelocity(),
        color: getRandomColor(),
        isDragging: false,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        isPaused: false
    }));

    // Função para obter limites dinâmicos
    function getContainerBounds() {
        const rect = gridContainer.getBoundingClientRect();
        const maxWidth = Math.max(0, rect.width - circleRadius * 2);
        const maxHeight = Math.max(0, rect.height - circleRadius * 2);
        return { maxWidth, maxHeight };
    }

    // Inicializar posições iniciais
    spheres.forEach(sphere => {
        const bounds = getContainerBounds();
        sphere.x = Math.random() * bounds.maxWidth;
        sphere.y = Math.random() * bounds.maxHeight;
        sphere.element.style.backgroundColor = sphere.color;
        sphere.element.style.cursor = 'pointer';
        sphere.element.style.pointerEvents = 'auto';
        sphere.element.style.position = 'absolute';
        sphere.element.style.zIndex = '1000';
        sphere.element.style.transform = `translate(${sphere.x}px, ${sphere.y}px)`;
    });

    // Função de colisão
    function checkCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circleRadius * 2;
    }

    // Resolver colisão
    function resolveCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const nx = dx / distance;
        const ny = dy / distance;

        const relativeVelocityX = sphere2.vx - sphere1.vx;
        const relativeVelocityY = sphere2.vy - sphere1.vy;
        const impulse = 2 * (relativeVelocityX * nx + relativeVelocityY * ny) / 2;

        sphere1.vx += impulse * nx;
        sphere1.vy += impulse * ny;
        sphere2.vx -= impulse * nx;
        sphere2.vy -= impulse * ny;

        const tempColor = sphere1.color;
        sphere1.color = sphere2.color;
        sphere2.color = tempColor;
        sphere1.element.style.backgroundColor = sphere1.color;
        sphere2.element.style.backgroundColor = sphere2.color;
    }

    // Funções de arrastar
    function startDragging(sphere, x, y) {
        sphere.isDragging = true;
        sphere.isPaused = true;
        sphere.lastX = x;
        sphere.lastY = y;
        sphere.lastTime = performance.now();
        sphere.color = getRandomColor();
        sphere.element.style.backgroundColor = sphere.color;
    }

    function moveDragging(sphere, x, y) {
        if (sphere.isDragging) {
            const bounds = getContainerBounds();
            const rect = gridContainer.getBoundingClientRect();
            const offsetX = x - rect.left;
            const offsetY = y - rect.top;

            sphere.x = Math.max(0, Math.min(offsetX - circleRadius, bounds.maxWidth));
            sphere.y = Math.max(0, Math.min(offsetY - circleRadius, bounds.maxHeight));

            sphere.lastX = x;
            sphere.lastY = y;
        }
    }

    function stopDragging(sphere, x, y) {
        if (sphere.isDragging) {
            sphere.isDragging = false;
            sphere.isPaused = false;

            const currentTime = performance.now();
            const timeDelta = (currentTime - sphere.lastTime) / 1000;
            const deltaX = x - sphere.lastX;
            const deltaY = y - sphere.lastY;

            sphere.vx = (deltaX / timeDelta) * 0.05;
            sphere.vy = (deltaY / timeDelta) * 0.05;

            sphere.vx = Math.max(-10, Math.min(10, sphere.vx));
            sphere.vy = Math.max(-10, Math.min(10, sphere.vy));

            sphere.lastTime = 0;
        }
    }

    // Eventos para cada esfera
    spheres.forEach(sphere => {
        sphere.element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDragging(sphere, e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            e.preventDefault();
            moveDragging(sphere, e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', (e) => {
            stopDragging(sphere, e.clientX, e.clientY);
        });

        sphere.element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDragging(sphere, touch.clientX, touch.clientY);
        });

        sphere.element.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            moveDragging(sphere, touch.clientX, touch.clientY);
        });

        sphere.element.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            stopDragging(sphere, touch.clientX, touch.clientY);
        });
    });

    // Retomar movimento ao clicar/tocar fora das esferas
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('circle')) {
            spheres.forEach(sphere => {
                if (sphere.isPaused) {
                    sphere.isPaused = false;
                    if (sphere.vx === 0 && sphere.vy === 0) {
                        sphere.vx = getRandomVelocity();
                        sphere.vy = getRandomVelocity();
                    }
                }
            });
        }
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.classList.contains('circle')) {
            spheres.forEach(sphere => {
                if (sphere.isPaused) {
                    sphere.isPaused = false;
                    if (sphere.vx === 0 && sphere.vy === 0) {
                        sphere.vx = getRandomVelocity();
                        sphere.vy = getRandomVelocity();
                    }
                }
            });
        }
    });

    // Função de animação
    function animate() {
        const bounds = getContainerBounds();

        spheres.forEach(sphere => {
            if (!sphere.isDragging && !sphere.isPaused) {
                sphere.x += sphere.vx;
                sphere.y += sphere.vy;

                // Colisão com as bordas do grid-container
                if (sphere.x <= 0) {
                    sphere.x = 0;
                    sphere.vx = -sphere.vx * 0.8;
                } else if (sphere.x >= bounds.maxWidth) {
                    sphere.x = bounds.maxWidth;
                    sphere.vx = -sphere.vx * 0.8;
                }
                if (sphere.y <= 0) {
                    sphere.y = 0;
                    sphere.vy = -sphere.vy * 0.8;
                } else if (sphere.y >= bounds.maxHeight) {
                    sphere.y = bounds.maxHeight;
                    sphere.vy = -sphere.vy * 0.8;
                }
            }

            // Usar apenas transform para posicionamento
            sphere.element.style.transform = `translate(${sphere.x}px, ${sphere.y}px)`;
        });

        // Verificar colisões entre esferas
        for (let i = 0; i < spheres.length; i++) {
            for (let j = i + 1; j < spheres.length; j++) {
                if (checkCollision(spheres[i], spheres[j])) {
                    resolveCollision(spheres[i], spheres[j]);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Depuração
    console.log('Initial bounds:', getContainerBounds());

    animate();
});