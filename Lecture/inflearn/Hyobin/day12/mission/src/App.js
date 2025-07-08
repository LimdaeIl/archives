//COMPONENTS
import PokemonList from './components/PokemonList.js';

//APIS
import { getPokemonList } from './modules/api.js';

export default function App($app) {
    const getSearchWord = () => {
        if (window.location.search.includes('search=')) {
            return window.location.search.split('search=')[1];
        }
        return '';
    };

    this.state = {
        type: '',
        pokemonList: [],
        searchWord: getSearchWord(),
        currentPage: window.location.pathname,
    };

    const pokemonList = new PokemonList({
        // 코드 작성
        $app,
        initialState: this.state.pokemonList,
        //아이템을 클릭하면 "/detail/id" 로 이동할 수 있도록 아래의 함수를 완성하세요.
        handleItemClick: (id) => {
            window.location.href = `/detail/${id}`;
        },

        //타입을 클릭하면, 클리한 타입에 해당하는 포켓몬만 띄워지고,
        // "/type" 으로 이동할 수 있도록 아래의 함수를 완성하세요.
        handleTypeClick: (type) => {
            window.location.href = `/${type}`;
        },
    });

    this.setState = (newState) => {
        this.state = newState;
        // 코드 작성
        pokemonList.setState(this.state.pokemonList);
    };

    const init = async () => {
        // 코드 작성
        const data = await getPokemonList();
        console.log(data); // ← 여기서 실제 구조 확인

        this.setState({
            ...this.state,
            pokemonList: data,
        });
    };

    init();
}
