// script.js
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const progressBar = document.querySelector(".progress");
    const startBtn = document.getElementById("start-btn");
    const preloaderText = document.getElementById("preloader-text");
    const pageContainer = document.querySelector(".page-container");
    const pages = Array.from(document.querySelectorAll(".page"));
    const bgm = document.getElementById("bgm");
    const musicToggle = document.getElementById("musicToggle");

    let currentPageIndex = 0;
    let loadingProgress = 0;
    let loadingInterval;

    // 预加载模拟加载进度
    function startLoading() {
        loadingInterval = setInterval(() => {
            loadingProgress += Math.random() * 10;
            if (loadingProgress >= 100) {
                loadingProgress = 100;
                clearInterval(loadingInterval);
                // 加载完成，隐藏进度条，显示开始按钮
                progressBar.style.width = "100%";
                showStartButton();
            } else {
                progressBar.style.width = loadingProgress + "%";
            }
        }, 300);
    }

    function showStartButton() {
        progressBar.style.width = "0%";
        document.querySelector(".progress-bar").style.display = "none";
        preloaderText.style.display = "none";
        startBtn.style.display = "inline-block";
    }

    // 点击开始按钮后，隐藏预加载，显示第一页，播放音乐
    startBtn.addEventListener("click", () => {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = "none";
            pageContainer.style.display = "block";
            showPage(0);
            bgm.play().catch(() => {
                // 可能浏览器自动播放受限，用户无操作可后续点击音乐按钮播放
            });
        }, 600);
    });

    // 页面显示函数
    function showPage(index) {
        if (index < 0 || index >= pages.length) return;
        pages.forEach((page, i) => {
            page.classList.remove("active");
            page.classList.remove("exit");
            if (i < index) {
                page.classList.add("exit");
            }
        });
        pages[index].classList.add("active");
        // 触发文字动画
        setTimeout(() => {
            pages[index].classList.add("animate");
        }, 100);
        currentPageIndex = index;
    }

    // 上一页
    function prevPage() {
        if (currentPageIndex > 0) {
            showPage(currentPageIndex - 1);
        }
    }

    // 下一页
    function nextPage() {
        if (currentPageIndex < pages.length - 1) {
            showPage(currentPageIndex + 1);
        }
    }

    // 点击页面上下部分翻页
    pageContainer.addEventListener("click", (e) => {
        const clickY = e.clientY;
        const halfHeight = window.innerHeight / 2;
        if (clickY < halfHeight) {
            prevPage();
        } else {
            nextPage();
        }
    });

    // 音乐播放/暂停控制
    musicToggle.addEventListener("click", () => {
        if (bgm.paused) {
            bgm.play();
            musicToggle.textContent = "🔊";
        } else {
            bgm.pause();
            musicToggle.textContent = "🔈";
        }
    });

    // 初始化，隐藏页面容器，开始加载
    pageContainer.style.display = "none";
    startLoading();
});
