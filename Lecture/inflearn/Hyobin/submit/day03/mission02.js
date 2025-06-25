let book = {
    name: 'JavaScript ES6',
    author: 'Hyo bin'
}

let getSummary = (book) => {
    return `책 이름: ${book.name}, 책 저자: ${book.author}`;
};

console.log(getSummary(book));