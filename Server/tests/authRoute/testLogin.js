// testUser.js
import fetch from 'node-fetch';

const loginUser = async () => {
    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'Verla.Homenick',
            password: 'ljc4ZYzeJfA_nN3'
        }),
    });

    const data = await response.json();
    console.log(data);
};

loginUser().catch((error) => console.error('Error:', error));
