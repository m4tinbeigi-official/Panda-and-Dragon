const { jsPDF } = window.jspdf;
const storyContainer = document.getElementById("story-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shareStoryBtn = document.getElementById("share-story");

let currentPage = 0;
const pages = [];
for (let i = 1; i <= 118; i++) {
    pages.push({ 
        text: `صفحه ${i}`, 
        image: `assets/images/page (${i}).jpg`,
        seoDescription: `توضیحات سئو برای صفحه ${i}`,
        seoTitle: `عنوان سئو برای صفحه ${i}`,
    });
}
let storyData = pages;

// شروع رندر بعد از بارگذاری صفحه
window.onload = () => {
    const pageId = getPageIdFromURL();  // گرفتن شماره صفحه از URL
    if (pageId !== null) {
        currentPage = pageId - 1;  // تنظیم شماره صفحه بر اساس URL
    }
    renderPage();
};

// تابع برای گرفتن شماره صفحه از URL
function getPageIdFromURL() {
    const pageUrl = window.location.pathname;
    const pageMatch = pageUrl.match(/page-(\d+)\.html$/);
    return pageMatch ? parseInt(pageMatch[1], 10) : null;
}

// رندر صفحه
function renderPage() {
    const { text = "متن موجود نیست", image = "", seoTitle = "", seoDescription = "" } = storyData[currentPage] || {};
    
    // تنظیم سئو برای صفحه
    document.title = seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", seoDescription);

    // رندر محتوای صفحه
    storyContainer.innerHTML = `
        <h2>${text}</h2>
        <img src="${image}" alt="Story Image" onload="adjustImage(this)" onerror="this.style.display='none'">
    `;
    
    // تغییر URL برای صفحات جداگانه
    const pageUrl = `page-${currentPage + 1}.html`;
    window.history.pushState(null, seoTitle, pageUrl);

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
    html2canvas(storyContainer, { 
        width: 1080, // عرض استوری (برای اینستاگرام یا سایر شبکه‌ها)
        height: 1920, // ارتفاع استوری
        x: 0, // موقعیت شروع در محور X
        y: 0 // موقعیت شروع در محور Y
    })
    .then((canvas) => {
        const ctx = canvas.getContext("2d");

        // متن واترمارک
        const watermarkText = "This project is made by Rick Sanchez";
        ctx.font = "24px Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // رنگ خاکستری با شفافیت
        ctx.textAlign = "center";

        // متن واترمارک در پایین وسط
        const textX = canvas.width / 2;
        const textY = canvas.height - 40; // 40 پیکسل از پایین
        ctx.fillText(watermarkText, textX, textY);

        // دانلود تصویر
        const link = document.createElement("a");
        link.download = `story-page-${currentPage + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    })
    .catch((error) => {
        alert("خطا در اشتراک‌گذاری: " + error.message);
    });
});
