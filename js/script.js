document.addEventListener('DOMContentLoaded', () => {
    // 初始化变量
    let currentPage = 0;
    let isScrolling = false;
    let isMusicPlaying = false;
    let lastClickTime = 0;
    const CLICK_COOLDOWN = 800;
    const SWIPE_THRESHOLD = 50;
    const pages = document.querySelectorAll('.page');
    const bgm = document.getElementById('bgm');
    const dots = document.querySelectorAll('.page-dot');
    const resources = [
        'images/boat.png',
        'images/gift.png',
        'audio/bgm.mp3'
    ];

    // 预加载系统
    const progress = document.querySelector('.progress');
    const preloader = document.getElementById('preloader');

    let loaded = 0;
    resources.forEach(url => {
        const res = url.endsWith('.mp3') ? new Audio() : new Image();
        res.onload = res.onerror = () => {
            loaded++;
            progress.style.width = (loaded/resources.length*100) + '%';
            if(loaded === resources.length) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    initPages();
                }, 500);
            }
        };
        res.src = url;
    });

    // 创建音乐控制按钮
    const musicBtn = document.createElement('button');
    musicBtn.id = 'musicBtn';
    musicBtn.className = 'music-control';
    musicBtn.innerHTML = '🎵 播放';
    document.body.appendChild(musicBtn);

    // 音乐控制功能
    const toggleMusic = (e) => {
        if(e) e.stopPropagation();
        isMusicPlaying = !isMusicPlaying;
        musicBtn.innerHTML = isMusicPlaying ? '⏸️ 暂停' : '▶️ 播放';
        musicBtn.classList.toggle('playing', isMusicPlaying);
        if(isMusicPlaying) {
            bgm.play().catch(() => {
                musicBtn.textContent = '▶️ 点击播放';
                isMusicPlaying = false;
            });
        } else {
            bgm.pause();
        }
    };

    // 事件监听
    musicBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMusic(e);
    });

    // 全局点击处理
    document.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime < CLICK_COOLDOWN) return;
        lastClickTime = now;

        const isInteractive = e.target.closest('button, input, textarea, a');
        const isMusicControl = e.target.closest('.music-control');
        
        if (!isInteractive && !isMusicControl && currentPage < pages.length - 1) {
            handleNavigation('down');
        }
    });

    // 移动端触摸处理
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchEndY - touchStartY;
        const isMusicControl = e.target.closest('.music-control');
        
        if (!isMusicControl && Math.abs(diff) > SWIPE_THRESHOLD) {
            const direction = diff > 0 ? 'up' : 'down';
            handleNavigation(direction);
        }
    });

    // 页面控制核心逻辑
    const updateIndicator = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    };

    const switchPage = (newPage) => {
        const prevPage = currentPage;
        currentPage = newPage;

        pages[prevPage].classList.add('exit');
        pages[prevPage].classList.remove('active');
        
        pages[currentPage].classList.add('active');
        pages[currentPage].classList.remove('exit');

        setTimeout(() => {
            const textLines = pages[currentPage].querySelectorAll('.text-line');
            textLines.forEach((line, index) => {
                line.style.animationDelay = `${index*0.2}s`;
            });
            pages[currentPage].classList.add('animate');
        }, 300);

        updateIndicator();
    };

    const handleNavigation = (direction) => {
        let newPage = currentPage;
        if (direction === 'down' && currentPage < pages.length - 1) newPage++;
        if (direction === 'up' && currentPage > 0) newPage--;
        if(newPage !== currentPage) switchPage(newPage);
    };

    // 初始化
    const initPages = () => {
        pages[0].classList.add('active');
        updateIndicator();
        // 添加移动端保护层
        const shield = document.createElement('div');
        shield.className = 'click-shield';
        document.body.appendChild(shield);
    };

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('Error:', e.message);
        alert('加载遇到问题，请刷新页面 (＞人＜;)');
    });
});