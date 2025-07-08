const API_URL = 'https://trip-wiki-api.vercel.app/';

export const request = async (startIdx, region, sortBy, searchWord) => {
    try {
        let url = `${API_URL}`;

        if (region && region !== 'All') {
            url += `${region}?start=${startIdx}`;
        } else {
            url += `?start=${startIdx}`;
        }

        if (sortBy) {
            url += `&sort=${sortBy}`;
        }

        if (searchWord) {
            url += `&search=${searchWord}`;
        }

        console.log(url);
        const response = await fetch(url);

        if (response) {
            let data = await response.json();
            return data;
        }

    } catch (err) {
        console.log(err);
    }
}

export const requestCityDetail = async (cityId) => {
    try {
        const response = await fetch(`${API_URL}city/${cityId}`);
        if (response) {
            let data = await response.json();
            console.log(data);
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};