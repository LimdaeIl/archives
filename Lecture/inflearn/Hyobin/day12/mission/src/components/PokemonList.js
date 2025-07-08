// 알맞은 속성의 값과 색상을 적용할 수 있는 모듈입니다.
// modules 폴더 내부의 typeTag.js 코드를 확인하고, 알맞게 활용해보세요!

import {setPokemonType} from '../modules/typeTag.js';

export default function PokemonList({$app, initialState, handleItemClick, handleTypeClick}) {
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'pokemon-list';

    $app.appendChild(this.$target);
    this.handleItemClick = handleItemClick;
    this.handleTypeClick = handleTypeClick;

    this.template = () => {
        // html 코드는 아래와 같이 제공드립니다.
        // 필요한 코드를 추가적으로 작성해 웹 사이트를 완성하세요.
        console.log('[디버그] types 확인:', this.state.map(p => ({id: p.id, types: p.types})));
        return this.state.map((pokemon) =>
            `<div class="pokemon-wrapper">
                <div class="img-wrapper" data-id="${pokemon.id}">
                    <img src="${pokemon.img}" alt="${pokemon.name}"></img>
                </div>
                <div class="pokemon-info">
                    <div class="index">No.${pokemon.id}</div>
                    <div class="name">${pokemon.name}</div>
                    <div class="type">${pokemon.type ? setPokemonType(pokemon.type) : ''}</div>
                </div>
            </div>`).join('');
    };

    this.render = () => {
        this.$target.innerHTML = this.template();

        // 포켓몬 클릭
        this.$target.querySelectorAll('.img-wrapper').forEach((elm) => {
            elm.addEventListener('click', () => {
                const id = elm.dataset.id;
                this.handleItemClick(id);
            });
        });

        // 타입 클릭
        this.$target.querySelectorAll('.type-tag').forEach((elm) => {
            elm.addEventListener('click', () => {
                const type = elm.id;
                this.handleTypeClick(type);
            });
        });
    };

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    };

    this.render();
}
