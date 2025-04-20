document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png',
        'audio/happy-bgm.mp3'
    ];
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

    // 在预加载完成后添加
let isMusicPlaying = false;
const musicBtn = document.getElementById('musicBtn');
const bgm = document.getElementById('bgm');

// 音乐控制功能
function toggleMusic() {
    isMusicPlaying = !isMusicPlaying;
    musicBtn.innerHTML = isMusicPlaying ? '⏸️ 暂停' : '▶️ 播放';
    musicBtn.classList.toggle('playing', isMusicPlaying);
    
    if (isMusicPlaying) {
        bgm.play().catch(() => {
            // 处理自动播放被阻止的情况
            musicBtn.textContent = '▶️ 点击播放';
            isMusicPlaying = false;
        });
    } else {
        bgm.pause();
    }
}

// 初始化音乐按钮
musicBtn.addEventListener('click', toggleMusic);

// 移除原来的首次点击播放逻辑，修改为：
function handleClick() {
    if (currentPage === 0) {
        // 如果是第一页点击，仅翻页不控制音乐
        pages[currentPage].classList.add('exit');
        currentPage++;
        pages[currentPage].classList.add('active');
    } else if (currentPage < pages.length - 1) {
        // 其他页正常翻页
        pages[currentPage].classList.add('exit');
        currentPage++;
        pages[currentPage].classList.add('active');
    }
    
    // 触发文字动画
    setTimeout(() => {
        pages[currentPage].classList.add('animate');
        const textLines = pages[currentPage].querySelectorAll('.text-line');
        textLines.forEach((line, index) => {
            line.style.animationDelay = `${index*0.2}s`;
        });
    }, 300);
}

    // 页面控制系统
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    function initPages() {
        pages[0].classList.add('active');
        document.body.addEventListener('click', handleClick);
    }

    function handleClick() {
        if(currentPage === 0) document.getElementById('bgm').play();
        
        if(currentPage < pages.length - 1) {
            pages[currentPage].classList.add('exit');
            currentPage++;
            pages[currentPage].classList.add('active');
            
            setTimeout(() => {
                pages[currentPage].classList.add('animate');
                const textLines = pages[currentPage].querySelectorAll('.text-line');
                textLines.forEach((line, index) => {
                    line.style.animationDelay = `${index*0.2}s`;
                });
            }, 300);
        }
    }

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('资源加载失败:', e.filename);
        alert('加载遇到问题，请刷新页面 (＞人＜;)');
    });
});
