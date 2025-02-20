const colors = {
    blackToGray: ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#fff'],
    red: ['#8B0000', '#FF0000', '#FF6347', '#FF7F7F', '#FFA07A'],
    blue: ['#00008B', '#0000FF', '#1E90FF', '#87CEFA', '#ADD8E6'],
    green: ['#006400', '#00FF00', '#32CD32', '#98FB98', '#90EE90'],
    yellow: ['#FFD700', '#FFFF00', '#FFFFE0', '#FFFACD', '#FAFAD2'],
    violet: ['#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD']
};

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function getRandomColor(format = 'hex') {
    const colorGroups = Object.values(colors);
    const randomGroup = colorGroups[Math.floor(Math.random() * colorGroups.length)];
    const randomColor = randomGroup[Math.floor(Math.random() * randomGroup.length)];
    return format === 'rgb' ? hexToRgb(randomColor) : randomColor;
}

function getRandomVelocity() {
    return (Math.random() - 0.5) * 4;
}

async function fetchComplementaryColor(hex) {
    try {
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
            return getRandomColor('hex');
        }
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex.slice(1)}`);
        const data = await response.json();
        if (!data || !data.complementary || !data.complementary.hex || !data.complementary.hex.value) {
            throw new Error('Resposta da API inválida');
        }
        return data.complementary.hex.value;
    } catch (error) {
        return getRandomColor('hex');
    }
}

// Seção de Áudio com Web Audio API
let audioContext = null;
let plockBuffer = null;
let isAudioUnlocked = false;

function unlockAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadPlockSound();
    isAudioUnlocked = true;
    console.log('AudioContext desbloqueado');
}

async function loadPlockSound() {
    try {
        const audioPath = './assets/sounds/plock.m4a'; // Caminho explícito
        console.log('Carregando áudio de:', audioPath);
        const response = await fetch(audioPath);
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        console.log('ArrayBuffer recebido, decodificando...');
        plockBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Áudio carregado com sucesso, plockBuffer pronto');
    } catch (error) {
        console.error('Falha ao carregar plock.m4a:', error);
    }
}

function playPlockSound() {
    if (!audioContext) console.warn('AudioContext não inicializado');
    if (!plockBuffer) console.warn('plockBuffer não carregado');
    if (!isAudioUnlocked) console.warn('Áudio bloqueado: interação do usuário necessária');
    if (!audioContext || !plockBuffer || !isAudioUnlocked) {
        console.warn('Áudio não reproduzido: contexto ou buffer não pronto');
        return;
    }
    const source = audioContext.createBufferSource();
    source.buffer = plockBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    console.log('Som "plock" reproduzido');
}

// Função para Esferas de Explosão (Corrigida com Maior Dispersão)
function createExplosionSpheres(sphere1, sphere2, circleRadius) {
    const explosionCount = 10; // Sempre 10 esferas
    const shapes = [
        { name: 'circle', style: { borderRadius: '50%', clipPath: null } },
        { name: 'square', style: { borderRadius: '0', clipPath: null } },
        { name: 'triangle', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } },
        { name: 'diamond', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } },
        { name: 'ellipse', style: { borderRadius: '50% / 75%', clipPath: null } },
        { name: 'trapezoid', style: { clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', borderRadius: '0' } },
        { name: 'pentagon', style: { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', borderRadius: '0' } },
        { name: 'tetrahedron', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } },
        { name: 'cube', style: { borderRadius: '0', clipPath: null } },
        { name: 'octahedron', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } }
    ];

    console.log('Criando 10 esferas de explosão para colisão entre', sphere1.element.id, 'e', sphere2.element.id);

    // Embaralhar as formas para garantir variedade
    const shuffledShapes = shapes.sort(() => Math.random() - 0.5).slice(0, explosionCount);

    for (let i = 0; i < explosionCount; i++) {
        const tempSphere = document.createElement('div');
        tempSphere.className = 'circle temporary';
        const shape = shuffledShapes[i];

        // Posição inicial com dispersão dobrada (2x maior)
        const offsetX = (Math.random() - 0.5) * 200; // Dispersão de ±200px (era ±100)
        const offsetY = (Math.random() - 0.5) * 200; // Dispersão de ±200px (era ±100)
        const centerX = (sphere1.x + sphere2.x) / 2;
        const centerY = (sphere1.y + sphere2.y) / 2;
        tempSphere.style.position = 'fixed';
        tempSphere.style.left = `${centerX + offsetX}px`;
        tempSphere.style.top = `${centerY + offsetY}px`;

        // Estilo da esfera
        tempSphere.style.backgroundColor = getRandomColor('hex');
        tempSphere.style.width = `${circleRadius * 0.6}px`;
        tempSphere.style.height = `${circleRadius * 0.6}px`;
        tempSphere.style.borderRadius = shape.style.borderRadius || '0';
        if (shape.style.clipPath) tempSphere.style.clipPath = shape.style.clipPath;
        tempSphere.style.zIndex = '9996';
        tempSphere.style.opacity = '1';
        tempSphere.style.transition = 'opacity 2.5s ease-out'; // 2,5 segundos

        document.body.appendChild(tempSphere);
        console.log(`Esfera temporária ${i + 1} criada: forma=${shape.name}, x=${centerX + offsetX}, y=${centerY + offsetY}`);

        // Animação: esmaece após um atraso
        setTimeout(() => {
            tempSphere.style.opacity = '0';
            console.log(`Esfera temporária ${i + 1} começou a esmaecer`);
        }, Math.random() * 500); // Atraso de 0 a 500ms

        // Remove após a animação
        setTimeout(() => {
            tempSphere.remove();
            console.log(`Esfera temporária ${i + 1} removida`);
        }, 2500); // Duração total de 2,5s
    }
}

// Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuSquare = document.getElementById('menu-square');
    const menu = document.getElementById('menu-toggle');
    const originalSrc = menuSquare.src;
    const closeSrc = './assets/img/menu-square-X.svg';

    menuSquare.addEventListener('click', function () {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            menuSquare.src = closeSrc;
            menu.style.display = 'flex';
        } else {
            menuSquare.src = originalSrc;
            menu.style.display = 'none';
        }
    });

    if (window.innerWidth <= 768) {
        menu.style.display = 'none';
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            menu.style.display = '';
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

// Efeito de Pulsação
function pulseEffect() {
    const elements = document.querySelectorAll('.box-content-img-home, .box-content-img-2');
    elements.forEach(element => {
        let scale = 1;
        let brightness = 1;
        let pulsingUp = false;
        setInterval(() => {
            if (pulsingUp) {
                scale = Math.min(scale + 0.005, 1.05);
                brightness = Math.min(brightness + 0.05, 1.2);
                if (scale >= 1.05) pulsingUp = false;
            } else {
                scale = Math.max(scale - 0.005, 0.95);
                brightness = Math.max(brightness - 0.05, 0.8);
                if (scale <= 0.95) pulsingUp = true;
            }
            element.style.transform = `scale(${scale})`;
            element.style.filter = `brightness(${brightness})`;
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', pulseEffect);

// Efeito de Onda
function waveEffect() {
    const elements = document.querySelectorAll('.box-content-img-3, .box-content-img-4, .box-content-img-5, .box-content-img-6');
    const amplitude = 20;
    const speed = 0.05;
    elements.forEach((element, index) => {
        let time = index * Math.PI / 2;
        const initialY = element.offsetTop;
        setInterval(() => {
            const y = initialY + Math.sin(time) * amplitude;
            element.style.transform = `translateY(${y - initialY}px)`;
            time += speed;
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', waveEffect);

// Transição de Cor por Letra
function colorTransitionByLetter() {
    const textElements = document.querySelectorAll('.s-hero .box-text h2, .s-hero .box-text p, .wrapper-box h2, .wrapper-box p, .menu a');
    function getRandomColorLocal() {
        return getRandomColor('hex');
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
                counter = 0;
            }
        }, 3000 / letters.length);
        element.innerHTML = html;
    });
}

document.addEventListener('DOMContentLoaded', colorTransitionByLetter);

// Cursor Personalizado
function customCursor() {
    if (!document.body) return;
    const cursor = document.createElement('div');
    const trail = [];
    const trailLength = 20;
    let positions = [];
    Object.assign(cursor.style, {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${getRandomColor('hex')}`,
        backgroundColor: getRandomColor('hex'),
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '9999',
        top: '0px',
        left: '0px',
        transition: 'transform 0.1s ease',
        display: 'block'
    });
    document.body.appendChild(cursor);
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
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX - 10;
        const y = e.clientY - 10;
        cursor.style.transform = `translate(${x}px, ${y}px)`;
        const newColor = getRandomColor('hex');
        cursor.style.border = `2px solid ${newColor}`;
        cursor.style.backgroundColor = newColor;
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
    document.body.style.cursor = 'none';
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    customCursor();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        customCursor();
    });
}

