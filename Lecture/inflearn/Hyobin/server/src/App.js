import TabBar from "./components/TabBar.js";
import Content from "./components/Content.js";
import {request} from './components/api.js';

export default function App($app) {
    this.state = {
        currentTab: window.location.pathname.replace("/", "") || "all", // 현재 선택된 탭의 이름 (예: 'penguin')
        photos: [], // 해당 탭에 해당하는 사진 리스트
    };

    const tabBar = new TabBar({
        $app,
        initialState: this.state.currentTab,
        onClick: async (name) => {
            history.pushState(null, `/${name} 사진`, name);
            this.updateContent(name);
        },
    });
    const content = new Content({$app, initialState: []});

    this.setState = (newState) => {
        this.state = newState;
        tabBar.setState(this.state.currentTab); // 탭바 UI 업데이트
        content.setState(this.state.photos);  // 콘텐츠 영역 업데이트
    }

    this.updateContent = async (tabName) => {
        const currentTab = tabName === "all" ? "" : tabName;
        const photos = await request(currentTab);
        this.setState({
            ...this.state,
            currentTab: tabName,
            photos: photos
        });
    }

    window.addEventListener("popstate", () => {
        this.updateContent(window.location.pathname.replace("/", "") || "all");
    });

    const init = () => {
        this.updateContent(this.state.currentTab);
    };

    init();
}
