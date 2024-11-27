import fetch from 'node-fetch';

const testWeeklyDwellTime = async () => {
    const response = await fetch('http://localhost:4000/api/dwell-time/weekly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '67448d410b5ddf2f8ffb834f',
            storeName: 'Quitzon, Schimmel and Lemke'
        }),
    });

    const data = await response.json();
    console.log(data);

}

const testMonthlyDwellTime = async () => {
    const response = await fetch('http://localhost:4000/api/dwell-time/monthly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '67448d410b5ddf2f8ffb834f',
            storeName: 'Quitzon, Schimmel and Lemke'
        }),
    });

    const data = await response.json();
    console.log(data);

}

const testMonthlyTotalCustomers = async () => {
    const response = await fetch('http://localhost:4000/api/customers/monthly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '67448d410b5ddf2f8ffb834f',
            storeName: 'Quitzon, Schimmel and Lemke'
        }),
    });

    const data = await response.json();
    console.log(data);

}

const testWeeklyTotalCustomers = async () => {
    const response = await fetch('http://localhost:4000/api/customers/weekly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '67448d410b5ddf2f8ffb834f',
            storeName: 'Quitzon, Schimmel and Lemke'
        }),
    });

    const data = await response.json();
    console.log(data);

}

console.log("Testing\n\n");

console.log("Testing Dweel Time");
console.log("Testing Monthly");
await testMonthlyDwellTime().catch((error) => console.error('Error:', error));
console.log("Testing Weekly");
await testWeeklyDwellTime().catch((error) => console.error('Error:', error));
console.log("Testing Total Customers");
console.log("Testing Monthly");
await testMonthlyTotalCustomers().catch((error) => console.error('Error:', error));
console.log("Testing Weekly");
await testWeeklyTotalCustomers().catch((error) => console.error('Error:', error));