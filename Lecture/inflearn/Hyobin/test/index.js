const changePage = (page) => {
    let $content = document.getElementById('content');
    $content.textContent = `현재 보고 있는 페이지는 ${page}입니다.`;
    history.pushState({page: page}, `Title: ${page}`, `/${page}`);
};

// popstate
window.addEventListener('popstate', (event) => {
    if (event.state) {
        let $content = document.getElementById('content');
        $content.textContent = `현재 보고 있는 페이지는 ${event.state}입니다.`;
    }
})

document.getElementById('page1').addEventListener('click', () => {
    changePage('page1')
});
document.getElementById('page2').addEventListener('click', () => {
    changePage('page2')
});
document.getElementById('page3').addEventListener('click', () => {
    changePage('page3')
});

const goBack = () => {
    history.back();
};

const goForward = () => {
    history.forward();
};

document.getElementById('goBack').addEventListener('click', () => {
    goBack();
})
document.getElementById('goBack').addEventListener('click', () => {
    goForward();
})
