const $text = document.querySelector("#text");
const $changeTextButton = document.querySelector("#changeTextButton");

const originalText = $text.textContent;
const originalFontSize = $text.style.fontSize;
const originalColor = $text.style.color;

let isModified = false;

$changeTextButton.addEventListener("click", () => {
    if (!isModified) {
        // 텍스트 변경
        $text.textContent = "수정된 텍스트";
        $text.style.fontSize = "1.2em";
        $text.style.color = "green";
        isModified = true;
    } else {
        // 원상복구
        $text.textContent = originalText;
        $text.style.fontSize = originalFontSize;
        $text.style.color = originalColor;
        isModified = false;
    }
});