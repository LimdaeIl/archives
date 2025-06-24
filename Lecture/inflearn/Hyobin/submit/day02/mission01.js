function checkAnimal() {
    let animal = document.querySelector("#animalInput").value.trim().toLowerCase();
    let resultText = "";

    switch (animal) {
        case "dog":
            resultText = "강아지";
            break;
        case "cat":
            resultText = "고양이";
            break;
        case "tiger":
            resultText = "호랑이";
            break;
        case "lion":
            resultText = "사자";
            break;
        default:
            resultText = "잘못된 입력입니다.";
    }

    document.querySelector("#result").textContent = resultText;
}
