function sumNumbers(a, b) {
    function addFive(number) {
        return number + 5;
    }

    return a + addFive(b);
}

console.log(sumNumbers(3, 7)); // 출력: 15 (7에 5를 더한 후 3을 더함)
console.log(sumNumbers(10, 5)); // 출력: 20 (5에 5를 더한 후 10을 더함)```