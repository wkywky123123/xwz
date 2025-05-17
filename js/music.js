const audio = document.getElementById('bgm');
const playBtn = document.getElementById('playBtn');
const volumeControl = document.getElementById('volume');

playBtn.addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
  playBtn.textContent = audio.paused ? '🎵 播放' : '⏸️ 暂停';
});

volumeControl.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});