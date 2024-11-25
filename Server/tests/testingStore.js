// testUser.js
import fetch from 'node-fetch';

const createStore = async () => {
    const response = await fetch('http://localhost:4000/store/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            storeName: 'EyeSee HQ',
            userId: '6744422933c4d8f5122e23da'
        }),
    });
    const data = await response.json();
    console.log(data);
};

createStore().catch((error) => console.error('Error:', error));
