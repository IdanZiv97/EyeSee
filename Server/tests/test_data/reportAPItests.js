import fetch from 'node-fetch';
import fs from 'fs';

const testDefault = async () => {
    const response = await fetch('http://localhost:4000/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '67405149a52d488597dffe5b'
        }),
    });

    const data = await response.json();
    console.log(data);
    console.log('keys: ', Object.keys(data));
    
    console.log("2nd keys: ", Object.keys(data.transformedReports[0]));

    console.log('ages: ', data.transformedReports[6].ages);
    
    
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
            userId: '67405149a52d488597dffe5b',
            storeName: 'Vandervort - Schiller',
            date: '2024-11-22'
        })
    })
    const data = await response.json();
    console.log(data);
    
}

const testQureyByDates = async () => {
    const response = await fetch('http://localhost:4000/report/byDates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '67405149a52d488597dffe5b',
            storeName: 'Vandervort - Schiller',
            start: '2024-11-22',
            end: '2024-11-23'
        })
    })
    const data = await response.json();
    console.log('DATA:\n', data);
    var len = data.length;
    console.log("Number of reports found: ", len);
    var keys = Object.keys(data[0]);
    console.log('keys of each item: ', keys);
    var transformedReportsKeys = Object.keys(data[0].hourlyReports[0])
    console.log('keys of hourlyReports: ', transformedReportsKeys);
    console.log('ages: ', data[0].hourlyReports[7].customersByAge);
    
    
}

const testQureyByGender = async () => {
    const response = await fetch('http://localhost:4000/report/byGender', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '6739f3b018369a2a09389057',
            storeName: 'Berge and Sons',
            gender: 'female',
            start: '2023-11-30',
            end: '2025-11-19'
        })
    })
    const data = await response.json();
    var len = data.length;
    var keys = Object.keys(data[0]);
    console.log('len: ', len);
    console.log('keys of each entry: ', keys);
    var dataOfSubReport = data[0]['hourlyReports']
    console.log('data of a hourly report: ', dataOfSubReport);
}

const testQueryByAges = async () => {
    const response = await fetch('http://localhost:4000/report/byAges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: '67405149a52d488597dffe5b',
            storeName: 'Vandervort - Schiller',
            start: '2024-11-22',
            end: '2024-11-22'
        })
    })
    const data = await response.json();
    console.log('DATA:\n', data);
    console.log('Hourly Reports:\n', data[0].hourlyReports);
    
}

testQueryByAges().catch((error) => console.error('Error:', error));