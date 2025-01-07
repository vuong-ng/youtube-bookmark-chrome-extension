
export default function fetchOpenSlots (result) {
    console.log(result);
    const { locationId, startDate, endDate } = result;
    const API_ENDPOINT = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00`
    fetch(API_ENDPOINT)
        .then((response) => response.json())
        .then(data => data.filter(slot => slot.active > 0))
        .then(data => console.log(data))
        .catch(error => console.log(error))
}