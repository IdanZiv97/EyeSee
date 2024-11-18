import fetch from 'node-fetch';

const testDefault = async () => {
    const response = await fetch('http://localhost:4000/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '6739f3b018369a2a09389057'
        }),
    });

    const data = await response.json();
    console.log(data);
}

/**
 Tested for valid input and for invalid input
 */
const testQueryByDate = async () => {
    const response = await fetch('http://localhost:4000/report/byDate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '6739f3b018369a2a09389057',
            storeName: 'Berge and Sons',
            date: '1999-11-18'
        })
    })
    const data = await response.json();
    console.log(data);
    
}

testQueryByDate().catch((error) => console.error('Error:', error));