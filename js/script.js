document.addEventListener('DOMContentLoaded', () => {
    // 初始化配置
    const CONFIG = {
        CLICK_COOLDOWN: 800,     // 点击防抖时间
        SWIPE_THRESHOLD: 50,     // 滑动判定阈值
        AUTO_PLAY_PAGE: 1        // 自动播放起始页
    };

    // 状态变量
    let currentPage = 0;
    let isScrolling = false;
    let isMusicPlaying = false;
    let lastClickTime = 0;
    let autoPlayAttempted = false;

    // DOM元素
    const pages = document.querySelectorAll('.page');
    const bgm = document.getElementById('bgm');
    const dots = document.querySelectorAll('.page-dot');
    const musicBtn = document.createElement('button');
    const resources = [
        'images/boat.png',
        'images/gift.png'
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
                    attemptAutoPlay(); // 预加载完成后尝试播放
                }, 500);
            }
        };
        res.src = url;
    });

    // 音乐控制模块
    musicBtn.id = 'musicBtn';
    musicBtn.className = 'music-control';
    musicBtn.innerHTML = '🎵 播放';
    document.body.appendChild(musicBtn);

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

    // 自动播放逻辑
    function attemptAutoPlay() {
        if(!autoPlayAttempted && currentPage >= CONFIG.AUTO_PLAY_PAGE) {
            autoPlayAttempted = true;
            bgm.play().then(() => {
                isMusicPlaying = true;
                musicBtn.innerHTML = '⏸️ 暂停';
                musicBtn.classList.add('playing');
            }).catch(() => {
                musicBtn.innerHTML = '▶️ 点击播放';
            });
        }
    }

    // 事件系统
    musicBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMusic(e);
    });

    // 全局点击处理
    document.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime < CONFIG.CLICK_COOLDOWN) return;
        lastClickTime = now;

        const isInteractive = e.target.closest('button, input, textarea, a');
        const isMusicControl = e.target.closest('.music-control');
        
        if (!isInteractive && !isMusicControl && currentPage < pages.length - 1) {
            handleNavigation('down');
        }
        
        // 首次点击尝试自动播放
        if(!autoPlayAttempted) attemptAutoPlay();
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
        
        if (!isMusicControl && Math.abs(diff) > CONFIG.SWIPE_THRESHOLD) {
            const direction = diff > 0 ? 'up' : 'down';
            handleNavigation(direction);
        }
    });

    // 页面指示器
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            if(index !== currentPage) {
                switchPage(index);
                if(index >= CONFIG.AUTO_PLAY_PAGE) attemptAutoPlay();
            }
        });
    });

    // 导航系统
    function handleNavigation(direction) {
        let newPage = currentPage;
        if (direction === 'down' && currentPage < pages.length - 1) newPage++;
        if (direction === 'up' && currentPage > 0) newPage--;
        if(newPage !== currentPage) switchPage(newPage);
    }

    function switchPage(newPage) {
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
        attemptAutoPlay(); // 页面切换时尝试播放
    }

    function updateIndicator() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    // 初始化
    function initPages() {
        pages[0].classList.add('active');
        updateIndicator();
        const shield = document.createElement('div');
        shield.className = 'click-shield';
        document.body.appendChild(shield);
    }

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('Error:', e.message);
        alert('加载遇到问题，请刷新页面 (＞人＜;)');
    });
});