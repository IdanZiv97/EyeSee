import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { generateHourlyTimeSlices } from './helper.js';

/**
 * This code generates the fake data for the MVP.
 * It will have several users with multiple stores.
 */

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

var images_paths = [
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap1.png',
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap2.jpg',
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap3.png',
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap4.webp',
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap5.jpg',
    '/Users/idanziv/dev/EyeSee/Server/data/images/heatmap6.jpg',
]


// Globals

var passwordToHashMap = [];
const fakeUsers = [];
const fakeStores = [];
const fakeReports = [];
const fakeHeatmaps = [];
const fakeJobs = [];
const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1);
const endDate = new Date();
endDate.setMonth(11);
endDate.setDate(18);
const usersId = Array.from({ length: 3 }, () => new mongoose.Types.ObjectId());
const storesIds = Array.from({ length: 9 }, () => new mongoose.Types.ObjectId());

// Helper functions

async function createHashedPassowrd() {
    const raw = faker.internet.password();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(raw, salt);
    passwordToHashMap.push({ password: raw, hash: hash });
    return hash;
}


/**
 * Each user is created individualy since we need to give each different parameters
 */

// Faker User #1

const fakeUser1 = {
    _id: { $oid: usersId[0].toString() },
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: await createHashedPassowrd(),
    email: faker.internet.email(),
    mainStore: { $oid: storesIds[2].toString() },
    stores: storesIds.slice(0, 3).map(storeId => ({ $oid: storeId.toString() })),
}
fakeUsers.push(fakeUser1);

// for each store you should generate the reports seperatyle
const user1Stores = storesIds.slice(0, 3).map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: fakeUser1._id.$oid },
    reports: []
}));
// add to fake stores
user1Stores.forEach(store => fakeStores.push(store));

var totalReports = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));

const user1Reports = user1Stores.flatMap(store => {
    return Array.from({ length: totalReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices();
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const reportId = new mongoose.Types.ObjectId();
        const report = {
            _id: { $oid: reportId.toString() },
            store: { $oid: store._id.$oid },
            date: dateInFormat,
            hourlyReports
        };
        store.reports.push({ $oid: reportId.toString() });
        return report;
    });
});
// add the reports
user1Reports.forEach(report => fakeReports.push(report));

// create heatmaps
const user1Heatmaps = [];
// iterate through the stores and for each store upload all the photos
for (const store of user1Stores) {
    let index = 0;
    for (const path of images_paths) {
        const heatmapId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        index++;
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        try {
            const response = await cloudinary.uploader.upload(
                path,
                {
                    asset_folder: 'heatmaps',
                    resource_type: 'image'
                }
            );
            // get the url
            const url = response.url;
            // create heatmap
            const new_heatmap = {
                _id: { $oid: heatmapId.toString() },
                store: { $oid: store._id.$oid },
                date: dateInFormat,
                url: url
            }
            user1Heatmaps.push(new_heatmap);
        } catch (error) {
            console.error('Error: ', error);
            process.exit(-1);
        }
    }
    // push the heatmaps of the user
}
user1Heatmaps.forEach((heatmap) => fakeHeatmaps.push(heatmap));
// create the jobs
const user1Jobs = [];
for (const store of user1Stores) {
    for (let index = 0; index < 30; index++) {
        const jobId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const url = faker.internet.url();
        const uuid = uuidv4();
        const new_job = {
            _id: { $oid: jobId.toString() },
            jobId: uuid,
            userId: { $oid: store.owner.$oid },
            storeName: store.name,
            date: dateInFormat,
            url: url,
            startTime: "10:00",
            endTime: "13:00",
            length: "180",
            status: "Completed"
        }
        user1Jobs.push(new_job)
    }
}
user1Jobs.forEach(job => fakeJobs.push(job));

// Fake User #2

const fakeUser2 = {
    _id: { $oid: usersId[1].toString() },
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: await createHashedPassowrd(),
    email: faker.internet.email(),
    mainStore: { $oid: storesIds[4].toString() },
    stores: storesIds.slice(3, 6).map(storeId => ({ $oid: storeId.toString() })),
}
fakeUsers.push(fakeUser2);

// for each store you should generate the reports seperatyle
const user2Stores = storesIds.slice(3, 6).map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: fakeUser2._id.$oid },
    reports: []
}));
// add to fake stores
user2Stores.forEach(store => fakeStores.push(store));

