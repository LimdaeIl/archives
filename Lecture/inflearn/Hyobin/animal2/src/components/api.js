const API_URL = 'https://animal-api-two.vercel.app/';

export const request = async (name) => {
    try {
        let res = await fetch(name ? `${API_URL}${name}` : API_URL);
        if (res) {
            let data = await res.json();
            return data.photos;
        }
    } catch (error) {
        console.log(error);
    }
};
