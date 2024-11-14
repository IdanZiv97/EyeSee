// testUser.js
import fetch from 'node-fetch';

const loginUser = async () => {
    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'idanziv',
            password: '210797'
        }),
    });

    const data = await response.json();
    console.log(data);
};

loginUser().catch((error) => console.error('Error:', error));
