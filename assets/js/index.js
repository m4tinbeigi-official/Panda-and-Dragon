// ذخیره زبان انتخاب‌شده و انتقال به صفحه داستان
document.getElementById("start-btn").addEventListener("click", () => {
    const language = document.getElementById("language-selector").value;
    localStorage.setItem("selectedLanguage", language);
    window.location.href = "story.html";
});