const $username = document.querySelector("#userName");
const $password = document.querySelector("#password");

const $loginBtn = document.querySelector("button");

$loginBtn.addEventListener("click", () => {
   console.log(`username : ${$username.value}`);
   console.log(`password: ${$password.value}`);
});