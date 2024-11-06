// testUser.js
import fetch from 'node-fetch';

const createUser = async () => {
    const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'testUser',
            password: '1234',
            email: 'user@example.com',
        }),
    });

    const data = await response.json();
    console.log(data);
};

createUser().catch((error) => console.error('Error:', error));
