import fs from 'fs/promises';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { extractPublicId } from 'cloudinary-build-url' // open-source package to extract publicId from url
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// uploading media and saving the url
var images_paths = [
    "tests/test_data/mediaUploadData/fake_images/heatmap1.jpeg",
    "tests/test_data/mediaUploadData/fake_images/heatmap2.jpeg",
    "tests/test_data/mediaUploadData/fake_images/heatmap3.jpeg"
];
var images_urls = [];
for (const path of images_paths) {
    const response = await cloudinary.uploader.upload(
        path,
        {
            asset_folder: 'heatmaps',
            resource_type: 'image'
        }
    );
    const url = response.url;
    images_urls.push(url);
}

var videos_paths = [
    "/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_videos/video1.mp4",
    "/Users/idanziv/dev/EyeSee/Server/tests/test_data/mediaUploadData/fake_videos/video2.mp4"
];
var videos_urls = [];
for (const path of videos_paths) {
    const response = await cloudinary.uploader.upload(
        path,
        {
            asset_folder: 'videos',
            resource_type: 'video'
        }
    );
    const url = response.url;
    videos_urls.push(url);
}

const userId = new mongoose.Types.ObjectId();
const storesIds = [new mongoose.Types.ObjectId()];

const passwordToHashMap = [];

async function createHashedPassowrd_raw() {
    const raw = faker.internet.password();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(raw, salt);
    passwordToHashMap.push({ password: raw, hash: hash });
    return hash;
}

async function createHashedPassowrd(user_raw) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user_raw, salt);
    passwordToHashMap.push({ password: user_raw, hash: hash });
    return hash;
}
// Generate fake user
const fakeUser = {
    _id: { $oid: userId.toString() },
    username: "media-test",
    firstName: "Eye",
    lastName: "See",
    password: await createHashedPassowrd("eyesee"),
    email: "fakeEyesee@email.com",
    mainStore: { $oid: storesIds[0].toString() },
    stores: storesIds.map(storesId => ({ $oid: storesId.toString() }))
}

// Generate fake stores

const fakeStores = storesIds.map(storeId => ({
    _id: { $oid: storeId.toString() },
    name: faker.company.name(),
    owner: { $oid: userId.toString() }, // Owner is the single user
    reports: [], // Initialize reports as an empty array (to be filled later)
}));

// Generate Reports

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
    const avgDwellTime = faker.number.float({ min: 0, max: 45 }); // in minutes
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

const fakeReports = storesIds.flatMap(storeId => {
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

// Generate fake heatmaps

const createdAt = new Date();
const heatmaps = images_urls.map((url, index) => {
    const heatmapId = new mongoose.Types.ObjectId();
    const formattedDate = new Date(createdAt.getTime() - index * 24 * 60 * 60 * 1000);
    const dateInFormat = {
        $date: { $numberLong: formattedDate.getTime().toString() }
    }
    const heatmap = {
        _id: { $oid: heatmapId.toString() },
        store: { $oid: storesIds[0].toString() },
        url: url,
        date: dateInFormat
    }
    return heatmap;
})

// Generate jobs

const jobs = videos_urls.map((url, index) => {
    const id = new mongoose.Types.ObjectId();
    const jobId = uuidv4();
    const formattedDate = new Date(createdAt.getTime() - index * 24 * 60 * 60 * 1000);
    const dateInFormat = {
        $date: { $numberLong: formattedDate.getTime().toString() }
    }
    const newJob = {
        _id: { $oid: id.toString() },
        jobId: jobId,
        userId: { $oid: userId.toString() },
        storeName: fakeStores[0].name,
        date: dateInFormat,
        startTime: "16:00",
        endTime: "17:00",
        length: 60,
        status: "Processing"
    }
    return newJob
})


// Save data
async function saveDataToJson() {
    try {
        await fs.writeFile('./mediaUpload_user.json', JSON.stringify([fakeUser], null, 4));
        console.log('User saved to mediaUpload_user.json');

        await fs.writeFile('./mediaUpload_store.json', JSON.stringify(fakeStores, null, 4));
        console.log('Store saved to mediaUpload_store.json');

        await fs.writeFile('./mediaUpload_reports.json', JSON.stringify(fakeReports, null, 4));
        console.log('Reports saved to mediaUpload_reports.json');

        await fs.writeFile('./passwordsMap.json', JSON.stringify(passwordToHashMap, null, 4));
        console.log('Password map saved to passwordsMap.json');

        await fs.writeFile('./mediaUpload_heatmaps.json', JSON.stringify(heatmaps, null, 4));
        console.log('Heatmaps saved to mediaUpload_heatmaps.json');

        await fs.writeFile('./mediaUpload_jobs.json', JSON.stringify(jobs, null, 4));
        console.log('Heatmaps saved to mediaUpload_jobs.json');

    } catch (error) {
        console.error('Error saving data to JSON files:', error);
    }
}

// Run the script
saveDataToJson();
