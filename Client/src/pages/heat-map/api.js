import config from "config";
export default async function fetchData(userId, start, end, storeName) {
  try {
      const response = await fetch(`${config.SERVER_DOMAIN}/heatmap/byDates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            storeName: storeName,
            startDate: start,
            endDate: end
        })
    })
    const data = await response.json();
    if (!response.ok) {
      const errorText = await data.msg;
      throw new Error(`${errorText}`);
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// New function renamed to fetchDataInit
export async function fetchDataInit(userId, store) {
  try {
    const response = await fetch(`${config.SERVER_DOMAIN}/heatmap`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId: userId,
          storeName: store
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const errorText = await data.msg;
      throw new Error(`${errorText}`);
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
