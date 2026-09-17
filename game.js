// สร้างฉาก 3D, กล้อง และตัวประมวลผลเรนเดอร์
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b16);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ระบบแสงสว่างในโลก 3D
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(20, 40, 20);
scene.add(dirLight);

// สร้างพื้นแผนที่ 3D (World Map)
const planeGeo = new THREE.PlaneGeometry(120, 120);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x1e3d2f, roughness: 0.9 });
const ground = new THREE.Mesh(planeGeo, planeMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// สร้างตัวละครหลัก (Aren)
const playerGeo = new THREE.BoxGeometry(1, 2, 1);
const playerMat = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.3 });
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.set(0, 1, 0);
scene.add(player);

// สร้างกลุ่มศัตรู 3D (Enemies)
const enemies = [];
for (let i = 0; i < 6; i++) {
    const enemyGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const enemyMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const enemy = new THREE.Mesh(enemyGeo, enemyMat);
    enemy.position.set((Math.random() - 0.5) * 50, 0.75, (Math.random() - 0.5) * 50);
    scene.add(enemy);
    enemies.push(enemy);
}

// ระบบควบคุมการกดปุ่ม (Input)
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// สถิติเกม
let playerHp = 100;
let playerLevel = 1;
let playerGold = 50;

// อัปเดต UI บนหน้าจอ
function updateHUD() {
    document.getElementById("hp-val").innerText = playerHp;
    document.getElementById("lv-val").innerText = playerLevel;
    document.getElementById("gold-val").innerText = playerGold;
}

// ลูปการทำงานหลักของเกม (Game Loop)
function animate() {
    requestAnimationFrame(animate);

    // การเคลื่อนที่ของตัวละครด้วย WASD
    const speed = 0.15;
    if (keys['w'] || keys['arrowup']) player.position.z -= speed;
    if (keys['s'] || keys['arrowdown']) player.position.z += speed;
    if (keys['a'] || keys['arrowleft']) player.position.x -= speed;
    if (keys['d'] || keys['arrowright']) player.position.x += speed;

    // ระบบกล้องติดตามตัวละคร 3D แบบมุมมองบุคคลที่สาม (TPS)
    camera.position.set(player.position.x, player.position.y + 7, player.position.z + 10);
    camera.lookAt(player.position.x, player.position.y, player.position.z);

    // AI ศัตรูเคลื่อนที่เข้าหาผู้เล่น
    enemies.forEach(enemy => {
        let dx = player.position.x - enemy.position.x;
        let dz = player.position.z - enemy.position.z;
        let dist = Math.hypot(dx, dz);
        if (dist < 20 && dist > 1.5) {
            enemy.position.x += (dx / dist) * 0.04;
            enemy.position.z += (dz / dist) * 0.04;
        }
    });

    renderer.render(scene, camera);
}

// ปรับขนาดหน้าจออัตโนมัติ
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

updateHUD();
animate();
