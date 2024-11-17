import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

// Step 1: Generate fake ObjectIds for users and stores
const userIds = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());
const storeIds = [];

// Step 2: Generate data for users
const fakeUsers = userIds.map(userId => {
    const numStores = faker.number.int({ min: 1, max: 3 }); // 1 to 3 stores per user
    const userStoreIds = Array.from({ length: numStores }, () => {
        const storeId = new mongoose.Types.ObjectId();
        storeIds.push(storeId); // Collect store IDs
        return storeId;
    });

    return {
        _id: { $oid: userId.toString() },
        username: faker.internet.username(),
        email: faker.internet.email(),
        mainStore: { $oid: userStoreIds[0].toString() }, // First store is the main store
        stores: userStoreIds.map(storeId => ({ $oid: storeId.toString() })), // All stores owned by this user
    };
});

// Step 3: Generate data for stores
const fakeStores = storeIds.map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: userIds.find(userId =>
        fakeUsers.some(user => user._id.$oid === userId.toString() && user.stores.some(store => store.$oid === storeId.toString()))
    ).toString() }, // Find the owner of this store
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

// Step 5: Generate data for reports with consecutive dates
const fakeReports = storeIds.flatMap(storeId => {
    const numReports = faker.number.int({ min: 3, max: 5 }); // 3 to 5 reports per store
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
        await fs.writeFile('./fakeUsers.json', JSON.stringify(fakeUsers, null, 4));
        console.log('Fake users saved to fakeUsers.json');
        
        await fs.writeFile('./fakeStores.json', JSON.stringify(fakeStores, null, 4));
        console.log('Fake stores saved to fakeStores.json');
        
        await fs.writeFile('./fakeReports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Fake reports saved to fakeReports.json');
    } catch (error) {
        console.error('Error saving data to JSON files:', error);
    }
}

// Run the script
saveDataToJson();
