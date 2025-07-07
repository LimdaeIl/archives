function obj2() {
   const obj = {
      value: 42,
      regularFunction: function () {
         console.log(this.value); // Q1. 여기서 this는 무엇을 가리키나요?
      },
      arrowFunction: () => {
         console.log(this.value); // Q2. 여기서 this는 무엇을 가리키나요?
      },
   };
}


obj.regularFunction(); // 출력: 42
obj.arrowFunction(); // Q3. 출력: undefined (이유를 설명해보세요)