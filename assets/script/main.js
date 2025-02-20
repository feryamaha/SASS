// Definindo as cores uma única vez no topo do arquivo
const colors = {
    blackToGray: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#fff'],
    red: ['#8B0000', '#FF0000', '#FF6347', '#FF7F7F', '#FFA07A'],
    blue: ['#00008B', '#0000FF', '#1E90FF', '#87CEFA', '#ADD8E6'],
    green: ['#006400', '#00FF00', '#32CD32', '#98FB98', '#90EE90'],
    yellow: ['#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2'],
    violet: ['#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD']
};

// Função para converter hex para RGB array
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// Função global para escolher uma cor aleatória (suporta hex e RGB)
function getRandomColor(format = 'hex') {
    const colorGroups = Object.values(colors);
    const randomGroup = colorGroups[Math.floor(Math.random() * colorGroups.length)];
    const randomColor = randomGroup[Math.floor(Math.random() * randomGroup.length)];
    return format === 'rgb' ? hexToRgb(randomColor) : randomColor;
}

// Menu toggle (inalterado)
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

// Efeito de pulsação (inalterado)
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

// Efeito de onda (inalterado)
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

// Transição de cor por letra (otimizado)
function colorTransitionByLetter() {
    const textElements = document.querySelectorAll('.s-hero .box-text h2, .s-hero .box-text p, .wrapper-box h2, .wrapper-box p, .menu a');

    function getRandomColorLocal() {
        return getRandomColor('hex'); // Usando a função global
    }

    textElements.forEach(element => {
        const text = element.textContent;
        const letters = text.split('');

        let html = '';
        letters.forEach((letter, index) => {
            html += `<span style="color: ${getRandomColorLocal()}; transition: color 0.8s ease;">${letter}</span>`;
        });

        let counter = 0;
        const updateColor = setInterval(() => {
            const spans = element.querySelectorAll('span');
            if (counter < spans.length) {
                spans[counter].style.color = getRandomColorLocal();
                counter++;
            } else {
                counter = 0; // Reset counter to start over
            }
        }, 3000 / letters.length); // Intervalo ajustado para mudar a cor de cada letra sequencialmente

        element.innerHTML = html; // Atualiza o conteúdo com spans coloridos
    });
}

document.addEventListener('DOMContentLoaded', colorTransitionByLetter);

