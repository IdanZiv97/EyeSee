import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

// Step 1: Create a single user with two stores
const userId = new mongoose.Types.ObjectId();
const storeIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

// Step 2: Generate a single user with two stores
const fakeUser = {
    _id: { $oid: userId.toString() },
    username: faker.internet.username(),
    email: faker.internet.email(),
    mainStore: { $oid: storeIds[0].toString() }, // First store is the main store
    stores: storeIds.map(storeId => ({ $oid: storeId.toString() })), // Both stores owned by this user
};

// Step 3: Generate stores for this user
const fakeStores = storeIds.map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: userId.toString() }, // Owner is the single user
    reports: [], // Initialize reports as an empty array (to be filled later)
}));

// Step 4: Functions to generate hourly reports

// Generate random customers by age group
function generateCustomersByAge(totalCustomers) {
    const ageGroups = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60+'];
    const customersByAge = {};

    let remainingCustomers = totalCustomers;
    ageGroups.forEach((group, index) => {
        if (index === ageGroups.length - 1) {
            customersByAge[group] = remainingCustomers; // Assign remaining customers to the last group
        } else {
            const count = faker.number.int({ min: 0, max: remainingCustomers });
            customersByAge[group] = count;
            remainingCustomers -= count;
        }
    });

    return customersByAge;
}

// Generate a single hourly report
function generateHourlyReport(timeSlice) {
    const totalCustomers = faker.number.int({ min: 0, max: 100 });
    const totalMaleCustomers = faker.number.int({ min: 0, max: totalCustomers });
    const totalFemaleCustomers = totalCustomers - totalMaleCustomers;
    const customersByAge = generateCustomersByAge(totalCustomers);

    return {
        timeSlice,
        totalCustomers,
        totalMaleCustomers,
        totalFemaleCustomers,
        customersByAge,
    };
}

// Generate all hourly time slices for a report
function generateHourlyTimeSlices() {
    const startHour = faker.number.int({ min: 0, max: 12 }); // Start at a random hour between 0 and 12
    return Array.from({ length: 12 }, (_, index) => {
        const start = (startHour + index) % 24; // Wrap around for 24-hour time
        const end = (start + 1) % 24;
        const timeSlice = `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
        return generateHourlyReport(timeSlice);
    });
}

// Step 5: Generate reports with consecutive dates for each store
const fakeReports = storeIds.flatMap(storeId => {
    const numReports = 5; // 5 reports per store
    const startDate = faker.date.recent(10); // Start date within the last 10 days

    return Array.from({ length: numReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices(); // Generate hourly reports for this report

        // Convert the date to a timestamp and format it as { "$date": { "$numberLong": "timestamp" } }
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Add 'i' days for consecutive dates
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };

        const report = {
            store: { $oid: storeId.toString() },
            date: dateInFormat,
            hourlyReports,
        };

        // Add report to the store's reports array
        fakeStores.find(store => store._id.$oid === storeId.toString()).reports.push({ $oid: storeId.toString() });
        return report;
    });
});

// Step 6: Save data to JSON files
async function saveDataToJson() {
    try {
        await fs.writeFile('./single_fakeUsers.json', JSON.stringify([fakeUser], null, 4));
        console.log('Single fake user saved to single_fakeUsers.json');
        
        await fs.writeFile('./single_fakeStores.json', JSON.stringify(fakeStores, null, 4));
        console.log('Single fake stores saved to single_fakeStores.json');
        
        await fs.writeFile('./single_fakeReports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Single fake reports saved to single_fakeReports.json');
    } catch (error) {
        console.error('Error saving data to JSON files:', error);
    }
}

// Run the script
saveDataToJson();
