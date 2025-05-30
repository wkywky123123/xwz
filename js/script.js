document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png'
    ];
    const progress = document.querySelector('.progress');
    const preloader = document.getElementById('preloader');
    const startButton = document.getElementById('start-button');
    const bgm = document.getElementById('bgm');

    let loaded = 0;

    resources.forEach(url => {
        const res = url.endsWith('.mp3') ? new Audio() : new Image();
        res.onload = () => {
            loaded++;
            progress.style.width = (loaded / resources.length * 100) + '%';
            if (loaded === resources.length) {
                // 隐藏进度条和加载提示文字，但保留大标题
                document.querySelector('.progress-bar').style.display = 'none';
                document.getElementById('preload-text').style.display = 'none';
                startButton.classList.remove('hidden');
            }
        };
        res.onerror = () => {
            loaded++;
            console.error(`资源加载失败: ${url}`);
            alert(`资源加载失败: ${url}, 请刷新页面 (＞人＜;)`);
            progress.style.width = (loaded / resources.length * 100) + '%';
            if (loaded === resources.length) {
                // 隐藏进度条和加载提示文字，但保留大标题
                document.querySelector('.progress-bar').style.display = 'none';
                document.getElementById('preload-text').style.display = 'none';
                startButton.classList.remove('hidden');
            }
        };
        res.src = url;
    });

    // 页面控制系统
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    let isMusicPlaying = false;

    // 音乐播放控制
    document.getElementById('audio-control').addEventListener('click', function() {
        if (isMusicPlaying) {
            bgm.pause();
            this.textContent = '播放';
        } else {
            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
                alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
            });
            this.textContent = '暂停';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 翻页控制
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 0) {
            pages[currentPage].classList.add('exit');
            currentPage--;
            pages[currentPage].classList.remove('exit', 'active');
            setTimeout(() => {
                pages[currentPage].classList.add('active');
            }, 300);
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < pages.length - 1) {
            pages[currentPage].classList.add('exit');
            currentPage++;
            pages[currentPage].classList.remove('exit');
            setTimeout(() => {
                pages[currentPage].classList.add('active');
                if (currentPage === 1 && !isMusicPlaying) {
                    bgm.play().catch(error => {
                        console.error('音频播放失败:', error);
                        alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
                    });
                    document.getElementById('audio-control').textContent = '暂停';
                    isMusicPlaying = true;
                }
            }, 300);
        }
    });

    // 开始按钮点击事件
    startButton.addEventListener('click', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
            pages[0].classList.add('active');
            // 点击开始按钮后立即播放音乐
            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
                alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
            });
            document.getElementById('audio-control').textContent = '暂停';
            isMusicPlaying = true;
        }, 500);
    });

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('资源加载失败:', e.filename);
        alert('加载遇到问题，请刷新页面 (＞人＜;)');
    });
});
