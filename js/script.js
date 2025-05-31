document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png',
        'images/111.jpg'
        // 'audio/bgm.mp3' // 音频通常不由Image对象加载，可以单独处理或从预加载列表中移除
    ];
    const progress = document.querySelector('.progress');
    const preloader = document.getElementById('preloader');
    const startButton = document.getElementById('start-button');
    const bgm = document.getElementById('bgm');

    let loaded = 0;

    if (resources.length === 0) { // 处理没有图片资源的情况
        progress.style.width = '100%';
        document.querySelector('.progress-bar').style.display = 'none';
        document.getElementById('preload-text').style.display = 'none';
        startButton.classList.remove('hidden');
    } else {
        resources.forEach(url => {
            const res = new Image(); // 只用 Image 对象预加载图片
            res.onload = () => {
                loaded++;
                progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    document.querySelector('.progress-bar').style.display = 'none';
                    document.getElementById('preload-text').style.display = 'none';
                    startButton.classList.remove('hidden');
                }
            };
            res.onerror = () => {
                loaded++; // 即使失败也算作一个资源处理完毕
                console.error(`资源加载失败: ${url}`);
                // 可以选择是否因此弹窗，或者仅在控制台报错
                // alert(`资源加载失败: ${url}, 请刷新页面 (＞人＜;)`);
                progress.style.width = (loaded / resources.length * 100) + '%';
                if (loaded === resources.length) {
                    document.querySelector('.progress-bar').style.display = 'none';
                    document.getElementById('preload-text').style.display = 'none';
                    startButton.classList.remove('hidden');
                }
            };
            res.src = url;
        });
    }


    // 页面控制系统
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    let isMusicPlaying = false;

    // --- 新增：页面切换节流控制 ---
    let isPageTransitioning = false;
    const pageTransitionAnimationTime = 800; // 与 CSS 中的 transform 过渡时间一致 (0.8s)

    // --- 辅助函数用于处理文本动画 ---
    function triggerTextAnimation(pageElement) {
        const contentDiv = pageElement.querySelector('.content');
        if (contentDiv) {
            contentDiv.classList.remove('animate');
            setTimeout(() => {
                contentDiv.classList.add('animate');
            }, 0);
        }
    }

    // --- 辅助函数用于移除所有页面的文本动画类 ---
    function resetAllTextAnimations() {
        pages.forEach(page => {
            const contentDiv = page.querySelector('.content');
            if (contentDiv) {
                contentDiv.classList.remove('animate');
            }
        });
    }

    // --- 新增：上一页功能函数 ---
    function showPrevPage() {
        if (document.getElementById('preloader') || isPageTransitioning || currentPage <= 0) {
            return; // 如果预加载器存在、正在切换中或已是第一页，则不执行
        }
        isPageTransitioning = true;

        resetAllTextAnimations();
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add('exit');
        currentPage--;
        pages[currentPage].classList.remove('exit'); // 确保新页面没有 exit 类

        setTimeout(() => {
            pages[currentPage].classList.add('active');
            triggerTextAnimation(pages[currentPage]);
        }, 50); // 短暂延迟以确保类更改生效

        setTimeout(() => {
            isPageTransitioning = false; // 动画时间后解除锁定
        }, pageTransitionAnimationTime);
    }

    // --- 新增：下一页功能函数 ---
    function showNextPage() {
        if (document.getElementById('preloader') || isPageTransitioning || currentPage >= pages.length - 1) {
            return; // 如果预加载器存在、正在切换中或已是最后一页，则不执行
        }
        isPageTransitioning = true;

        resetAllTextAnimations();
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add('exit');
        currentPage++;
        pages[currentPage].classList.remove('exit'); // 确保新页面没有 exit 类

        setTimeout(() => {
            pages[currentPage].classList.add('active');
            triggerTextAnimation(pages[currentPage]);

            // 自动播放音乐的逻辑
            if (currentPage === 1 && !isMusicPlaying) {
                bgm.play().catch(error => {
                    console.error('音频播放失败:', error);
                });
                document.getElementById('audio-control').textContent = '暂停';
                isMusicPlaying = true;
            }
        }, 50);

        setTimeout(() => {
            isPageTransitioning = false; // 动画时间后解除锁定
        }, pageTransitionAnimationTime);
    }

    // 音乐播放控制
    document.getElementById('audio-control').addEventListener('click', function() {
        if (isMusicPlaying) {
            bgm.pause();
            this.textContent = '播放';
        } else {
            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
            });
            this.textContent = '暂停';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 翻页控制按钮 (调用新的翻页函数)
    document.getElementById('prev-page').addEventListener('click', showPrevPage);
    document.getElementById('next-page').addEventListener('click', showNextPage);

    // 开始按钮点击事件
    startButton.addEventListener('click', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            if (preloader.parentNode) { // 检查 preloader 是否还在 DOM 中
                preloader.parentNode.removeChild(preloader);
            }
            pages[0].classList.add('active');
            triggerTextAnimation(pages[0]);

            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
            });
            document.getElementById('audio-control').textContent = '暂停';
            isMusicPlaying = true;
        }, 500); // 等待 preloader 淡出动画
    });

    // --- 新增：触摸滑动翻页 ---
    let touchstartX = 0;
    let touchstartY = 0;
    const swipeThreshold = 50; // 滑动最小距离阈值

    document.body.addEventListener('touchstart', (e) => {
        // 只记录起点，不在预加载时启动滑动判断
        if (document.getElementById('preloader')) return;
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true }); // passive: true 表示不会调用 preventDefault

    document.body.addEventListener('touchend', (e) => {
        if (document.getElementById('preloader') || isPageTransitioning) return;

        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        const deltaX = touchendX - touchstartX;
        const deltaY = touchendY - touchstartY;

        // 优先判断垂直滑动
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (Math.abs(deltaY) > swipeThreshold) {
                e.preventDefault(); // 明确是垂直滑动且超过阈值，阻止可能的页面默认滚动行为
                if (deltaY > 0) { // 手指向下滑动
                    showPrevPage();
                } else { // 手指向上滑动
                    showNextPage();
                }
            }
        }
        // 如果需要左右滑动翻页，可以在这里添加 else if 条件
        // else if (Math.abs(deltaX) > Math.abs(deltaY)) {
        //     if (Math.abs(deltaX) > swipeThreshold) {
        //         e.preventDefault();
        //         if (deltaX > 0) { // Swipe Right
        //             showPrevPage();
        //         } else { // Swipe Left
        //             showNextPage();
        //         }
        //     }
        // }
    }, { passive: false }); // passive: false 因为可能会调用 preventDefault

    // --- 新增：鼠标滚轮/触控板滑动翻页 ---
    document.body.addEventListener('wheel', (e) => {
        if (document.getElementById('preloader') || isPageTransitioning) return;

        e.preventDefault(); // 阻止默认的页面滚动行为

        if (e.deltaY < 0) { // 向上滚动
            showPrevPage();
        } else if (e.deltaY > 0) { // 向下滚动
            showNextPage();
        }
    }, { passive: false }); // passive: false 因为调用了 e.preventDefault()

    // 错误处理
    window.addEventListener('error', function(e) {
        if (e.message.includes("Failed to load resource") || e.filename) {
            console.error('资源加载或脚本错误:', e.message, e.filename, e.lineno);
            // alert('加载遇到问题，请刷新页面 (＞人＜;)\n错误信息：' + e.message); // 可选，避免过多弹窗
        }
    });
});
