document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png',
        '蒙日圆.ggb'
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

    // --- 新增：辅助函数用于处理文本动画 ---
    function triggerTextAnimation(pageElement) {
        const contentDiv = pageElement.querySelector('.content');
        if (contentDiv) {
            // 先移除，确保动画可以重新触发
            contentDiv.classList.remove('animate');
            // 使用 setTimeout 确保浏览器有时间处理类移除，然后再添加
            setTimeout(() => {
                contentDiv.classList.add('animate');
            }, 0); // 即使是0ms的延迟也常常有效
        }
    }

    // --- 新增：辅助函数用于移除所有页面的文本动画类 ---
    function resetAllTextAnimations() {
        pages.forEach(page => {
            const contentDiv = page.querySelector('.content');
            if (contentDiv) {
                contentDiv.classList.remove('animate');
            }
        });
    }
    // --- 结束新增辅助函数 ---


    // 音乐播放控制
    document.getElementById('audio-control').addEventListener('click', function() {
        if (isMusicPlaying) {
            bgm.pause();
            this.textContent = '播放';
        } else {
            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
                // alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
            });
            this.textContent = '暂停';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 翻页控制
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 0) {
            // 重置所有页面的文本动画，防止旧动画残留
            resetAllTextAnimations();

            pages[currentPage].classList.remove('active'); // 先移除当前页的 active
            pages[currentPage].classList.add('exit'); // 给当前页添加 exit 动画

            currentPage--;

            // 对新页面进行处理
            pages[currentPage].classList.remove('exit'); // 确保新页面没有 exit 类
            // pages[currentPage].classList.remove('active'); // 以防万一，也移除 active (虽然理论上不应该有)

            // 使用 setTimeout 确保 exit 动画有时间播放一部分
            // 并且给浏览器时间处理类变化，然后再激活新页面
            setTimeout(() => {
                pages[currentPage].classList.add('active');
                triggerTextAnimation(pages[currentPage]); // --- 修改点：触发新页面的文本动画 ---
            }, 50); // 这个延迟可以根据你的 page transition 速度调整
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < pages.length - 1) {
            // 重置所有页面的文本动画
            resetAllTextAnimations();

            pages[currentPage].classList.remove('active');
            pages[currentPage].classList.add('exit');

            currentPage++;

            pages[currentPage].classList.remove('exit');
            // pages[currentPage].classList.remove('active');

            setTimeout(() => {
                pages[currentPage].classList.add('active');
                triggerTextAnimation(pages[currentPage]); // --- 修改点：触发新页面的文本动画 ---

                // 自动播放音乐的逻辑可以保留
                if (currentPage === 1 && !isMusicPlaying) { // 假设第一页是索引0，第二页是索引1
                    bgm.play().catch(error => {
                        console.error('音频播放失败:', error);
                        // alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
                    });
                    document.getElementById('audio-control').textContent = '暂停';
                    isMusicPlaying = true;
                }
            }, 50);
        }
    });

    // 开始按钮点击事件
    startButton.addEventListener('click', function() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
            pages[0].classList.add('active');
            triggerTextAnimation(pages[0]); // --- 修改点：触发第一页的文本动画 ---

            // 点击开始按钮后立即播放音乐
            bgm.play().catch(error => {
                console.error('音频播放失败:', error);
                // alert('音频播放失败，请检查网络连接或刷新页面 (＞人＜;)');
            });
            document.getElementById('audio-control').textContent = '暂停';
            isMusicPlaying = true;
        }, 500); // 这个延迟是为了 preloader 的淡出动画
    });

    // 错误处理
    window.addEventListener('error', function(e) {
        // 避免过于频繁的 alert
        if (e.message.includes("Failed to load resource") || e.filename) {
            console.error('资源加载或脚本错误:', e.message, e.filename, e.lineno);
            alert('加载遇到问题，请刷新页面 (＞人＜;)\n错误信息：' + e.message);
        }
    });
});