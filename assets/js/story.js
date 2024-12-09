const { jsPDF } = window.jspdf;
const storyContainer = document.getElementById("story-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shareStoryBtn = document.getElementById("share-story");

let currentPage = 0;
const pages = [];
for (let i = 1; i <= 118; i++) {
    pages.push({ text: `صفحه ${i}`, image: `assets/images/page (${i}).jpg` });
}
let storyData = pages;

// شروع رندر بعد از بارگذاری صفحه
window.onload = () => {
    renderPage();
};

// رندر صفحه
function renderPage() {
    const { text = "متن موجود نیست", image = "" } = storyData[currentPage] || {};
    storyContainer.innerHTML = `
        <h2>${text}</h2>
        <img src="${image}" alt="Story Image" onload="adjustImage(this)" onerror="this.style.display='none'">
    `;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === storyData.length - 1;
}

// تنظیم اندازه تصویر
function adjustImage(img) {
    const maxHeight = window.innerHeight * 0.6; // حداکثر ارتفاع 60 درصد صفحه
    const maxWidth = window.innerWidth * 0.9;  // حداکثر عرض 90 درصد صفحه
    img.style.maxHeight = `${maxHeight}px`;
    img.style.maxWidth = `${maxWidth}px`;
}

// کنترل صفحات
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) currentPage--;
    renderPage();
});
nextBtn.addEventListener("click", () => {
    if (currentPage < storyData.length - 1) currentPage++;
    renderPage();
});

// اشتراک‌گذاری استوری
shareStoryBtn.addEventListener("click", () => {
    html2canvas(storyContainer)
        .then((canvas) => {
            const ctx = canvas.getContext("2d");
            const text = "This project is made by Rick Sanchez";
            ctx.font = "10px Arial";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // رنگ خاکستری
            ctx.textAlign = "center";
            ctx.fillText(
                text,
                canvas.width / 2,
                canvas.height - 10 // پایین‌ترین بخش تصویر
            );

            const link = document.createElement("a");
            link.download = `story-page-${currentPage + 1}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        })
        .catch((error) => {
            alert("خطا در اشتراک‌گذاری: " + error.message);
        });
});

// نمایش گزینه "افزودن به صفحه اصلی"
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    // نمایش دکمه برای افزودن به صفحه اصلی
    const addToHomeScreenBtn = document.createElement('button');
    addToHomeScreenBtn.textContent = 'افزودن به صفحه اصلی';
    document.body.appendChild(addToHomeScreenBtn);

    addToHomeScreenBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('کاربر اپلیکیشن را به صفحه اصلی اضافه کرد');
            } else {
                console.log('کاربر اپلیکیشن را به صفحه اصلی اضافه نکرد');
            }
            deferredPrompt = null;
            addToHomeScreenBtn.remove();
        });
    });
});
