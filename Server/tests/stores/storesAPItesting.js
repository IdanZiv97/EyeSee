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

const testDeleteStore = async () => {
    const response = await fetch('http://localhost:4000/store/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '6745ad4bb4114903043134d0',
            storeName: 'Effertz - Batz'
        })
    })

    const data = await response.json();
    console.log('DATA:\n', data);
    
}

const testUpdateStore = async () => {
    const response = await fetch('http://localhost:4000/store/update', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '6745ad4bb4114903043134d0',
            storeName: 'Effertz - Batz',
            newName: 'Davis Inc'
        })
    })
    const data = await response.json();
    console.log('DATE:', data);
    
    
}

const testGetAnalytcis = async () => {
    const response = await fetch('http://localhost:4000/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
        })
    })
    const data = await response.json();
    console.log(data);
    
}

testGetAnalytcis().catch((error) => console.error('Error:', error));