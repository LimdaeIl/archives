var now = new Date();

var firstDay = new Date("2018-03-23");

var toNow = now.getTime();
var toFirst = firstDay.getTime();
var passedTime = toNow - toFirst;

calcDate(100);
calcDate(200);
calcDate(365);
calcDate(500);


function calcDate(days) {

    var future = toFirst + days * (1000 * 60 * 60 * 24);
    var someday = new Date(future);
    var year = someday.getFullYear();
    var month = someday.getMonth() + 1;
    var day = someday.getDate();

    document.querySelector("#date" + days).innerHTML = year + "년 " + month + "월 " + day + "일";

}