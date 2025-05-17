document.querySelector('img[alt="gift"]').addEventListener('click', () => {
  const fireworks = document.createElement('div');
  fireworks.className = 'firework';
  document.body.appendChild(fireworks);
  setTimeout(() => fireworks.remove(), 1000);
});