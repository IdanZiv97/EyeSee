import config from "config";
export default async function fetchData(userId, start, end, storeName) {
  try {
      const response = await fetch(`${config.SERVER_DOMAIN}/report/byDates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            storeName: storeName,
            start: start,
            end: end
        })
    })
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error from server: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// New function renamed to fetchDataInit
export async function fetchDataInit(userId, store) {
  try {
    const response = await fetch(`${config.SERVER_DOMAIN}/report`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId: userId,
          storeName: store
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error from server: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
