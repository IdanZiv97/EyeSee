// testUser.js
import fetch from 'node-fetch';

const signupUser = async () => {
    const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'notidanziv',
            password: '210797',
            email: 'idan@gmail.com',
            storename: "Mongo"
        }),
    });

    const data = await response.json();
    console.log(data);
};

signupUser().catch((error) => console.error('Error:', error));
