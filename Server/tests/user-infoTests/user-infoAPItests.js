import { error } from 'console';
import fetch from 'node-fetch';

const testUser = {
    "_id": { "$oid": "6745ad4bb4114903043134d0" },
    "username": "Maryse52",
    "firstName": "Arne",
    "lastName": "Hackett-Pfeffer",
    "password": "$2b$10$xV5SMGjThzvWr/S3pLs3.u1.yG1JFZJAubv.TnNB/FtBkyz8cvbam",
    "email": "Stephania_Beer@hotmail.com",
    "mainStore": { "$oid": "6745ad4bb4114903043134d1" , "name": "Davis Inc"},
    "stores": [
        { "$oid": "6745ad4bb4114903043134d1", "name": "Davis Inc" },
        { "$oid": "6745ad4bb4114903043134d2", "name": "Effertz - Batz" }
    ]
}


const testUserInfo = async () => {
    const response = await fetch('http://localhost:4000/user-info', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '6745ad4bb4114903043134d0',
            username: "Maryse52",
            firstName: "Arne",
            lastName: "Hackett-Pfeffer",
            email: "Stephania_Beer@hotmail.com",
            mainStore: "Davis Inc",
        }),
    });

    const data = await response.json();
    console.log(data);
}

testUserInfo().catch((error) => console.error('Error:', error));
