export default function RegionList({$app, initialState, handleRegion}) {
    this.state = initialState;
    this.$target = document.createElement("div");
    this.$target.className = "region-list";

    this.handleRegion = handleRegion;
    $app.appendChild(this.$target);

    this.template = () => {
        const regionList = [
            { id: 'All', label: '🚀 All' },
            { id: 'Asia', label: '🌏 Asia' },
            { id: 'Middle-East', label: '🕌 Middle-East' },
            { id: 'Europe', label: '🇪🇺 Europe' },
            { id: 'Latin-America', label: '💃 Latin-America' },
            { id: 'Africa', label: '🐘 Africa' },
            { id: 'North-America', label: '🏈 North-America' },
            { id: 'Oceania', label: '🏄 Oceania' },
        ];
        let temp = ``;
        regionList.forEach(({ id, label }) => {
            temp += `<div id="${id}">${label}</div>`;
        });
        return temp;
    };


    this.render = () => {
        this.$target.innerHTML = this.template();
        if (this.state) {
            let $currentRegion = document.getElementById(this.state);
            $currentRegion && ($currentRegion.className = 'clicked');
        } else {
            document.getElementById('All').className = 'clicked';
        }

        const $regionList = this.$target.querySelectorAll('div');
        $regionList.forEach((elm) => {
            elm.addEventListener('click', () => {
                console.log('clicked region id:', elm.id); // 👈 찍어보세요

                this.handleRegion(elm.id);
            });
        });
    };

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    }
    this.render();
}