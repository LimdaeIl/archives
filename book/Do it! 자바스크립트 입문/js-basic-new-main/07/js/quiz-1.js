var numbers = [2, 4, 6, 8, 10];
let result = 0;
showArray(numbers);

function showArray(arr) {
    var str = "<table><tr>";
    for (var i = 0; i < arr.length; i++) {
        str += "<td>" + arr[i] + "</td>";
        result += arr[i];
    }
    str += "<td>" + result + "</td>";
    str += "</tr></table>";
    document.write(str);
}