import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Create user and stores
const userId = new mongoose.Types.ObjectId();
const storesId = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

const passwordToHashMap = [];

async function createHashedPassowrd() {
    const raw = faker.internet.password();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(raw, salt);
    passwordToHashMap.push({ password: raw, hashValue: hash });
    return hash;
}

// Create the user:

const fakeUser = {
    _id: { $oid: userId.toString() },
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: await createHashedPassowrd(), // assign the hash value of the chosen password
    email: faker.internet.email(),
    mainStore: { $oid: storesId[0].toString() }, // assign main store
    stores: storesId.map(storeId => ({ $oid: storeId.toString() })), // assign the stores
};


// Create the stores them selves

const fakeStores = storesId.map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: userId.toString() },
    reports: []
}));

// Generate the reports

// Helper fucntions

function generateCustomersByAge(totalCustomers) {
    const ageGroups = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60+'];
    const customersByAge = {};
    
    let remainingCustomers = totalCustomers;
    ageGroups.forEach((group, index) => {
        // when you reach the last age class you assign the remainging amount of customers
        if (index === ageGroups.length - 1) {
            customersByAge[group] = remainingCustomers;
        } else {
            const count = faker.number.int({ min: 0, max: remainingCustomers });
            customersByAge[group] = count;
            remainingCustomers -= count;
        }
    });

    return customersByAge;
}

function generateHourlyReport(timeSlice) {
    const totalCustomers = faker.number.int({ min: 0, max: 100 });
    const totalMaleCustomers = faker.number.int({ min: 0, max: totalCustomers });
    const avgDwellTime = faker.number.float({min: 0, max: 45}); // in minutes
    const totalFemaleCustomers = totalCustomers - totalMaleCustomers;
    const customersByAge = generateCustomersByAge(totalCustomers);

    return {
        timeSlice,
        totalCustomers,
        avgDwellTime,
        totalMaleCustomers,
        totalFemaleCustomers,
        customersByAge,
    };
}

function generateHourlyTimeSlices() {
    const startHour = faker.number.int({ min: 7, max:  10}); // Determine the start of the work day
    return Array.from({ length: 12 }, (_, index) => {
        const start = (startHour + index) % 24;
        const end = (start + 1) % 24;
        const timeSlice = `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
        return generateHourlyReport(timeSlice);
    });
}

const fakeReports = storesId.flatMap(storeId => {
    const numReports = 5; 
    const startDate = new Date('2024-11-21T00:00:00Z'); // Start a year from now

    return Array.from({ length: numReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices(); // Generate hourly reports for this report

        // Convert the date to a timestamp and format it as { "$date": { "$numberLong": "timestamp" } }
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Add 'i' days for consecutive dates
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const reportId = new mongoose.Types.ObjectId();
        const report = {
            _id: { $oid: reportId.toString()},
            store: { $oid: storeId.toString() },
            date: dateInFormat,
            hourlyReports,
        };

        // Add report to the store's reports array
        fakeStores.find(store => store._id.$oid === storeId.toString()).reports.push({ $oid: reportId.toString() });
        return report;
    });
});

// Step 6: Save data to JSON files
async function saveDataToJson() {
    try {
        await fs.writeFile('./tests/stores/storesAPItest_user.json', JSON.stringify([fakeUser], null, 4));
        console.log('Fake user saved to storesAPItest_user.json');
        
        await fs.writeFile('./tests/stores/storesAPItest_stores.json', JSON.stringify(fakeStores, null, 4));
        console.log('Fake stores saved to storesAPItest_stores.json');
        
        await fs.writeFile('./tests/stores/storesAPItest_reports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Fake reports saved to storesAPItest_reports.json');

        await fs.writeFile('./tests/stores/passwordsMap.json', JSON.stringify(passwordToHashMap, null, 4));
        console.log('Password map saved to passwordsMap.json');
        
    } catch (error) {
        console.error('Error saving data to JSON files:', error);
    }
}

// Run the script
saveDataToJson();