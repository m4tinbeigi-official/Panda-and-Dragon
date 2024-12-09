const { jsPDF } = window.jspdf;
const storyContainer = document.getElementById("story-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const downloadPdfBtn = document.getElementById("download-pdf");
const shareStoryBtn = document.getElementById("share-story");

let currentPage = 0;
const pages = [];
for (let i = 1; i <= 118; i++) {
    pages.push({ text: "", image: `assets/images/page (${i}).jpg` });
}
let storyData = pages;

// رندر صفحه
function renderPage() {
    const { text = "متن موجود نیست", image = "" } = storyData[currentPage] || {};
    storyContainer.innerHTML = `
        <h2 class="mb-4">${text}</h2>
        <img src="${image}" alt="Story Image" class="img-fluid" onerror="this.style.display='none'">
    `;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === storyData.length - 1;
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

// دانلود PDF
downloadPdfBtn.addEventListener("click", () => {
    const doc = new jsPDF();
    storyData.forEach(({ text }, index) => {
        const y = 10 + (index % 25) * 10;
        if (index > 0 && index % 25 === 0) doc.addPage();
        doc.text(`${index + 1}. ${text}`, 10, y);
    });
    doc.save("Panda-and-Dragon-RickSanchez(@M4tinBeigi).pdf");
});

// اشتراک‌گذاری استوری
shareStoryBtn.addEventListener("click", () => {
    html2canvas(storyContainer)
        .then((canvas) => {
            const link = document.createElement("a");
            link.download = `story-page-${currentPage + 1}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        })
        .catch((error) => {
            alert("خطا در اشتراک‌گذاری: " + error.message);
        });
});

// شروع رندر
renderPage();