var totalReports = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));

const user2Reports = user2Stores.flatMap(store => {
    return Array.from({ length: totalReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices();
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const reportId = new mongoose.Types.ObjectId();
        const report = {
            _id: { $oid: reportId.toString() },
            store: { $oid: store._id.$oid },
            date: dateInFormat,
            hourlyReports
        };
        store.reports.push({ $oid: reportId.toString() });
        return report;
    });
});
// add the reports
user2Reports.forEach(report => fakeReports.push(report));

// create heatmaps
const user2Heatmaps = [];
// iterate through the stores and for each store upload all the photos
for (const store of user2Stores) {
    let index = 0;
    for (const path of images_paths) {
        const heatmapId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        index++;
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        try {
            const response = await cloudinary.uploader.upload(
                path,
                {
                    asset_folder: 'heatmaps',
                    resource_type: 'image'
                }
            );
            // get the url
            const url = response.url;
            // create heatmap
            const new_heatmap = {
                _id: { $oid: heatmapId.toString() },
                store: { $oid: store._id.$oid },
                date: dateInFormat,
                url: url
            }
            user2Heatmaps.push(new_heatmap);
        } catch (error) {
            console.error('Error: ', error);
            process.exit(-1);
        }
    }
}
user2Heatmaps.forEach((heatmap) => fakeHeatmaps.push(heatmap));
// create the jobs
const user2Jobs = [];
for (const store of user2Stores) {
    for (let index = 0; index < 30; index++) {
        const jobId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const url = faker.internet.url();
        const uuid = uuidv4();
        const new_job = {
            _id: { $oid: jobId.toString() },
            jobId: uuid,
            userId: { $oid: store.owner.$oid },
            storeName: store.name,
            date: dateInFormat,
            url: url,
            startTime: "10:00",
            endTime: "13:00",
            length: "180",
            status: "Completed"
        }
        user2Jobs.push(new_job)
    }
}
user2Jobs.forEach(job => fakeJobs.push(job));

// Fake User #3

const fakeUser3 = {
    _id: { $oid: usersId[2].toString() },
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: await createHashedPassowrd(),
    email: faker.internet.email(),
    mainStore: { $oid: storesIds[6].toString() },
    stores: storesIds.slice(6).map(storeId => ({ $oid: storeId.toString() })),
}
fakeUsers.push(fakeUser3);

// for each store you should generate the reports seperatyle
const user3Stores = storesIds.slice(6).map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: fakeUser3._id.$oid },
    reports: []
}));
// add to fake stores
user2Stores.forEach(store => fakeStores.push(store));

var totalReports = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));

const user3Reports = user3Stores.flatMap(store => {
    return Array.from({ length: totalReports }, (_, i) => {
        const hourlyReports = generateHourlyTimeSlices();
        const formattedDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const reportId = new mongoose.Types.ObjectId();
        const report = {
            _id: { $oid: reportId.toString() },
            store: { $oid: store._id.$oid },
            date: dateInFormat,
            hourlyReports
        };
        store.reports.push({ $oid: reportId.toString() });
        return report;
    });
});
// add the reports
user3Reports.forEach(report => fakeReports.push(report));

// create heatmaps
const user3Heatmaps = [];
// iterate through the stores and for each store upload all the photos
for (const store of user3Stores) {
    let index = 0;
    for (const path of images_paths) {
        const heatmapId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        index++;
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        try {
            const response = await cloudinary.uploader.upload(
                path,
                {
                    asset_folder: 'heatmaps',
                    resource_type: 'image'
                }
            );
            // get the url
            const url = response.url;
            // create heatmap
            const new_heatmap = {
                _id: { $oid: heatmapId.toString() },
                store: { $oid: store._id.$oid },
                date: dateInFormat,
                url: url
            }
            user3Heatmaps.push(new_heatmap);
        } catch (error) {
            console.error('Error: ', error);
            process.exit(-1);
        }
    }
}
user3Heatmaps.forEach((heatmap) => fakeHeatmaps.push(heatmap));
// create the jobs
const user3Jobs = [];
for (const store of user3Stores) {
    for (let index = 0; index < 30; index++) {
        const jobId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        const url = faker.internet.url();
        const uuid = uuidv4();
        const new_job = {
            _id: { $oid: jobId.toString() },
            jobId: uuid,
            userId: { $oid: store.owner.$oid },
            storeName: store.name,
            date: dateInFormat,
            url: url,
            startTime: "10:00",
            endTime: "13:00",
            length: "180",
            status: "Completed"
        }
        user3Jobs.push(new_job)
    }
}
user3Jobs.forEach(job => fakeJobs.push(job));

