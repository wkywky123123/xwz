document.addEventListener('DOMContentLoaded', () => {
    // 预加载系统
    const resources = [
        'images/boat.png',
        'images/gift.png',
        
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
