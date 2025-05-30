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
    let loadedCount = 0;

    const resources = [
        "images/boat.png",
        "images/gift.png",
        "audio/bgm.mp3",
    ];

    // 更新进度条
    function updateProgress() {
        const percent = (loadedCount / resources.length) * 100;
        progressBar.style.width = percent + "%";
        if (loadedCount === resources.length) {
            showStartButton();
        }
    }

    // 真实预加载资源
    resources.forEach((src) => {
        const ext = src.split(".").pop().toLowerCase();
        if (ext === "mp3" || ext === "wav") {
            const audio = new Audio();
            audio.src = src;
            audio.addEventListener("canplaythrough", () => {
                loadedCount++;
                updateProgress();
            });
            audio.addEventListener("error", () => {
                // 出错也算加载完成，防止卡死
                loadedCount++;
                updateProgress();
            });
        } else {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                updateProgress();
            };
            img.onerror = () => {
                loadedCount++;
                updateProgress();
            };
        }
    });

    // 显示开始按钮
    function showStartButton() {
        progressBar.style.width = "100%";
        document.querySelector(".progress-bar").style.display = "none";
        preloaderText.style.display = "none";
        startBtn.style.display = "inline-block";
    }

    // 点击开始按钮，隐藏预加载，显示第一页，播放音乐
    startBtn.addEventListener("click", () => {
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = "none";
            pageContainer.style.display = "block";
            showPage(0);
            bgm.play().catch(() => {
                // 自动播放失败，用户可用按钮控制
            });
        }, 600);
    });

    // 显示指定页面
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
        currentPageIndex = index;

        // 文字动画处理
        const textLines = pages[index].querySelectorAll(".text-line");
        pages[index].classList.remove("animate");
        void pages[index].offsetWidth; // 触发重绘
        pages[index].classList.add("animate");

        textLines.forEach((line, i) => {
            line.style.animationDelay = `${i * 0.2}s`;
        });
    }

    // 页面上下翻页控制
    function nextPage() {
        if (currentPageIndex < pages.length - 1) {
            showPage(currentPageIndex + 1);
        }
    }
    function prevPage() {
        if (currentPageIndex > 0) {
            showPage(currentPageIndex - 1);
        }
    }

    // 页面点击控制：左右翻页或上下翻页，这里用上下翻页（点上半区上一页，下半区下一页）
    pageContainer.addEventListener("click", (e) => {
        const clickY = e.clientY;
        const screenHeight = window.innerHeight;
        if (clickY < screenHeight / 2) {
            prevPage();
        } else {
            nextPage();
        }
    });

    // 音乐播放控制按钮
    musicToggle.addEventListener("click", () => {
        if (bgm.paused) {
            bgm.play();
            musicToggle.textContent = "🔊";
        } else {
            bgm.pause();
            musicToggle.textContent = "🔈";
        }
    });

    // 初始化页面隐藏状态
    pageContainer.style.display = "none";

    // 错误捕获
    window.addEventListener("error", (e) => {
        console.error("资源加载失败:", e.filename);
        alert("加载遇到问题，请刷新页面 (＞人＜;)");
    });
});