passwordToHashMap.forEach((doc, index) => {
    doc.username = fakeUsers[index].username;
})

async function saveDataToJSON() {
    try {
        // Write each user
        // User1
        await fs.writeFile('./data/users/user1.json', JSON.stringify([fakeUser1], null, 4));
        console.log('User1 saved to ./data/users/user1.json');

        await fs.writeFile('./data/stores/user1_stores.json', JSON.stringify(user1Stores, null, 4));
        console.log('User1 stores saved to ./data/stores/user1_stores.json');

        await fs.writeFile('./data/reports/user1_reports.json', JSON.stringify(user1Reports, null, 4));
        console.log('User1 reports saved to ./data/reports/user1_reports.json');

        await fs.writeFile('./data/heatmaps/user1_heatmaps.json', JSON.stringify(user1Heatmaps, null, 4));
        console.log('User1 heatmaps saved to ./data/heatmaps/user1_heatmaps.json');

        await fs.writeFile('./data/jobs/user1_jobs.json', JSON.stringify(user1Jobs, null, 4));
        console.log('User1 jobs saved to ./data/jobs/user1_jobs.json');

        // User2 
        await fs.writeFile('./data/users/user2.json', JSON.stringify([fakeUser2], null, 4));
        console.log('User1 saved to ./data/users/user2.json');

        await fs.writeFile('./data/stores/user2_stores.json', JSON.stringify(user2Stores, null, 4));
        console.log('User2 stores saved to ./data/stores/user2_stores.json');

        await fs.writeFile('./data/reports/user2_reports.json', JSON.stringify(user2Reports, null, 4));
        console.log('User2 reports saved to ./data/reports/user2_reports.json');

        await fs.writeFile('./data/heatmaps/user2_heatmaps.json', JSON.stringify(user2Heatmaps, null, 4));
        console.log('User2 heatmaps saved to ./data/heatmaps/user2_heatmaps.json');

        await fs.writeFile('./data/jobs/user2_jobs.json', JSON.stringify(user2Jobs, null, 4));
        console.log('User2 jobs saved to ./data/jobs/user2_jobs.json');

        // User 3
        await fs.writeFile('./data/users/user3.json', JSON.stringify([fakeUser3], null, 4));
        console.log('User3 saved to ./data/users/user3.json');

        await fs.writeFile('./data/stores/user3_stores.json', JSON.stringify(user3Stores, null, 4));
        console.log('User3 stores saved to ./data/stores/user3_stores.json');

        await fs.writeFile('./data/reports/user3_reports.json', JSON.stringify(user3Reports, null, 4));
        console.log('User3 reports saved to ./data/reports/user3_reports.json');

        await fs.writeFile('./data/heatmaps/user3_heatmaps.json', JSON.stringify(user3Heatmaps, null, 4));
        console.log('User3 heatmaps saved to ./data/heatmaps/user3_heatmaps.json');

        await fs.writeFile('./data/jobs/user3Jobs.json', JSON.stringify(user3Jobs, null, 4));
        console.log('User3 jobs saved to ./data/jobs/user3Jobs.json');

        // General Data
        await fs.writeFile('./data/general/users.json', JSON.stringify(fakeUsers, null, 4));
        console.log('Users saved to ./data/general/users.json');

        await fs.writeFile('./data/general/stores.json', JSON.stringify(fakeStores, null, 4));
        console.log('Test stores saved to ./data/general/stores.json');

        await fs.writeFile('./data/general/reports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Test reports saved to ./data/general/reports.json');

        await fs.writeFile('./data/general/heatmaps.json', JSON.stringify(fakeHeatmaps, null, 4));
        console.log('Test heatmaps saved to ./data/general/heatmaps.json');

        await fs.writeFile('./data/general/jobs.json', JSON.stringify(fakeJobs, null, 4));
        console.log('Test jobs saved to ./data/general/jobs.json');

        await fs.writeFile('./data/general/passwordsMap.json', JSON.stringify(passwordToHashMap, null, 4));
        console.log('Password to hash map saved to ./data/general/passwordsMap.json');

    } catch (error) {
        console.error('Error saving data to JSON files: ', error);
    }
}

saveDataToJSON();