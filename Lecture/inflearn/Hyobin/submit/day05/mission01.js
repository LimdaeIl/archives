console.log(sumAndDouble(1, 2, 3, 4));

function sumAndDouble(...rest) {
    const sum = rest.reduce((acc, cur) => acc + cur, 0);
    const multi = rest.map((x) => x * 2);

    return {
        "sum": sum,
        "multi": multi
    };
}
