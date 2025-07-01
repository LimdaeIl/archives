const API_URL = 'https://pokemon-api-ecru-eta.vercel.app';

let getData = async () => {
    let response = await fetch(`${API_URL}`);
    let json = await response.json();

    let monsters = json["data"];

    let data = monsters
        .filter((monster) => {
            return monster.color === "green"
        });


    console.log(data);
};

getData();