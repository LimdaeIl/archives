// 알맞은 속성의 값과 색상을 적용할 수 있는 모듈입니다.
// modules 폴더 내부의 typeTag.js 코드를 확인하고, 알맞게 활용해보세요!
import {setPokemonType} from '../modules/typeTag.js';

export default function PokemonDetail({$app, initialState}) {
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'pokemon-detail';

    $app.appendChild(this.$target);

    this.template = () => {
        // html 코드는 아래와 같이 제공드립니다.
        // 필요한 코드를 추가적으로 작성해 웹 사이트를 완성하세요.
        const {name, info, description, img, height, id, type, weight} = this.state;
        console.log(img);

        let temp = `
        <div class="detail-wrapper">
            <div class="left-wrapper">
                <img src="${img}"></img>
            </div>
            <div class="right-wrapper">
                <div class="pokemon-info">
                    <div class="index">No.${id}</div>
                    <div class="name">${name}</div>                 
                    <div class="type">${setPokemonType(type)}</div>
                    <div class="description">${description}</div>
                </div>
                <div class="detail-info">
                    <div>
                        <div class="label">키</div>
                        <div class="info">${height}m</div>
                    </div>
                    <div>
                        <div class="label">분류</div>
                        <div class="info">${info}</div>
                    </div>
                    <div>
                        <div class="label">몸무게</div>
                        <div class="info">${weight}kg</div>
                    </div>
                </div>
            </div>
        </div>`;
        return temp;
    };

    this.render = () => {
        this.$target.innerHTML = this.template();
    };

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    };

    this.render();
}
