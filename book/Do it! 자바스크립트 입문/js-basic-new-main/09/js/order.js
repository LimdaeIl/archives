var check = document.querySelector("#shippingInfo"); // 체크 상자의 id는 shippingInfo

check.addEventListener("click", function () { // check 요소에 click 이벤트가 발생했을 때 실행할 함수
    if (check.checked === true) {
        document.querySelector("#shippingName").value = document.querySelector("#billingName").value;
        document.querySelector("#shippingTel").value = document.querySelector("#billingTel").value;
        document.querySelector("#shippingAddr").value = document.querySelector("#billingAddr").value;
    } else {
        document.querySelector("#shippingName").value = "";
        document.querySelector("#shippingTel").value = "";
        document.querySelector("#shippingAddr").value = "";
    }
});