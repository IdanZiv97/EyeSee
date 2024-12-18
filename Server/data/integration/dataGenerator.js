import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { generateHourlyTimeSlices } from './helper.js';

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

var videos_paths = [
    '/Users/idanziv/dev/EyeSee/Server/data/videos/video1.mp4',
    '/Users/idanziv/dev/EyeSee/Server/data/videos/video2.mp4'
]

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

async function createHashedPassowrd() {
    const raw = faker.internet.password();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(raw, salt);
    passwordToHashMap.push({ password: raw, hash: hash });
    return hash;
}

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
    let index = 0;
    for (const path of videos_paths) {
        const jobId = new mongoose.Types.ObjectId();
        const formattedDate = new Date(endDate.getTime() - index * 24 * 60 * 60 * 1000);
        const dateInFormat = {
            $date: { $numberLong: formattedDate.getTime().toString() }
        };
        try {
            const response = await cloudinary.uploader.upload(
                path,
                {
                    asset_folder: 'videos',
                    resource_type: 'video'
                }
            );
            const url = response.url;
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
        } catch (error) {
            console.error('Error: ', error);
            process.exit(-1);
        }
    }
}
user1Jobs.forEach(job => fakeJobs.push(job));

passwordToHashMap.forEach((doc, index) => {
    doc.username = fakeUsers[index].username;
})

async function saveDataToJSON() {
    try {
        await fs.writeFile('./data/integration/users.json', JSON.stringify(fakeUsers, null, 4));
        console.log('Users saved to ./data/integration/users.json');

        await fs.writeFile('./data/integration/stores.json', JSON.stringify(fakeStores, null, 4));
        console.log('Test stores saved to ./data/integration/stores.json');

        await fs.writeFile('./data/integration/reports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Test reports saved to ./data/integration/reports.json');

        await fs.writeFile('./data/integration/heatmaps.json', JSON.stringify(fakeHeatmaps, null, 4));
        console.log('Test heatmaps saved to ./data/integration/heatmaps.json');

        await fs.writeFile('./data/integration/jobs.json', JSON.stringify(fakeJobs, null, 4));
        console.log('Test jobs saved to ./data/integration/jobs.json');

        await fs.writeFile('./data/integration/passwordsMap.json', JSON.stringify(passwordToHashMap, null, 4));
        console.log('Password to hash map saved to ./data/integration/passwordsMap.json');

    } catch (error) {
        console.error('Error saving data to JSON files: ', error);
    }
}

saveDataToJSON();