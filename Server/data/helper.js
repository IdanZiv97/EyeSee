import { faker } from "@faker-js/faker";


const generateCustomersByAge = (totalCustomers) => {
    const ageGroups = ['young', 'children', 'adult', 'elder'];
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

const generateHourlyReport = (timeSlice) => {
    const totalCustomers = faker.number.int({ min: 0, max: 100 });
    const totalMaleCustomers = faker.number.int({ min: 0, max: totalCustomers });
    const totalFemaleCustomers = totalCustomers - totalMaleCustomers;
    const avgDwellTime = faker.number.float({ min: 0, max: 45 });
    const customersByAge = generateCustomersByAge(totalCustomers);

    return {
        timeSlice,
        totalCustomers,
        avgDwellTime,
        totalMaleCustomers,
        totalFemaleCustomers,
        customersByAge
    };
}

export const generateHourlyTimeSlices = () => {
    const startHour = faker.number.int({ min: 7, max: 10 });
    return Array.from({ length: 12 }, (_, index) => {
        const start = (startHour + index) % 24;
        const end = (start + 1) % 24;
        const timeSlice = `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
        return generateHourlyReport(timeSlice);
    });
}