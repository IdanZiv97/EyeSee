import fetch from 'node-fetch';

const hourlyReports = [
    {
        timeSlice: "08:00-09:00",
        totalCustomers: 50,
        totalMaleCustomers: 30,
        totalFemaleCustomers: 20,
        customersByAge: {
            "18-25": 15,
            "26-35": 20,
            "36-45": 10,
            "46-60": 5
        }
    },
    {
        timeSlice: "09:00-10:00",
        totalCustomers: 60,
        totalMaleCustomers: 35,
        totalFemaleCustomers: 25,
        customersByAge: {
            "18-25": 20,
            "26-35": 25,
            "36-45": 10,
            "46-60": 5
        }
    }
];

const createReport = async () => {
    const response = await fetch('http://localhost:4000/report/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jobId: '1a0f6680-a6a6-4517-a738-1051c8aa07ad',
            reports: hourlyReports
        }),
    });

    const data = await response.json();
    console.log(data);
}

createReport().catch((error) => console.error('Error:', error));
