import { createNotification } from "../lib/handleNotifications.js";
const fetchOpenSlots = async (result) => {
    console.log(result);
    return new Promise((resolve, reject) => {
        console.log(result);
        const { locationId, startDate, endDate } = result;
        const API_ENDPOINT = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00`
        fetch(API_ENDPOINT)
            .then(response => response.json())
            .then(data => data.filter(slot => slot.active > 0))
            .then(data => resolve(data))
            .catch(error => reject(error))
    })
}

export default fetchOpenSlots;