const dog = new Animal('개', '멍멍');
console.log(dog.makeSound()); // 출력: 개이(가) 멍멍 소리를 냅니다.

const cat = new Animal('고양이', '야옹');
console.log(cat.makeSound()); // 출력: 고양이이(가) 야옹 소리를 냅니다.

function Animal(type, sound) {
    this.type = type;
    this.sound = sound;

    this.makeSound = function () {
        return `${this.type}이(가) ${this.sound} 소리를 냅니다.`;
    }
}