import fetch from 'node-fetch';

const testWeeklyDwellTime = async () => {
    const response = await fetch('http://localhost:4000/api/dwell-time/weekly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
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
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
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
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
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
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
        }),
    });

    const data = await response.json();
    console.log(data);

}

const testMonthlyGenderDistribution = async () => {
    const response = await fetch('http://localhost:4000/api/gender-distribution/monthly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
        }),
    });

    const data = await response.json();
    console.log(data);
    console.log('Keys of data: ', Object.keys(data));
    console.log('Keys of the data entry in the response: ', Object.keys(data.data[0]));
    // accessing a random entry
    const randomMonth = data.data[4].month
    const randomDistibution = data.data[4].distribution
    console.log('month: ', randomMonth);
    console.log('distribution', randomDistibution);
}

const testWeeklyGenderDistribution = async () => {
    const response = await fetch('http://localhost:4000/api/gender-distribution/weekly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
        }),
    });

    const data = await response.json();
    console.log(data);
    console.log('Keys of the response: ', Object.keys(data));
    console.log('Keys of the data entry in the response: ', Object.keys(data.data[0]));
    // accessing a random entry
    // accessing a random entry
    const randomDate = data.data[4].date
    const randomDistibution = data.data[4].distribution
    console.log('date: ', randomDate);
    console.log('distribution', randomDistibution);
}

const testMonthlyAgeDistribution = async () => {
    const response = await fetch('http://localhost:4000/api/age-distribution/monthly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
        }),
    });

    const data = await response.json();
    console.log(data);
    console.log('Keys of data: ', Object.keys(data));
    console.log('Keys of the data entry in the response: ', Object.keys(data.data[0]));
    const randomAges = data.data[0].distribution;
    console.log("random cusomters by age:", randomAges);

}

const testAnalytics = async () => {
    const response = await fetch('http://localhost:4000/api/dashboard/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '674857ee43ac1896622d5773',
            storeName: 'Berge - Boyle'
        }),
    });

    const data = await response.json();
    console.log('Data:', data);

    console.log('Daily Total Customers Difference: ', data.data.dailyTotal);
    console.log('Daily Avg Dwell Time Difference: ', data.data.dailyDwell);
    console.log('Weekly Total Customers Difference: ', data.data.weeklyTotal);
    console.log('Weekly Avg Dwell Time Difference: ', data.data.weeklyDwell);
    
    
}

console.log("Testing\n\n");

// console.log("Testing Dweel Time");
// console.log("Testing Monthly");
// await testMonthlyDwellTime().catch((error) => console.error('Error:', error));
// console.log("Testing Weekly");
// await testWeeklyDwellTime().catch((error) => console.error('Error:', error));
// console.log("Testing Total Customers");
// console.log("Testing Monthly");
// await testMonthlyTotalCustomers().catch((error) => console.error('Error:', error));
// console.log("Testing Weekly");
// await testWeeklyTotalCustomers().catch((error) => console.error('Error:', error));
// console.log("Testing Gender Distribution");
// console.log("Testing Monthly");
// await testMonthlyGenderDistribution();
// console.log("Testing Weekly");
// await testWeeklyGenderDistribution();
// console.log("Testing Age Distribution");
// await testMonthlyAgeDistribution();
console.log("Testing Analytics");
await testAnalytics();
