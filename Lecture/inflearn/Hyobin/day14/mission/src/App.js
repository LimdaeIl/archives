//COMPONENTS
import Header from './components/Header.js';
import PokemonList from './components/PokemonList.js';
import PokemonDetail from './components/PokemonDetail.js';

//APIS
import { getPokemonList, getPokemonDetail } from './modules/api.js';


export default function App($app) {
    const getSearchWord = () => {
        if (window.location.search.includes('search=')) {
            return window.location.search.split('search=')[1];
        }
        return '';
    };

    this.state = {
        //default 값들을 알맞게 수정해주세요.
        type: window.location.pathname.replace('/', ''), // 힌트 : 현재 url 주소를 활용하세요.
        pokemonList: [],
        searchWord: getSearchWord(),
        currentPage: window.location.pathname,
    };

    // 이번 강의에서 배운 '조건부 렌더링' 적용
    const renderHeader = () => {
        // 코드 알맞게 수정
        new Header({
            $app,
            initialState: {
                currentPage: this.state.currentPage,
                searchWord: this.state.searchWord,
            },
            handleClick: async () => {
                history.pushState(null, null, `/`);
                const pokemonList = await getPokemonList();
                this.setState({
                    ...this.state,
                    pokemonList: pokemonList,
                    type: '',
                    searchWord: getSearchWord(),
                    currentPage: '/'
                });
            },
            handleSearch: async (searchWord) => {
                history.pushState(null, null, `?search=${searchWord}`);
                const searchedPokemonList = await getPokemonList(this.state.type, searchWord);
                this.setState({
                    ...this.state,
                    searchWord: searchWord,
                    pokemonList: searchedPokemonList,
                    currentPage: `?search=${searchWord}`
                });
            },
        });
    };

    const renderPokemonList = () => {
        // 코드 알맞게 수정
        new PokemonList({
            $app,
            initialState: this.state.pokemonList,
            handleItemClick: async (id) => {
                history.pushState(null, null, `/detail/${id}`);
                this.setState({
                    ...this.state,
                    currentPage: `/detail/${id}`
                });
            },
            handleTypeClick: async (type) => {
                history.pushState(null, null, `/${type}`);
                const pokemonList = await getPokemonList(type);
                this.setState({
                    ...this.state,
                    pokemonList: pokemonList,
                    searchWord: getSearchWord(),
                    type: type,
                    currentPage: `${type}`,
                });
            },
        });
    };

    const renderPokemonDetail = async (pokemonId) => {
        // 코드 새로 작성
        try {
            const pokemonDetailData = await getPokemonDetail(pokemonId);
            new PokemonDetail({
                $app,
                initialState: pokemonDetailData,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const render = async () => {
        // 코드 새로 작성
        const path = this.state.currentPage;
        $app.innerHTML = '';

        if (!path.startsWith('/detail')) {
            renderHeader();
            renderPokemonList();
        } else {
            const pokemonId = path.split('/detail/')[1];
            renderHeader();
            renderPokemonDetail(pokemonId);
        }
    };

    this.setState = (newState) => {
        this.state = newState;
        render();
    };

    const init = async () => {
        // 코드 알맞게 수정
        const path = this.state.currentPage;

        if (!path.startsWith('/detail')) {
            try {
                const initialPokemonList = await getPokemonList(this.state.type, this.state.searchWord);
                this.setState({
                    ...this.state,
                    pokemonList: initialPokemonList,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            render();
        }
    };

    // 뒤로 가기, 앞으로 가기 기능 완성
    window.addEventListener('popstate', async () => {
        // 코드 작성
        const urlPath = window.location.pathname;
        const prevType = urlPath.replace('/', '');
        const prevSearchWord = getSearchWord();
        const prevPokemonList = await getPokemonList(prevType, prevSearchWord);

        this.setState({
            ...this.state,
            type: prevType,
            pokemonList: prevPokemonList,
            searchWord: prevSearchWord,
            currentPage: urlPath
        });
    });

    init();
}
