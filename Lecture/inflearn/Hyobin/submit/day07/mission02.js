const $app = document.querySelector('#app');

const htmlSelectElement = document.createElement("select");
htmlSelectElement.id ="skills";

const htmlOptionElement1 = document.createElement("option");
htmlOptionElement1.value = "javascript";
htmlOptionElement1.textContent = "Javascript";

const htmlOptionElement2 = document.createElement("option");
htmlOptionElement2.value = "next";
htmlOptionElement2.textContent = "Next.js";

const htmlOptionElement3 = document.createElement("option");
htmlOptionElement3.value = "react";
htmlOptionElement3.textContent = "React.js";

const htmlOptionElement4 = document.createElement("option");
htmlOptionElement4.value = "typescript";
htmlOptionElement4.textContent = "TypeScript";

htmlSelectElement.appendChild(htmlOptionElement1);
htmlSelectElement.appendChild(htmlOptionElement2);
htmlSelectElement.appendChild(htmlOptionElement3);
htmlSelectElement.appendChild(htmlOptionElement4);
$app.appendChild(htmlSelectElement);

$app.addEventListener("change", (e) => {
    console.log(e.target.value);
})