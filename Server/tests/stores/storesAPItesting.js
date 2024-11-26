/**
 * File for testing stores API
 */

import fetch from 'node-fetch';

const testAddStore = async () => {
    const response = await fetch('http://localhost:4000/store/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '6745ad4bb4114903043134d0',
            storeName: 'Mongo'
        })
    })

    const data = await response.json();
    console.log('DATA:\n', data);
}

testAddStore().catch((error) => console.error('Error:', error));