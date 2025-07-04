import TabBar from "./components/TabBar.js";
import Content from "./components/Content.js";
import {request} from './components/api.js';

export default function App($app) {
    this.state = {
        currentTab: "all", // 현재 선택된 탭의 이름 (예: 'penguin')
        photos: [], // 해당 탭에 해당하는 사진 리스트
    };

    const tabBar = new TabBar({
        $app,
        initialState: "",
        onClick: async (name) => {
            this.setState({
                ...this.state,
                currentTab: name,
                photos: await request(name === "all" ? "" : name),
            });
        },
    });
    const content = new Content({$app, initialState: []});

    this.setState = (newState) => {
        this.state = newState;
        tabBar.setState(this.state.currentTab); // 탭바 UI 업데이트
        content.setState(this.state.photos);  // 콘텐츠 영역 업데이트
    }

    const init = async () => {
        try {
            const initialPhotos = await request();
            this.setState({
                ...this.state,
                photos: initialPhotos,
            });
        } catch (error) {
            console.log(error);
        }
    };

    init();
}
