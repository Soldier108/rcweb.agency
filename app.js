/* ============================================================
   rcweb.agency — JavaScript (3D + Animations + Interactivity)
   ============================================================ */

// ── THREE.JS 3D BACKGROUND (BRIGHT THEME) ──────────────────
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const geometries = [];

function createMesh(geometry, color, x, y, z, scale = 1, opacity = 0.18) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    wireframe: false,
    metalness: 0.4,
    roughness: 0.3,
  });
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  mesh.scale.setScalar(scale);
  scene.add(mesh);
  geometries.push(mesh);
  return mesh;
}

// Floating 3D shapes — bright vivid colors
createMesh(new THREE.TorusGeometry(4, 1.2, 16, 80),    0x4f46e5, -18,  8, -10, 1.2, 0.22);
createMesh(new THREE.IcosahedronGeometry(3, 1),          0x7c3aed,  18, -5, -15, 1.0, 0.20);
createMesh(new THREE.OctahedronGeometry(2.5, 0),         0x3b82f6, -10,-12, -20, 1.3, 0.18);
createMesh(new THREE.TetrahedronGeometry(3, 0),          0xe11d7a,  20, 12, -18, 0.8, 0.20);
createMesh(new THREE.TorusKnotGeometry(2.5, 0.7, 80,12), 0x7c3aed,   8,-15, -25, 0.9, 0.16);
createMesh(new THREE.SphereGeometry(2, 32, 32),          0x0ea5e9, -22, -4, -12, 0.8, 0.18);
createMesh(new THREE.BoxGeometry(3, 3, 3),               0x4f46e5,  25,  3, -22, 0.7, 0.14);
createMesh(new THREE.DodecahedronGeometry(2, 0),         0xf97316,  -5, 18, -18, 0.6, 0.16);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0x4f46e5, 2.5);
dirLight1.position.set(10, 10, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xe11d7a, 2);
dirLight2.position.set(-10, -5, 8);
scene.add(dirLight2);

const pointLight = new THREE.PointLight(0x7c3aed, 2.5, 50);
pointLight.position.set(0, 0, 15);
scene.add(pointLight);

// Particles — indigo dots
const particleCount = 180;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 80;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0x4f46e5, size: 0.18, transparent: true, opacity: 0.45 });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Mouse influence
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

// Animation loop
const clock = new THREE.Clock();
function animate3D() {
  requestAnimationFrame(animate3D);
  const t = clock.getElapsedTime();

  geometries.forEach((mesh, i) => {
    mesh.rotation.x = t * 0.12 * (i % 2 === 0 ? 1 : -1);
    mesh.rotation.y = t * 0.08 * (i % 3 === 0 ? 1 : -0.7);
    mesh.position.y += Math.sin(t * 0.4 + i) * 0.003;
  });

  particles.rotation.y = t * 0.02;
  particles.rotation.x = t * 0.01;

  camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate3D();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ── CUSTOM CURSOR ───────────────────────────────────────────
const cursorEl = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let cx = 0, cy = 0, dx = 0, dy = 0;

document.addEventListener('mousemove', (e) => {
  dx = e.clientX;
  dy = e.clientY;
  cursorDot.style.left = dx + 'px';
  cursorDot.style.top = dy + 'px';
});

function animateCursor() {
  cx += (dx - cx) * 0.12;
  cy += (dy - cy) * 0.12;
  cursorEl.style.left = cx + 'px';
  cursorEl.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .glass-card, .feature-item, .service-card, .wa-float').forEach(el => {
  el.addEventListener('mouseenter', () => cursorEl.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorEl.classList.remove('hovered'));
});


// ── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTop.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


// ── TYPED ANIMATION ─────────────────────────────────────────
const phrases = [
  'Meta Ads',
  'High ROI Campaigns',
  'Web Development',
  'Performance Marketing',
  'Instagram Ads',
  'Your Brand'
];
const typedEl = document.getElementById('typed');
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 300;
  }
  setTimeout(typeLoop, speed);
}
typeLoop();


// ── COUNTER ANIMATION ───────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const heroRect = document.querySelector('.hero-stats').getBoundingClientRect();
  if (heroRect.top < window.innerHeight * 0.9) {
    countersStarted = true;
    counters.forEach(el => animateCounter(el, parseInt(el.dataset.target)));
  }
}
window.addEventListener('scroll', startCounters);
startCounters();


// ── AOS — ANIMATE ON SCROLL ─────────────────────────────────
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, i * 80);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObserver.observe(el));


// ── 3D CARD PARALLAX ────────────────────────────────────────
const card3d = document.getElementById('card-3d');
const heroSection = document.getElementById('hero');

heroSection.addEventListener('mousemove', (e) => {
  if (!card3d) return;
  const rect = heroSection.getBoundingClientRect();
  const cx2 = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const cy2 = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  card3d.style.transform = `
    perspective(1000px)
    rotateY(${cx2 * 8}deg)
    rotateX(${-cy2 * 6}deg)
    translateZ(10px)
  `;
});

heroSection.addEventListener('mouseleave', () => {
  if (!card3d) return;
  card3d.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  card3d.style.transition = 'transform 0.6s ease';
});


// ── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ── FORM SUBMIT ─────────────────────────────────────────────
function handleSubmit() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;

  if (!name || !phone || !email || !service) {
    alert('Please fill in all required fields 😊');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>✓ Submitted!</span>';
    document.getElementById('form-success').classList.remove('hidden');
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('service').value = '';
    document.getElementById('budget').value = '';
    setTimeout(() => {
      btn.innerHTML = '<span>Book Free Strategy Call</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.disabled = false;
    }, 3000);
  }, 1500);
}


// ── NAVBAR ACTIVE LINK ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
  });
  navLinkEls.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#8b5cf6';
      link.style.background = 'rgba(139, 92, 246, 0.1)';
    }
  });
});


// ── SERVICE CARDS HOVER GLOW ────────────────────────────────
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});


// ── PAGE LOAD ANIMATIONS ────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});
