import { jsPDF } from "jspdf";

const storyContainer = document.getElementById("story-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const downloadPdfBtn = document.getElementById("download-pdf");
const shareStoryBtn = document.getElementById("share-story");

let currentPage = 0;
let storyData = [];
const language = localStorage.getItem("selectedLanguage") || "fa";

// بارگذاری داستان
fetch(`assets/data/story_${language}.json`)
    .then((response) => response.json())
    .then((data) => {
        storyData = data;
        renderPage();
    });

function renderPage() {
    const { text, image } = storyData[currentPage];
    storyContainer.innerHTML = `
        <h2 class="mb-4">${text}</h2>
        <img src="${image}" alt="Story Image" class="img-fluid">
    `;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === storyData.length - 1;
}

// دکمه‌های کنترل صفحات
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) currentPage--;
    renderPage();
});
nextBtn.addEventListener("click", () => {
    if (currentPage < storyData.length - 1) currentPage++;
    renderPage();
});

// دانلود PDF
downloadPdfBtn.addEventListener("click", () => {
    const doc = new jsPDF();
    storyData.forEach(({ text }, index) => {
        doc.text(`${index + 1}. ${text}`, 10, 10 + index * 30);
    });
    doc.save("story.pdf");
});

// اشتراک‌گذاری استوری
shareStoryBtn.addEventListener("click", () => {
    html2canvas(storyContainer).then((canvas) => {
        const link = document.createElement("a");
        link.download = `story-page-${currentPage + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});
