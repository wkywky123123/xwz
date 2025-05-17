const audio = document.getElementById('bgm');
const playBtn = document.getElementById('playBtn');
const volumeControl = document.getElementById('volume');
const progressBar = document.querySelector('.progress-bar');

// 播放/暂停控制
playBtn.addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
  playBtn.textContent = audio.paused ? '🎵 播放' : '⏸️ 暂停';
});

// 音量控制
volumeControl.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// 进度条更新
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
});

// 点击进度条跳转
const progressContainer = document.querySelector('.progress-container');
progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pos * audio.duration;
});