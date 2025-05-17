const audio = new Audio('audio/bgmusic.mp3');
document.querySelector('.music-btn').addEventListener('click', () => {
  audio.paused ? audio.play() : audio.pause();
});