// Cursor personalizado (otimizado)
function customCursor() {
    if (!document.body) {
        console.error('Erro: document.body não está disponível');
        return;
    }

    const cursor = document.createElement('div');
    const trail = [];
    const trailLength = 20; // Aumentei o rastro de 10 para 20 (ajuste aqui)
    let positions = [];

    // Estilização do cursor principal
    Object.assign(cursor.style, {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${getRandomColor('hex')}`, // Usando a função global
        backgroundColor: getRandomColor('hex'), // Usando a função global
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
        const newColor = getRandomColor('hex'); // Usando a função global
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




////////////////////////////////////////////
// Esferas animadas (com formas geométricas, sólidos de Platão, tamanho responsivo e repulsão fluida)
document.addEventListener('DOMContentLoaded', () => {
    // Configurações iniciais
    const defaultRadius = 64; // Tamanho padrão para desktop (128px de diâmetro)
    const mobileRadius = 32; // Tamanho reduzido para mobile (64px de diâmetro)
    const mobileBreakpoint = 768; // Limite para tablets/celulares
    const repulsionForce = 2; // Força de repulsão ajustada
    const maxSpeed = 10; // Velocidade máxima
    const friction = 0.995; // Atrito muito leve para movimento contínuo

    // Função para determinar o raio com base na largura da tela
    function getCircleRadius() {
        return window.innerWidth <= mobileBreakpoint ? mobileRadius : defaultRadius;
    }

    let circleRadius = getCircleRadius(); // Raio inicial

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

    // Verificar se as esferas foram encontradas
    circles.forEach((circle, index) => {
        if (!circle) {
            console.error(`Esfera c${index + 1} não encontrada no DOM!`);
        } else {
            console.log(`Esfera c${index + 1} encontrada:`, circle);
        }
    });

    // Funções utilitárias
    const getRandomColorLocal = () => getRandomColor('hex');
    const getRandomVelocity = () => (Math.random() - 0.5) * 4;

    // Lista de formas geométricas e sólidos de Platão com estilos CSS
    const shapes = [
        { name: 'circle', style: { borderRadius: '50%', clipPath: null } }, // Círculo
        { name: 'square', style: { borderRadius: '0', clipPath: null } }, // Quadrado
        { name: 'triangle', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } }, // Triângulo
        { name: 'diamond', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } }, // Losango
        { name: 'ellipse', style: { borderRadius: '50% / 75%', clipPath: null } }, // Elipse
        { name: 'trapezoid', style: { clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', borderRadius: '0' } }, // Trapézio
        { name: 'pentagon', style: { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', borderRadius: '0' } }, // Pentágono
        // Sólidos de Platão
        { name: 'tetrahedron', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } }, // Tetraedro (triângulo base)
        { name: 'cube', style: { borderRadius: '0', clipPath: null } }, // Cubo (igual ao quadrado em 2D)
        { name: 'octahedron', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } }, // Octaedro (losango em projeção)
        { name: 'dodecahedron', style: { clipPath: 'polygon(50% 0%, 90% 38%, 72% 100%, 28% 100%, 10% 38%)', borderRadius: '0' } }, // Dodecaedro (pentágono aproximado)
        { name: 'icosahedron', style: { clipPath: 'polygon(50% 0%, 85% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 15% 30%)', borderRadius: '0' } } // Icosaedro (aproximação hexagonal)
    ];

    // Função para escolher uma forma aleatória
    function getRandomShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    // Inicializar esferas
    const spheres = circles.map(circle => {
        if (!circle) return null; // Evitar erros com elementos nulos
        const initialShape = shapes[0]; // Começa como círculo
        return {
            element: circle,
            x: 0,
            y: 0,
            vx: getRandomVelocity(),
            vy: getRandomVelocity(),
            color: getRandomColorLocal(),
            shape: initialShape,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            lastTime: 0,
            isPaused: false
        };
    }).filter(sphere => sphere !== null);

    if (spheres.length === 0) {
        console.error('Nenhuma esfera válida foi inicializada! Verifique os IDs no HTML.');
        return;
    }

    // Função para aplicar a forma e tamanho ao elemento
    function applyShapeAndSize(sphere) {
        const { style } = sphere.shape;
        sphere.element.style.borderRadius = style.borderRadius;
        sphere.element.style.clipPath = style.clipPath;
        const size = circleRadius * 2;
        sphere.element.style.width = `${size}px`;
        sphere.element.style.height = `${size}px`;
    }

    // Inicializar posições iniciais aleatórias
    spheres.forEach(sphere => {
        const bounds = getContainerBounds();
        sphere.x = Math.random() * bounds.maxWidth;
        sphere.y = Math.random() * bounds.maxHeight;
        sphere.element.style.position = 'fixed';
        sphere.element.style.left = `${sphere.x}px`;
        sphere.element.style.top = `${sphere.y}px`;
        sphere.element.style.backgroundColor = sphere.color;
        applyShapeAndSize(sphere); // Aplicar forma e tamanho inicial
        sphere.element.style.zIndex = '9997';
        sphere.element.style.opacity = '1';
        sphere.element.style.display = 'block';
        sphere.element.style.cursor = 'pointer';
        sphere.element.style.pointerEvents = 'auto';
        console.log(`Esfera ${sphere.element.id} posicionada em: left=${sphere.x}px, top=${sphere.y}px, color=${sphere.color}, shape=${sphere.shape.name}`);
    });

    // Função para obter limites dinâmicos do body
    function getContainerBounds() {
        circleRadius = getCircleRadius(); // Atualizar raio dinamicamente
        const maxWidth = Math.max(0, window.innerWidth - circleRadius * 2);
        const maxHeight = Math.max(0, window.innerHeight - circleRadius * 2);
        return { maxWidth, maxHeight };
    }

    // Função de colisão
    function checkCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circleRadius * 2;
    }

    // Resolver colisão (com troca de cor, forma e repulsão fluida)
    function resolveCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return; // Evitar divisão por zero

        const nx = dx / distance;
        const ny = dy / distance;

        // Física de colisão (rebote)
        const relativeVelocityX = sphere2.vx - sphere1.vx;
        const relativeVelocityY = sphere2.vy - sphere1.vy;
        const impulse = 2 * (relativeVelocityX * nx + relativeVelocityY * ny) / 2;

        sphere1.vx += impulse * nx * 0.9; // Rebote quase total
        sphere1.vy += impulse * ny * 0.9;
        sphere2.vx -= impulse * nx * 0.9;
        sphere2.vy -= impulse * ny * 0.9;

        // Força de repulsão suave
        const repulsionX = nx * repulsionForce;
        const repulsionY = ny * repulsionForce;
        sphere1.vx -= repulsionX;
        sphere1.vy -= repulsionY;
        sphere2.vx += repulsionX;
        sphere2.vy += repulsionY;

        // Redução mínima de velocidade após colisão
        sphere1.vx *= 0.95; // Redução de apenas 5%
        sphere1.vy *= 0.95;
        sphere2.vx *= 0.95;
        sphere2.vy *= 0.95;

        // Limitar velocidade máxima
        sphere1.vx = Math.max(-maxSpeed, Math.min(maxSpeed, sphere1.vx));
        sphere1.vy = Math.max(-maxSpeed, Math.min(maxSpeed, sphere1.vy));
        sphere2.vx = Math.max(-maxSpeed, Math.min(maxSpeed, sphere2.vx));
        sphere2.vy = Math.max(-maxSpeed, Math.min(maxSpeed, sphere2.vy));

        // Troca de cor
        const tempColor = sphere1.color;
        sphere1.color = sphere2.color;
        sphere2.color = tempColor;

        // Troca de forma
        const tempShape = sphere1.shape;
        sphere1.shape = getRandomShape();
        sphere2.shape = getRandomShape();

        // Aplicar estilos
        sphere1.element.style.backgroundColor = sphere1.color;
        sphere2.element.style.backgroundColor = sphere2.color;
        applyShapeAndSize(sphere1);
        applyShapeAndSize(sphere2);

        console.log(`Colisão: ${sphere1.element.id} virou ${sphere1.shape.name}, ${sphere2.element.id} virou ${sphere2.shape.name}`);
    }

    // Funções de arrastar
    function startDragging(sphere, x, y) {
        sphere.isDragging = true;
        sphere.isPaused = true;
        sphere.lastX = x;
        sphere.lastY = y;
        sphere.lastTime = performance.now();
        sphere.color = getRandomColorLocal();
        sphere.element.style.backgroundColor = sphere.color;
    }

    function moveDragging(sphere, x, y) {
        if (sphere.isDragging) {
            const bounds = getContainerBounds();
            sphere.x = Math.max(0, Math.min(x - circleRadius, bounds.maxWidth));
            sphere.y = Math.max(0, Math.min(y - circleRadius, bounds.maxHeight));
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

            sphere.vx = Math.max(-maxSpeed, Math.min(maxSpeed, (deltaX / timeDelta) * 0.05));
            sphere.vy = Math.max(-maxSpeed, Math.min(maxSpeed, (deltaY / timeDelta) * 0.05));

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

    // Listener para redimensionamento da janela
    window.addEventListener('resize', () => {
        circleRadius = getCircleRadius(); // Atualizar raio ao redimensionar
        spheres.forEach(sphere => {
            applyShapeAndSize(sphere); // Reaplicar tamanho responsivo
        });
    });

    // Função de animação
    function animate() {
        const bounds = getContainerBounds();

        spheres.forEach(sphere => {
            if (!sphere.isDragging && !sphere.isPaused) {
                sphere.x += sphere.vx;
                sphere.y += sphere.vy;

                // Colisão com as bordas do body
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

                // Atrito muito leve para desaceleração natural
                sphere.vx *= friction;
                sphere.vy *= friction;

                // Limitar velocidade máxima
                sphere.vx = Math.max(-maxSpeed, Math.min(maxSpeed, sphere.vx));
                sphere.vy = Math.max(-maxSpeed, Math.min(maxSpeed, sphere.vy));
            }

            sphere.element.style.left = `${sphere.x}px`;
            sphere.element.style.top = `${sphere.y}px`;
        });

        for (let i = 0; i < spheres.length; i++) {
            for (let j = i + 1; j < spheres.length; j++) {
                if (checkCollision(spheres[i], spheres[j])) {
                    resolveCollision(spheres[i], spheres[j]);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    console.log('Initial bounds:', getContainerBounds());
    console.log('Esferas inicializadas:', spheres);

    animate();
});







////////////////////////////////////////////
// Gradiente animado (otimizado)
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.sh-4');
    if (!section) {
        console.error('Elemento .sh-4 não encontrado!');
        return;
    }

    // Função para interpolar entre duas cores (mantida como no original)
    function calcular(cor1, cor2, progresso) {
        const ret = [];
        for (let i = 0; i < cor1.length; i++) {
            ret[i] = Math.round(cor2[i] * progresso + cor1[i] * (1 - progresso));
        }
        return ret;
    }

    // Função local para manter compatibilidade com calcular
    function getRandomColorLocal() {
        return getRandomColor('rgb'); // Usando a função global em formato RGB
    }

    // Cores iniciais em RGB (baseadas no seu CSS original)
    let origem1 = hexToRgb('#4BFFED'); // rgba(75, 255, 237, 1)
    let origem2 = hexToRgb('#202AEB'); // rgba(32, 42, 235, 1)
    let alvo1 = getRandomColorLocal(); // Próxima cor para camada 1
    let alvo2 = getRandomColorLocal(); // Próxima cor para camada 2
    let progresso = 0; // Progresso da transição
    let offset = 100; // Posição inicial para movimento (direita)

    // Função para atualizar o gradiente
    function updateGradient() {
        // Atualiza o progresso da transição de cores
        progresso += 0.005; // Ajuste para mais lento ou rápido
        if (progresso > 1) {
            progresso = 0;
            origem1 = alvo1;
            origem2 = alvo2;
            alvo1 = getRandomColorLocal();
            alvo2 = getRandomColorLocal();
        }

        // Calcula as cores atuais
        const cor1 = calcular(origem1, alvo1, progresso);
        const cor2 = calcular(origem2, alvo2, progresso);

        // Converte para formato RGB string
        const rgb1 = `rgb(${cor1.join(',')})`;
        const rgb2 = `rgb(${cor2.join(',')})`;

        // Movimento da direita para a esquerda
        offset -= 0.3; // Velocidade do movimento (ajuste conforme necessário)
        if (offset < -100) offset = 100; // Reseta para a direita

        // Calcula posições dinâmicas
        let pos1 = offset;
        let pos2 = offset + 70.7; // Diferença de 70.7% (82.4% - 11.7%) para manter a estrutura

        // Aplica o gradiente
        section.style.backgroundImage = `linear-gradient(150.4deg, ${rgb1} ${pos1}%, ${rgb2} ${pos2}%)`;

        // Continua a animação
        requestAnimationFrame(updateGradient);
    }

    // Inicia a animação
    updateGradient();
});