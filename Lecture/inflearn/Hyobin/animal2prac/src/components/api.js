const API_URL = 'https://animal-api-two.vercel.app/';

export const request = async (name) => {
    try {
        let responsePromise = await fetch(name ? `${API_URL}${name}` : API_URL);

        if (responsePromise) {
            let json = responsePromise.json();
            return json.photos;
        }

    } catch (error) {
        console.log(error);
    }
}