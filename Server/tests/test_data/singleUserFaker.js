import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Step 1: Create a single user with two stores
const userId = new mongoose.Types.ObjectId();
const storeIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
const passwordToHashMap = [];

async function createHashedPassowrd() {
    const raw = faker.internet.password();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(raw, salt);
    passwordToHashMap.push({passwor: raw, hash: hash});
    return hash;
}

// Step 2: Generate a single user with two stores
const fakeUser = {
    _id: { $oid: userId.toString() },
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: await createHashedPassowrd(),
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
            customersByAge[group] = remainingCustomers;
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

// Generate all hourly time slices for a report
function generateHourlyTimeSlices() {
    const startHour = faker.number.int({ min: 7, max: 10 }); // Determine the start of the work day
    return Array.from({ length: 12 }, (_, index) => {
        const start = (startHour + index) % 24;
        const end = (start + 1) % 24;
        const timeSlice = `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
        return generateHourlyReport(timeSlice);
    });
}

// Step 5: Generate reports with consecutive dates for each store

// Update the start date to one year ago
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1); // Set the start date to 1 year ago

// Calculate the number of days between the start date and the end of this year
const endDate = new Date();
endDate.setMonth(11); // December
endDate.setDate(31); // Last day of the year

const totalReports = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)); // Calculate the total number of reports

const fakeReports = storeIds.flatMap(storeId => {
    return Array.from({ length: totalReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices(); // Generate hourly reports for this report

        // Add 'i' days to the start date to generate consecutive dates
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); 
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const reportId = new mongoose.Types.ObjectId();
        const report = {
            _id: { $oid: reportId.toString() },
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
        await fs.writeFile('./single_fakeUserYearly.json', JSON.stringify([fakeUser], null, 4));
        console.log('Single fake user saved to single_fakeUsers.json');
        
        await fs.writeFile('./single_fakeStoresYearly.json', JSON.stringify(fakeStores, null, 4));
        console.log('Single fake stores saved to single_fakeStores.json');
        
        await fs.writeFile('./single_fakeReportsYearly.json', JSON.stringify(fakeReports, null, 4));
        console.log('Single fake reports saved to single_fakeReports.json');

        await fs.writeFile('./passwordsMap.json', JSON.stringify(passwordToHashMap, null, 4));
        console.log('Password map saved to passwordsMap.json');
        
    } catch (error) {
        console.error('Error saving data to JSON files:', error);
    }
}

// Run the script
saveDataToJson();
