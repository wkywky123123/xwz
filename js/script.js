document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png',
        'images/111.jpg'
    ];
    const progress = document.querySelector('.progress');
    const preloader = document.getElementById('preloader');
    const startButton = document.getElementById('start-button');
    const bgm = document.getElementById('bgm');

    let loaded = 0;

    // --- 新增：函数用于隐藏预加载文本和进度条，并显示开始按钮 ---
    function completePreloading() {
        if (document.querySelector('.progress-bar')) {
            document.querySelector('.progress-bar').style.display = 'none';
        }
        const preloadMessages = document.querySelectorAll('.preload-message'); // 获取所有class为preload-message的元素
        preloadMessages.forEach(message => {
            message.style.display = 'none'; // 隐藏每一个消息
        });
        if (startButton) {
            startButton.classList.remove('hidden');
        }
    }
    // --- 结束新增函数 ---

    if (resources.length === 0) {
        if (progress) progress.style.width = '100%';
        completePreloading(); // 调用新函数
    } else {
        resources.forEach(url => {
            const res = new Image();
            res.onload = () => {
                loaded++;
                if (progress) progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    completePreloading(); // 调用新函数
                }
            };
            res.onerror = () => {
                loaded++;
                console.error(`资源加载失败: ${url}`);
                if (progress) progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    completePreloading(); // 调用新函数
                }
            };
            res.src = url;
        });
    }

    // 页面控制系统
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    let isMusicPlaying = false;
    let isPageTransitioning = false;
    const pageTransitionAnimationTime = 800;

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

    function showPrevPage() {
        if (document.getElementById('preloader') || isPageTransitioning || currentPage <= 0) {
            return;
        }
        isPageTransitioning = true;
        resetAllTextAnimations();
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add('exit');
        currentPage--;
        pages[currentPage].classList.remove('exit');
        setTimeout(() => {
            pages[currentPage].classList.add('active');
            triggerTextAnimation(pages[currentPage]);
        }, 50);
        setTimeout(() => {
            isPageTransitioning = false;
        }, pageTransitionAnimationTime);
    }

    function showNextPage() {
        if (document.getElementById('preloader') || isPageTransitioning || currentPage >= pages.length - 1) {
            return;
        }
        isPageTransitioning = true;
        resetAllTextAnimations();
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add('exit');
        currentPage++;
        pages[currentPage].classList.remove('exit');
        setTimeout(() => {
            pages[currentPage].classList.add('active');
            triggerTextAnimation(pages[currentPage]);
            if (currentPage === 1 && !isMusicPlaying && bgm) {
                bgm.play().catch(error => console.error('音频播放失败:', error));
                if(document.getElementById('audio-control')) document.getElementById('audio-control').textContent = '暂停';
                isMusicPlaying = true;
            }
        }, 50);
        setTimeout(() => {
            isPageTransitioning = false;
        }, pageTransitionAnimationTime);
    }

    if (document.getElementById('audio-control') && bgm) {
        document.getElementById('audio-control').addEventListener('click', function() {
            if (isMusicPlaying) {
                bgm.pause();
                this.textContent = '播放';
            } else {
                bgm.play().catch(error => console.error('音频播放失败:', error));
                this.textContent = '暂停';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    if (document.getElementById('prev-page')) {
        document.getElementById('prev-page').addEventListener('click', showPrevPage);
    }
    if (document.getElementById('next-page')) {
        document.getElementById('next-page').addEventListener('click', showNextPage);
    }

    if (startButton && preloader) {
        startButton.addEventListener('click', function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
                if (pages.length > 0) {
                    pages[0].classList.add('active');
                    triggerTextAnimation(pages[0]);
                }
                if (bgm) {
                    bgm.play().catch(error => console.error('音频播放失败:', error));
                    if(document.getElementById('audio-control')) document.getElementById('audio-control').textContent = '暂停';
                    isMusicPlaying = true;
                }
            }, 500);
        });
    }

    let touchstartX = 0;
    let touchstartY = 0;
    const swipeThreshold = 50;

    document.body.addEventListener('touchstart', (e) => {
        if (document.getElementById('preloader')) return;
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.body.addEventListener('touchend', (e) => {
        if (document.getElementById('preloader') || isPageTransitioning) return;
        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        const deltaY = touchendY - touchstartY;
        if (Math.abs(deltaY) > swipeThreshold && Math.abs(deltaY) > Math.abs(touchendX - touchstartX)) {
            e.preventDefault();
            if (deltaY > 0) {
                showPrevPage();
            } else {
                showNextPage();
            }
        }
    }, { passive: false });

    document.body.addEventListener('wheel', (e) => {
        if (document.getElementById('preloader') || isPageTransitioning) return;
        e.preventDefault();
        if (e.deltaY < 0) {
            showPrevPage();
        } else if (e.deltaY > 0) {
            showNextPage();
        }
    }, { passive: false });

    window.addEventListener('error', function(e) {
        if (e.message && (e.message.includes("Failed to load resource") || e.filename)) {
            console.error('资源加载或脚本错误:', e.message, e.filename, e.lineno);
        }
    });
});
