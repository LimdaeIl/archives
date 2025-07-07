import Content from "components/Content";
import TabBar from "components/TabBar";


export default function App($app) {
    this.state = {
        currentTab: "all", // 현재 탭 위치
        photos: [] // 해당 탭의 사진들
    };

    const content = new Content({
        $app,
        initialState: "",
        onClick: async (name) => {
            this.setState({
                ...this.state,
            })
        }
    });
    const tabBar = new TabBar();

    this.setState = (newState) => {
        this.state = newState;
    };
    
}
