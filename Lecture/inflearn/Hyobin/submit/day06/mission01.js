function fakeApiCall() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({name: 'John Doe', age: 30});
        }, 2000);
    });
}

// fetchUserData 함수 완성
async function fetchUserData() {
    try {
        let result = await fakeApiCall();
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

fetchUserData();