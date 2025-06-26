let foods = [
    { name: 'Burger', calories: 800 },
    { name: 'Apple', calories: 52 },
    { name: 'Pizza', calories: 550 },
    { name: 'Salad', calories: 150 },
];

for (let i = 0; i < foods.length; i++) {
    if (foods[i].calories <= 500) {
        console.log(foods[i].name);
    }
}