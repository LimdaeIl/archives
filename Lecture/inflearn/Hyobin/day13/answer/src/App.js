//COMPONENTS
import Header from './components/Header.js';
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

    const header = new Header({
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
                currentPage: '/',
            });
        },
        handleSearch: async (searchWord) => {
            history.pushState(null, null, `?search=${searchWord}`);
            const searchedPokemonList = await getPokemonList(this.state.type, searchWord);
            this.setState({
                ...this.state,
                searchWord: searchWord,
                pokemonList: searchedPokemonList,
                currentPage: `?search=${searchWord}`,
            });
        },
    });

    const pokemonList = new PokemonList({
        $app,
        initialState: this.state.pokemonList,
        handleItemClick: async (id) => {
            history.pushState(null, null, `/detail/${id}`);
            this.setState({
                ...this.state,
                currentPage: `/detail/${id}`,
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
                currentPage: `/${type}`,
            });
        },
    });

    this.setState = (newState) => {
        this.state = newState;
        header.setState({ searchWord: this.state.searchWord, currentPage: this.state.currentPage });
        pokemonList.setState(this.state.pokemonList);
    };

    const init = async () => {
        try {
            const initialPokemonList = await getPokemonList();
            this.setState({
                ...this.state,
                pokemonList: initialPokemonList,
            });
        } catch (err) {
            console.log(err);
        }
    };

    init();
}
