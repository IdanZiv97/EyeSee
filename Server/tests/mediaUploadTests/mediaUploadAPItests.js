import fetch from 'node-fetch';

const testVideoUpload = async () => {
    const response = await fetch('http://localhost:4000/video/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '6756e0c0dd0c9b2be7a21f45',
            storeName: 'Yundt - West',
            date: "2025-06-30",
            url: "http://res.cloudinary.com/dhvimkgc4/video/upload/v1733747961/kgv1k9jvdxxpanbs1tcm.mp4",
            startTime: "10:00",
            endTime: "17:00",
            length: 420
        }),
    });

    const data = await response.json();
    console.log(data);
    
}

const testRecentHeatmap = async () => {
    const response = await fetch('http://localhost:4000/heatmap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: '6756e0c0dd0c9b2be7a21f45',
            storeName: 'Yundt - West',
        }),
    });

    const data = await response.json();
    console.log(data);
}

// await testVideoUpload();
await testRecentHeatmap();