// Esferas Animadas
document.addEventListener('DOMContentLoaded', () => {
    const defaultRadius = 64;
    const mobileRadius = 32;
    const mobileBreakpoint = 768;
    const repulsionForce = 2;
    const maxSpeed = 10;
    const friction = 0.995;
    const minSpeedThreshold = 0.5;

    function getCircleRadius() {
        return window.innerWidth <= mobileBreakpoint ? mobileRadius : defaultRadius;
    }

    let circleRadius = getCircleRadius();

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

    const shapes = [
        { name: 'circle', style: { borderRadius: '50%', clipPath: null } },
        { name: 'square', style: { borderRadius: '0', clipPath: null } },
        { name: 'triangle', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } },
        { name: 'diamond', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } },
        { name: 'ellipse', style: { borderRadius: '50% / 75%', clipPath: null } },
        { name: 'trapezoid', style: { clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', borderRadius: '0' } },
        { name: 'pentagon', style: { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', borderRadius: '0' } },
        { name: 'tetrahedron', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', borderRadius: '0' } },
        { name: 'cube', style: { borderRadius: '0', clipPath: null } },
        { name: 'octahedron', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', borderRadius: '0' } },
        { name: 'dodecahedron', style: { clipPath: 'polygon(50% 0%, 90% 38%, 72% 100%, 28% 100%, 10% 38%)', borderRadius: '0' } },
        { name: 'icosahedron', style: { clipPath: 'polygon(50% 0%, 85% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 15% 30%)', borderRadius: '0' } }
    ];

    function getRandomShape() {
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    const spheres = circles.map(circle => {
        if (!circle) return null;
        const initialShape = shapes[0];
        return {
            element: circle,
            x: 0,
            y: 0,
            vx: getRandomVelocity(),
            vy: getRandomVelocity(),
            color: getRandomColor('hex'),
            shape: initialShape,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            lastTime: 0,
            isPaused: false
        };
    }).filter(sphere => sphere !== null);

    if (spheres.length === 0) return;

    function applyShapeAndSize(sphere) {
        const { style } = sphere.shape;
        sphere.element.style.borderRadius = style.borderRadius;
        sphere.element.style.clipPath = style.clipPath;
        const size = circleRadius * 2;
        sphere.element.style.width = `${size}px`;
        sphere.element.style.height = `${size}px`;
    }

    spheres.forEach(sphere => {
        const bounds = getContainerBounds();
        sphere.x = Math.random() * bounds.maxWidth;
        sphere.y = Math.random() * bounds.maxHeight;
        sphere.element.style.position = 'fixed';
        sphere.element.style.left = `${sphere.x}px`;
        sphere.element.style.top = `${sphere.y}px`;
        sphere.element.style.backgroundColor = sphere.color;
        applyShapeAndSize(sphere);
        sphere.element.style.zIndex = '9997';
        sphere.element.style.opacity = '1';
        sphere.element.style.display = 'block';
        sphere.element.style.cursor = 'pointer';
        sphere.element.style.pointerEvents = 'auto';
    });

    function getContainerBounds() {
        circleRadius = getCircleRadius();
        const maxWidth = Math.max(0, window.innerWidth - circleRadius * 2);
        const maxHeight = Math.max(0, window.innerHeight - circleRadius * 2);
        return { maxWidth, maxHeight };
    }

    function checkCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circleRadius * 2;
    }

    async function resolveCollision(sphere1, sphere2) {
        const dx = sphere2.x - sphere1.x;
        const dy = sphere2.y - sphere1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const nx = dx / distance;
        const ny = dy / distance;

        const relativeVelocityX = sphere2.vx - sphere1.vx;
        const relativeVelocityY = sphere2.vy - sphere1.vy;
        const impulse = 2 * (relativeVelocityX * nx + relativeVelocityY * ny) / 2;

        sphere1.vx += impulse * nx * 0.9;
        sphere1.vy += impulse * ny * 0.9;
        sphere2.vx -= impulse * nx * 0.9;
        sphere2.vy -= impulse * ny * 0.9;

        const repulsionX = nx * repulsionForce;
        const repulsionY = ny * repulsionForce;
        sphere1.vx -= repulsionX;
        sphere1.vy -= repulsionY;
        sphere2.vx += repulsionX;
        sphere2.vy += repulsionY;

        sphere1.vx *= 0.95;
        sphere1.vy *= 0.95;
        sphere2.vx *= 0.95;
        sphere2.vy *= 0.95;

        sphere1.vx = Math.max(-maxSpeed, Math.min(maxSpeed, sphere1.vx));
        sphere1.vy = Math.max(-maxSpeed, Math.min(maxSpeed, sphere1.vy));
        sphere2.vx = Math.max(-maxSpeed, Math.min(maxSpeed, sphere2.vx));
        sphere2.vy = Math.max(-maxSpeed, Math.min(maxSpeed, sphere2.vy));

        const newColor1 = await fetchComplementaryColor(sphere1.color);
        const newColor2 = await fetchComplementaryColor(sphere2.color);
        sphere1.color = newColor1;
        sphere2.color = newColor2;

        const tempShape = sphere1.shape;
        sphere1.shape = getRandomShape();
        sphere2.shape = getRandomShape();

        sphere1.element.style.backgroundColor = sphere1.color;
        sphere2.element.style.backgroundColor = sphere2.color;
        applyShapeAndSize(sphere1);
        applyShapeAndSize(sphere2);

        createExplosionSpheres(sphere1, sphere2, circleRadius);
        playPlockSound();
    }

    function startDragging(sphere, x, y) {
        sphere.isDragging = true;
        sphere.isPaused = true;
        sphere.lastX = x;
        sphere.lastY = y;
        sphere.lastTime = performance.now();
        sphere.color = getRandomColor('hex');
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

    window.addEventListener('resize', () => {
        circleRadius = getCircleRadius();
        spheres.forEach(sphere => {
            applyShapeAndSize(sphere);
        });
    });

    function animate() {
        const bounds = getContainerBounds();

        spheres.forEach(sphere => {
            if (!sphere.isDragging && !sphere.isPaused) {
                sphere.x += sphere.vx;
                sphere.y += sphere.vy;

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

                sphere.vx *= friction;
                sphere.vy *= friction;

                const totalSpeed = Math.abs(sphere.vx) + Math.abs(sphere.vy);
                if (totalSpeed < minSpeedThreshold) {
                    sphere.vx = getRandomVelocity();
                    sphere.vy = getRandomVelocity();
                }

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

    animate();
});

// Gradiente Animado
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.sh-4');
    if (!section) return;

    function calcular(cor1, cor2, progresso) {
        const ret = [];
        for (let i = 0; i < cor1.length; i++) {
            ret[i] = Math.round(cor2[i] * progresso + cor1[i] * (1 - progresso));
        }
        return ret;
    }

    function getRandomColorLocal() {
        return getRandomColor('rgb');
    }

    let origem1 = hexToRgb('#4BFFED');
    let origem2 = hexToRgb('#202AEB');
    let alvo1 = getRandomColorLocal();
    let alvo2 = getRandomColorLocal();
    let progresso = 0;
    let offset = 100;

    function updateGradient() {
        progresso += 0.005;
        if (progresso > 1) {
            progresso = 0;
            origem1 = alvo1;
            origem2 = alvo2;
            alvo1 = getRandomColorLocal();
            alvo2 = getRandomColorLocal();
        }

        const cor1 = calcular(origem1, alvo1, progresso);
        const cor2 = calcular(origem2, alvo2, progresso);

        const rgb1 = `rgb(${cor1.join(',')})`;
        const rgb2 = `rgb(${cor2.join(',')})`;

        offset -= 0.3;
        if (offset < -100) offset = 100;

        let pos1 = offset;
        let pos2 = offset + 70.7;

        section.style.backgroundImage = `linear-gradient(150.4deg, ${rgb1} ${pos1}%, ${rgb2} ${pos2}%)`;

        requestAnimationFrame(updateGradient);
    }

    updateGradient();
});

// Desbloqueio de Áudio
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    const audioPrompt = document.createElement('div');
    audioPrompt.innerText = 'Clique ou toque na tela para ativar o som!';
    audioPrompt.style.position = 'fixed';
    audioPrompt.style.top = '10px';
    audioPrompt.style.left = '50%';
    audioPrompt.style.transform = 'translateX(-50%)';
    audioPrompt.style.background = 'rgba(0, 0, 0, 0.7)';
    audioPrompt.style.color = '#fff';
    audioPrompt.style.padding = '10px';
    audioPrompt.style.zIndex = '10000';
    document.body.appendChild(audioPrompt);

    function removePrompt() {
        if (isAudioUnlocked) {
            audioPrompt.remove();
            document.removeEventListener('click', removePrompt);
            document.removeEventListener('touchstart', removePrompt);
        }
    }
    document.addEventListener('click', removePrompt);
    document.addEventListener('touchstart', removePrompt);
});