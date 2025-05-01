document.addEventListener('DOMContentLoaded', () => {
    // 初始化变量
    let currentPage = 0;
    let isScrolling = false;
    let isMusicPlaying = false;
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

    // 音乐控制功能
    const musicBtn = document.createElement('button');
    musicBtn.id = 'musicBtn';
    musicBtn.className = 'music-control';
    musicBtn.innerHTML = '🎵 播放';
    document.body.appendChild(musicBtn);

    const toggleMusic = () => {
        isMusicPlaying = !isMusicPlaying;
        musicBtn.innerHTML = isMusicPlaying ? '⏸️ 暂停' : '▶️ 播放';
        musicBtn.classList.toggle('playing', isMusicPlaying);
        isMusicPlaying ? bgm.play().catch(() => {
            musicBtn.textContent = '▶️ 点击播放';
            isMusicPlaying = false;
        }) : bgm.pause();
    };
    musicBtn.addEventListener('click', toggleMusic);

    // 页面控制系统
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

        if(currentPage >= 1 && !isMusicPlaying) {
            toggleMusic();
        }

        updateIndicator();
    };

    // 事件监听
    let touchStartY = 0;
    
    window.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            isScrolling = true;
            const direction = e.deltaY > 0 ? 'down' : 'up';
            handleNavigation(direction);
            setTimeout(() => isScrolling = false, 800);
        }
    });

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchEndY - touchStartY;
        if(Math.abs(diff) > 50) {
            const direction = diff > 0 ? 'up' : 'down';
            handleNavigation(direction);
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => index !== currentPage && switchPage(index));
    });

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
        document.body.addEventListener('click', () => handleNavigation('down'));
    };

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('Error:', e.message);
        alert('加载遇到问题，请刷新页面 (＞人＜;)');
    });
});