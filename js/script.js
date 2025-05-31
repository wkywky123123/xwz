document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png'
        // 'audio/bgm.mp3' // 如果bgm.mp3较大，建议加入预加载
    ];
    const progress = document.querySelector('.progress');
    const preloader = document.getElementById('preloader');
    const startButton = document.getElementById('start-button');
    const bgm = document.getElementById('bgm');

    let loaded = 0;

    if (resources.length === 0) { // 如果没有资源需要预加载
        document.querySelector('.progress-bar').style.display = 'none';
        document.getElementById('preload-text').style.display = 'none';
        startButton.classList.remove('hidden');
    } else {
        resources.forEach(url => {
            const res = url.endsWith('.mp3') ? new Audio() : new Image();
            res.onload = () => {
                loaded++;
                progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    document.querySelector('.progress-bar').style.display = 'none';
                    document.getElementById('preload-text').style.display = 'none';
                    startButton.classList.remove('hidden');
                }
            };
            res.onerror = () => { // 即使加载失败也继续
                loaded++;
                console.error(`资源加载失败: ${url}`);
                progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    document.querySelector('.progress-bar').style.display = 'none';
                    document.getElementById('preload-text').style.display = 'none';
                    startButton.classList.remove('hidden');
                }
            };
            if (url.endsWith('.mp3')) { // 对于音频，需要调用load方法
                res.oncanplaythrough = res.onload; // 或者用 oncanplaythrough
                res.load(); // 触发加载
            }
            res.src = url;
        });
    }


    // 页面控制系统
    const pages = document.querySelectorAll('.page');
    const pageContainer = document.querySelector('.page-container');
    let currentPage = 0;
    let isMusicPlaying = false;

    function triggerTextAnimation(pageElement) {
        const contentDiv = pageElement.querySelector('.content');
        if (contentDiv) {
            contentDiv.classList.remove('animate');
            setTimeout(() => {
                contentDiv.classList.add('animate');
            }, 0);
        }
    }

    function resetAllTextAnimations() {
        pages.forEach(page => {
            const contentDiv = page.querySelector('.content');
            if (contentDiv) {
                contentDiv.classList.remove('animate');
            }
        });
    }

    function changePage(newPageIndex) {
        if (newPageIndex < 0 || newPageIndex >= pages.length || newPageIndex === currentPage) {
            return; // 无效页码或当前页
        }

        resetAllTextAnimations();

        const oldPage = pages[currentPage];
        const newPage = pages[newPageIndex];

        oldPage.classList.remove('active');
        oldPage.classList.add('exit');

        // 清理旧页面的exit状态，以便它回到屏幕下方
        oldPage.addEventListener('transitionend', function handler() {
            if (!oldPage.classList.contains('active')) { // 确保它不是又被激活了
                 oldPage.classList.remove('exit');
            }
            oldPage.removeEventListener('transitionend', handler);
        }, { once: true });


        newPage.classList.remove('exit'); // 确保新页面没有exit状态
        newPage.classList.add('active');
        triggerTextAnimation(newPage);

        currentPage = newPageIndex;

        // 特殊逻辑：例如进入第二页自动播放音乐
        if (currentPage === 1 && !isMusicPlaying) {
            playMusic();
        }
    }

    function playMusic() {
        bgm.play().catch(error => {
            console.error('音频播放失败:', error);
            // alert('音频播放失败，请检查浏览器设置或刷新 (＞人＜;)');
        });
        document.getElementById('audio-control').textContent = '暂停';
        isMusicPlaying = true;
    }

    function pauseMusic() {
        bgm.pause();
        document.getElementById('audio-control').textContent = '播放';
        isMusicPlaying = false;
    }

    document.getElementById('audio-control').addEventListener('click', function() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 0) {
            changePage(currentPage - 1);
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < pages.length - 1) {
            changePage(currentPage + 1);
        }
    });

    startButton.addEventListener('click', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            if(preloader.parentNode) { // 确保 preloader 还在DOM中
                preloader.remove();
            }
            pages[0].classList.add('active'); // CSS会处理 #page1.active 的淡入
            triggerTextAnimation(pages[0]);
            playMusic(); // 点击开始按钮后播放音乐
        }, 500);
    });

    // 手势和点击翻页
    let touchstartY = 0;
    let touchendY = 0;
    const swipeThreshold = 50; // 最小滑动距离

    pageContainer.addEventListener('touchstart', e => {
        if (e.target.closest('#prev-page, #next-page, #audio-control, .falling-img')) { // 排除按钮和图片
            return;
        }
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });

    pageContainer.addEventListener('touchend', e => {
        if (e.target.closest('#prev-page, #next-page, #audio-control, .falling-img')) {
            return;
        }
        touchendY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const deltaY = touchendY - touchstartY;
        if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY < 0) { // 手指向上滑动 -> 下一页
                if (currentPage < pages.length - 1) {
                    changePage(currentPage + 1);
                }
            } else if (deltaY > 0) { // 手指向下滑动 -> 上一页
                if (currentPage > 0) {
                    changePage(currentPage - 1);
                }
            }
        }
    }

    pageContainer.addEventListener('click', function(e) {
        if (e.target.closest('#prev-page, #next-page, #audio-control, .falling-img, .highlight, .emphasis, h2, ul, li')) { // 排除按钮和可点击文本/图片
            return;
        }
        // 确保点击的是页面背景区域
        if (e.target === pageContainer || e.target.classList.contains('page') || e.target.classList.contains('content')) {
            if (currentPage < pages.length - 1) {
                 changePage(currentPage + 1);
            }
        }
    });

    // 初始状态：确保所有非活动页（除了page1）都在屏幕下方且透明
    pages.forEach((page, index) => {
        if (index !== 0) { // page1 由其ID选择器特殊处理
            page.style.transform = 'translateY(100%)';
            page.style.opacity = '0';
        } else { // page1 初始状态
            page.style.transform = 'translateY(0)';
            page.style.opacity = '0';
        }
    });

    window.addEventListener('error', function(e) {
        if (e.message.includes("Failed to load resource") || e.filename) {
            console.error('资源加载或脚本错误:', e.message, e.filename, e.lineno);
        }
    });
});