document.addEventListener('DOMContentLoaded', function () {
  const sectors = [
    { color: '#f82', label: '10x Spin' },
    { color: '#000', label: '10 ETH' },
    { color: '#fb0', label: '1 ETH' },
    { color: '#0fb', label: '0.1 ETH' },
    { color: '#b0f', label: '400%' },
    { color: '#f0b', label: '200%' },
    { color: '#bf0', label: '0.01 ETH' }
  ];

  const rand = (m, M) => Math.random() * (M - m) + m;
  const spinEl = document.querySelector('#spin');
  const wheelCanvas = document.querySelector('#wheel');

  if (!wheelCanvas) {
    console.error("Canvas element with id 'wheel' not found.");
    return;
  }

  const ctx = wheelCanvas.getContext('2d');
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;

  const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  let angVel = 0; // Angular velocity
  let ang = 0; // Angle in radians

  const getIndex = () => Math.floor(sectors.length - (ang / TAU) * sectors.length) % sectors.length;

  function drawSector(sector, i) {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
  }

  function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    spinEl.textContent = !angVel ? 'Free SPIN' : sector.label;
    spinEl.style.background = sector.color;
  }

  function frame() {
    if (!angVel) return;
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
  }

  function engine() {
    frame();
    requestAnimationFrame(engine);
  }

  function init() {
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine
    spinEl.addEventListener('click', () => {
      if (!angVel) angVel = rand(0.25, 0.45);
    });
  }

  init();
});
