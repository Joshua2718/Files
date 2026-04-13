const scaler = document.getElementById('main-scaler');
let pages = [];
let currentIndex = 0;
let isDualMode = false;

// 1. 초기화: data.js의 데이터를 바탕으로 DOM 생성
function init() {
    if (typeof bookContent === 'undefined') {
        console.error("data.js가 로드되지 않았거나 bookContent 변수가 없습니다.");
        return;
    }

    bookContent.forEach((html, i) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.innerHTML = `
            <div class="content">${html}</div>
            <div class="page-num">―  ${i + 1}  ―</div>
        `;
        scaler.appendChild(pageDiv);
    });

    pages = document.querySelectorAll('.page');
}

// 2. 레이아웃 업데이트 (비율 조절)
function updateLayout() {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    isDualMode = winW > winH;

    const baseW = 800;
    const baseH = 1131;
    const targetW = isDualMode ? baseW * 2 : baseW;
    
    const scale = Math.min(winW / targetW, winH / baseH) * 0.9;
    scaler.style.transform = `scale(${scale})`;

    render();
}

// 3. 렌더링 (페이지 표시/숨김 처리)
function render() {
    pages.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('left-page', 'right-page');
    });

    if (isDualMode) {
        const startIdx = Math.floor(currentIndex / 2) * 2;
        if (pages[startIdx]) {
            pages[startIdx].style.display = 'block';
            pages[startIdx].classList.add('left-page');
        }
        if (pages[startIdx + 1]) {
            pages[startIdx + 1].style.display = 'block';
            pages[startIdx + 1].classList.add('right-page');
        }
    } else {
        if (pages[currentIndex]) {
            pages[currentIndex].style.display = 'block';
        }
    }
}

// 4. 페이지 이동
function move(dir) {
    const step = isDualMode ? 2 : 1;
    const next = currentIndex + (dir * step);
    if (next >= 0 && next < pages.length) {
        currentIndex = next;
        render();
    }
}

// 이벤트 연결
window.addEventListener('resize', updateLayout);
window.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) move(1);
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) move(-1);
});

let xDown = null;
window.addEventListener('touchstart', e => xDown = e.touches[0].clientX);
window.addEventListener('touchend', e => {
    if (!xDown) return;
    const xDiff = xDown - e.changedTouches[0].clientX;
    if (Math.abs(xDiff) > 50) move(xDiff > 0 ? 1 : -1);
    xDown = null;
});

// 실행 시작
init();
updateLayout();
